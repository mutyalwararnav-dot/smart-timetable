"use client";

import { useState, useEffect } from "react";
import { ClayCard } from "@/components/ClayCard";
import { ClayButton } from "@/components/ClayButton";
import { Plus, Check, CalendarIcon, MoreVertical } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

type Task = {
  id: string;
  title: string;
  course: string;
  deadline: string;
  completed: boolean;
  priority: "high" | "medium" | "low";
};

export default function TasksPage() {
  const supabase = createClient();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    const { data } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (data) {
      setTasks(data.map(t => ({ 
        id: t.id, 
        title: t.title, 
        course: "", 
        deadline: t.due_date ? new Date(t.due_date).toLocaleDateString() : "", 
        completed: t.status === 'completed', 
        priority: "medium" 
      })));
    }
    setIsLoading(false);
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase.from('tasks').insert({
      user_id: user.id,
      title: newTaskTitle,
      status: 'pending'
    }).select().single();

    if (data) {
      setTasks([{ 
        id: data.id, 
        title: data.title, 
        course: "", 
        deadline: "", 
        completed: false, 
        priority: "medium" 
      }, ...tasks]);
      setNewTaskTitle("");
      setIsAdding(false);
    }
  };

  const toggleTask = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    const newStatus = task.completed ? 'pending' : 'completed';
    
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    await supabase.from('tasks').update({ status: newStatus }).eq('id', id);
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;

  return (
    <div className="p-8 md:p-12 flex flex-col gap-10 max-w-5xl mx-auto">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-bold text-slate-100 tracking-tight">Task Manager</h1>
          <p className="text-slate-300 text-lg mt-2">You have {totalCount - completedCount} pending tasks.</p>
        </div>
        <ClayButton className="flex items-center gap-2" onClick={() => setIsAdding(!isAdding)}>
          <Plus className="w-5 h-5" />
          Add Task
        </ClayButton>
      </header>
      
      {isAdding && (
        <form onSubmit={handleAddTask} className="flex gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <input 
            type="text" 
            value={newTaskTitle} 
            onChange={(e) => setNewTaskTitle(e.target.value)} 
            placeholder="What needs to be done?"
            className="flex-1 bg-white border-none px-6 py-4 rounded-2xl shadow-md border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-slate-100 font-medium"
            autoFocus
          />
          <ClayButton type="submit">Save Task</ClayButton>
          <ClayButton type="button" variant="secondary" onClick={() => setIsAdding(false)}>Cancel</ClayButton>
        </form>
      )}

      <ClayCard className="p-0 overflow-hidden text-slate-100 flex flex-col gap-2 bg-opacity-70">
        <div className="p-6 border-b border-slate-200 border-opacity-40 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Your Tasks</h2>
          <div className="text-sm font-medium text-slate-300 bg-slate-800 shadow-sm border border-slate-700 px-4 py-1.5 rounded-full">
            {completedCount} / {totalCount} completed
          </div>
        </div>
        
        <div className="flex flex-col p-4 gap-4">
          {isLoading ? (
            <div className="p-8 text-center text-slate-400 font-medium">Loading tasks...</div>
          ) : tasks.length === 0 ? (
            <div className="p-8 text-center text-slate-400 font-medium">No tasks found. Add one above!</div>
          ) : tasks.map(task => (
            <div 
              key={task.id}
              className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 ${
                task.completed ? "bg-slate-800 bg-opacity-40" : "bg-white shadow-sm border border-slate-700"
              }`}
            >
              <button 
                onClick={() => toggleTask(task.id)}
                className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                  task.completed 
                    ? "bg-indigo-500 text-slate-100 shadow-inner" 
                    : "bg-slate-800 shadow-md border border-slate-700 hover:bg-white"
                }`}
              >
                {task.completed && <Check className="w-4 h-4" />}
              </button>
              
              <div className={`flex-1 flex flex-col justify-center ${task.completed ? 'opacity-60 grayscale' : ''}`}>
                <h3 className={`text-lg font-semibold ${task.completed ? "line-through text-slate-400" : "text-slate-100"}`}>
                  {task.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </ClayCard>
    </div>
  );
}
