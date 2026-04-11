"use client";

import { useState, useEffect } from "react";
import { ClayCard } from "@/components/ClayCard";
import { ClayButton } from "@/components/ClayButton";
import { Calendar, Clock, Plus } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

type EventItem = {
  id: string;
  start_time: string;
  end_time: string;
  tasks: { title: string } | null;
};

export default function Home() {
  const supabase = createClient();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  
  // Form state
  const [newEventTitle, setNewEventTitle] = useState("");
  
  // Set default times for form
  const defaultStart = new Date();
  defaultStart.setMinutes(Math.ceil(defaultStart.getMinutes() / 15) * 15);
  const defaultEnd = new Date(defaultStart);
  defaultEnd.setHours(defaultEnd.getHours() + 1);
  
  const [newStartTime, setNewStartTime] = useState(
    defaultStart.toTimeString().slice(0, 5)
  );
  const [newEndTime, setNewEndTime] = useState(
    defaultEnd.toTimeString().slice(0, 5)
  );

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    const start = new Date(); start.setHours(0,0,0,0);
    const end = new Date(); end.setHours(23,59,59,999);

    const { data } = await supabase
      .from('schedule_blocks')
      .select('id, start_time, end_time, tasks!inner(title)')
      .eq('user_id', user.id)
      .gte('start_time', start.toISOString())
      .lte('start_time', end.toISOString())
      .order('start_time', { ascending: true });

    if (data) {
      setEvents(data as unknown as EventItem[]);
    }
    setIsLoading(false);
  };

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim() || !newStartTime || !newEndTime) return;
    
    setIsLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Combine today's date with the selected times
    const dateObj = new Date();
    const startObj = new Date(dateObj.toDateString() + ' ' + newStartTime);
    const endObj = new Date(dateObj.toDateString() + ' ' + newEndTime);

    // 1. Create an entry in tasks (since our schema expects an event to map to a task)
    const { data: task } = await supabase.from('tasks').insert({
      user_id: user.id,
      title: newEventTitle,
      status: 'pending'
    }).select().single();

    // 2. Create schedule block linking to task
    if (task) {
      await supabase.from('schedule_blocks').insert({
        user_id: user.id,
        task_id: task.id,
        start_time: startObj.toISOString(),
        end_time: endObj.toISOString()
      });
      fetchEvents();
      setIsAdding(false);
      setNewEventTitle("");
    }
  };

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen p-8 md:p-12 flex flex-col gap-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-bold text-slate-100 tracking-tight">Smart Timetable</h1>
          <p className="text-slate-300 mt-2 text-lg">Manage your classes, assignments, and schedule</p>
        </div>
        <div className="flex gap-4">
          <ClayButton className="flex gap-2" onClick={() => setIsAdding(!isAdding)}>
            <Plus className="w-5 h-5" />
            Add Event
          </ClayButton>
        </div>
      </header>

      {isAdding && (
        <form onSubmit={handleAddEvent} className="bg-slate-800 bg-opacity-40 p-6 rounded-3xl border border-white border-opacity-50 shadow-sm border border-slate-700 flex flex-col md:flex-row gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <input 
            type="text" 
            value={newEventTitle} 
            onChange={(e) => setNewEventTitle(e.target.value)} 
            placeholder="Event Name (e.g. History Class)"
            className="flex-1 bg-white border-none px-4 py-3 rounded-2xl shadow-sm border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-100"
            required
            autoFocus
          />
          <input 
            type="time" 
            value={newStartTime} 
            onChange={(e) => setNewStartTime(e.target.value)} 
            className="bg-white border-none px-4 py-3 rounded-2xl shadow-sm border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-300 font-medium"
            required
          />
          <span className="text-slate-400 self-center font-bold">to</span>
          <input 
            type="time" 
            value={newEndTime} 
            onChange={(e) => setNewEndTime(e.target.value)} 
            className="bg-white border-none px-4 py-3 rounded-2xl shadow-sm border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-300 font-medium"
            required
          />
          <ClayButton type="submit">Save Event</ClayButton>
          <ClayButton type="button" variant="secondary" onClick={() => setIsAdding(false)}>Cancel</ClayButton>
        </form>
      )}

      <main className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column - Today's Schedule overview */}
        <div className="col-span-1 md:col-span-2 flex flex-col gap-8">
          <h2 className="text-2xl font-semibold text-slate-100">Today's Schedule</h2>
          
          <div className="flex flex-col gap-6">
            {isLoading ? (
              <div className="p-8 text-center text-slate-400 font-medium">Loading your schedule...</div>
            ) : events.length === 0 ? (
              <div className="p-8 text-center text-slate-400 font-medium">You have no events scheduled for today. Free time!</div>
            ) : events.map((event, i) => (
              <ClayCard key={event.id} className="flex flex-col sm:flex-row items-start sm:items-center p-6 gap-6">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm border border-slate-700 flex-shrink-0 text-slate-200 ${i % 2 === 0 ? 'bg-indigo-500' : 'bg-indigo-600'}`}>
                  <Calendar className="w-8 h-8" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-100">{event.tasks?.title || "Busy Block"}</h3>
                  <p className="text-slate-300 mt-1 flex items-center gap-2">
                    <Clock className="w-4 h-4" /> {formatTime(event.start_time)} - {formatTime(event.end_time)}
                  </p>
                </div>
                <div>
                  <span className="px-4 py-2 bg-slate-800 rounded-xl shadow-sm border border-slate-700 text-sm font-semibold text-slate-200">
                    Scheduled
                  </span>
                </div>
              </ClayCard>
            ))}
          </div>
        </div>

        {/* Right Column - Summary / Quick Add */}
        <div className="col-span-1 flex flex-col gap-8">
          <h2 className="text-2xl font-semibold text-slate-100">Overview</h2>
          <ClayCard className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <span className="text-slate-200 font-medium">Completed Classes</span>
              <span className="text-2xl font-bold text-indigo-400">0/0</span>
            </div>
            <div className="w-full bg-slate-800 h-4 rounded-full shadow-inner overflow-hidden">
              <div className="w-0 bg-indigo-500 h-full rounded-full transition-all duration-300"></div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-slate-200 border-opacity-50">
              <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Upcoming Deadlines</h4>
              <ul className="flex flex-col gap-3">
                <li className="text-slate-400 text-sm font-medium">
                  Deadlines list is coming soon...
                </li>
              </ul>
            </div>
          </ClayCard>
        </div>
      </main>
    </div>
  );
}

