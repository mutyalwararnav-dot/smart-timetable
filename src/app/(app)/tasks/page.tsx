"use client";

import { useState } from "react";
import { ClayCard } from "@/components/ClayCard";
import { ClayButton } from "@/components/ClayButton";
import { Plus, Check, CalendarIcon, MoreVertical } from "lucide-react";

type Task = {
  id: string;
  title: string;
  course: string;
  deadline: string;
  completed: boolean;
  priority: "high" | "medium" | "low";
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", title: "Complete Midterm Essay", course: "History 101", deadline: "Today, 11:59 PM", completed: false, priority: "high" },
    { id: "2", title: "Read Chapters 4-5", course: "Psychology", deadline: "Tomorrow, 10:00 AM", completed: true, priority: "medium" },
    { id: "3", title: "Problem Set #3", course: "Calculus", deadline: "Friday", completed: false, priority: "high" },
    { id: "4", title: "Group Project Meeting", course: "Software Eng", deadline: "Saturday", completed: false, priority: "low" },
  ]);

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;

  return (
    <div className="p-8 md:p-12 flex flex-col gap-10 max-w-5xl mx-auto">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-bold text-slate-700 tracking-tight">Task Manager</h1>
          <p className="text-slate-500 text-lg mt-2">You have {totalCount - completedCount} pending tasks.</p>
        </div>
        <ClayButton className="flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add Task
        </ClayButton>
      </header>

      <ClayCard className="p-0 overflow-hidden text-slate-700 flex flex-col gap-2 bg-opacity-70">
        <div className="p-6 border-b border-slate-200 border-opacity-40 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Your Tasks</h2>
          <div className="text-sm font-medium text-slate-500 bg-pastel-bg shadow-clay-sm px-4 py-1.5 rounded-full">
            {completedCount} / {totalCount} completed
          </div>
        </div>
        
        <div className="flex flex-col p-4 gap-4">
          {tasks.map(task => (
            <div 
              key={task.id}
              className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 ${
                task.completed ? "bg-pastel-bg bg-opacity-40" : "bg-white shadow-clay-sm"
              }`}
            >
              <button 
                onClick={() => toggleTask(task.id)}
                className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                  task.completed 
                    ? "bg-pastel-blue text-slate-700 shadow-inner" 
                    : "bg-pastel-bg shadow-clay hover:bg-white"
                }`}
              >
                {task.completed && <Check className="w-4 h-4" />}
              </button>
              
              <div className={`flex-1 flex flex-col ${task.completed ? 'opacity-60 grayscale' : ''}`}>
                <h3 className={`text-lg font-semibold ${task.completed ? "line-through text-slate-400" : "text-slate-700"}`}>
                  {task.title}
                </h3>
                <div className="flex items-center gap-4 mt-1 text-sm">
                  <span className="font-medium text-pastel-purple-hover filter brightness-75">{task.course}</span>
                  <span className="text-slate-400 flex items-center gap-1">
                    <CalendarIcon className="w-3.5 h-3.5" />
                    {task.deadline}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {!task.completed && (
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    task.priority === 'high' ? 'bg-red-100 text-red-500 shadow-sm' :
                    task.priority === 'medium' ? 'bg-yellow-100 text-yellow-600 shadow-sm' :
                    'bg-green-100 text-green-600 shadow-sm'
                  }`}>
                    {task.priority}
                  </span>
                )}
                <button className="text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-pastel-bg transition-colors">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </ClayCard>
    </div>
  );
}
