"use client";

import { useState, useEffect } from "react";
import { ClayCard } from "@/components/ClayCard";
import { Play, Pause, RotateCcw } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export function FocusTimer() {
  const DEFAULT_TIME = 25 * 60; // 25 minutes
  const BREAK_TIME = 5 * 60; // 5 minutes

  const supabase = createClient();
  const [tasks, setTasks] = useState<{id: string, title: string}[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState("");

  const [timeLeft, setTimeLeft] = useState(DEFAULT_TIME);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        supabase.from('tasks')
          .select('id, title')
          .eq('user_id', user.id)
          .eq('status', 'pending')
          .order('created_at', { ascending: false })
          .then(({ data }) => {
            if (data) setTasks(data);
          });
      }
    });

    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, supabase]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setIsBreak(false);
    setTimeLeft(DEFAULT_TIME);
  };
  
  const startBreak = () => {
    setIsActive(false);
    setIsBreak(true);
    setTimeLeft(BREAK_TIME);
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const isFinished = timeLeft === 0;
  
  return (
    <ClayCard className={`bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6 transition-all duration-1000 ${
      isFinished && !isBreak ? 'bg-[#d1fae5] shadow-[0_0_40px_rgba(52,211,153,0.3)] animate-pulse' : ''
    }`}>
      <div className="flex flex-col gap-2 text-center md:text-left w-full max-w-sm">
        <h2 className="text-2xl font-bold text-slate-100">
          {isBreak ? "Break Time ☕" : "Focus Timer 🧠"}
        </h2>
        
        {!isBreak ? (
          tasks.length > 0 ? (
             <select 
               className="mt-2 text-slate-100 bg-white border-none py-3 px-4 rounded-xl shadow-sm border border-slate-700 outline-none w-full font-medium focus:ring-2 focus:ring-indigo-500 appearance-none truncate"
               value={selectedTaskId}
               onChange={(e) => setSelectedTaskId(e.target.value)}
             >
               <option value="">Select a task to focus on</option>
               {tasks.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
             </select>
          ) : (
            <p className="text-slate-300 font-medium mt-2">Add some pending tasks first.</p>
          )
        ) : (
          <p className="text-slate-300 font-medium">Relax and let your mind rest.</p>
        )}
      </div>
      
      <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
        <div className="text-6xl sm:text-7xl font-black text-slate-100 tracking-wider font-mono drop-shadow-sm">
          {formatTime(timeLeft)}
        </div>
        
        <div className="flex gap-4">
          {isFinished && !isBreak ? (
            <button 
              onClick={startBreak}
              title="Start Break"
              className="w-16 h-16 bg-[#a7f3d0] rounded-3xl shadow-md border border-slate-700 flex items-center justify-center text-[#065f46] hover:bg-[#6ee7b7] transition-all active:shadow-inner active:scale-95"
            >
              <Play className="w-7 h-7 ml-1" />
            </button>
          ) : (
            <button 
              onClick={toggleTimer}
              title={isActive ? "Pause Timer" : "Start Timer"}
              className={`w-16 h-16 rounded-3xl shadow-md border border-slate-700 flex items-center justify-center text-slate-100 hover:brightness-95 transition-all active:shadow-inner active:scale-95 ${
                isActive ? 'bg-indigo-600' : 'bg-indigo-500'
              }`}
            >
              {isActive ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-1" />}
            </button>
          )}

          <button 
            onClick={resetTimer}
            title="Reset Timer"
            className="w-16 h-16 bg-white bg-opacity-60 rounded-3xl shadow-md border border-slate-700 flex items-center justify-center text-slate-300 hover:bg-white transition-all active:shadow-inner active:scale-95"
          >
            <RotateCcw className="w-7 h-7" />
          </button>
        </div>
      </div>
    </ClayCard>
  );
}
