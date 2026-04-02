import { ClayCard } from "@/components/ClayCard";
import { ClayButton } from "@/components/ClayButton";
import { FocusTimer } from "@/components/FocusTimer";
import { CheckCircle2, TrendingUp, Clock, BookOpen } from "lucide-react";
import { createClient } from "@/utils/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userName = user?.user_metadata?.full_name || user?.email || "Guest";

  // Fetch a single pending task for the "Today's Focus" section
  const { data: tasks } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", user?.id)
    .eq("status", "pending")
    .order("created_at", { ascending: false })
    .limit(1);
    
  const nextTask = tasks?.[0] || null;

  return (
    <div className="p-8 md:p-12 flex flex-col gap-10">
      <header className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold text-slate-700 tracking-tight">Good morning, {userName}! 👋</h1>
        <p className="text-slate-500 text-lg">Here's what's happening with your schedule today.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          {/* Smart Feature: Focus Timer */}
          <FocusTimer />

          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-semibold text-slate-700">Today's Focus</h2>
            <ClayCard className="p-8 flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1">
                {nextTask ? (
                  <>
                    <h3 className="text-2xl font-bold text-slate-700 mb-2">{nextTask.title}</h3>
                    <p className="text-slate-500 mb-6">
                      {nextTask.estimated_minutes ? `Estimated time: ${nextTask.estimated_minutes} minutes.` : "Keep working on your tasks!"}
                    </p>
                    <ClayButton variant="primary">Continue Working</ClayButton>
                  </>
                ) : (
                  <>
                   <h3 className="text-2xl font-bold text-slate-700 mb-2">You're all caught up!</h3>
                   <p className="text-slate-500 mb-6">Take a break or add a new task to your list.</p>
                  </>
                )}
              </div>
              <div className="w-40 h-40 bg-pastel-blue rounded-full shadow-clay flex items-center justify-center flex-shrink-0 relative">
                <div className="absolute inset-2 border-4 border-white opacity-50 rounded-full border-dashed animate-[spin_20s_linear_infinite]" />
                <BookOpen className="w-16 h-16 text-slate-600 relative z-10" />
              </div>
            </ClayCard>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ClayCard className="flex flex-col p-6 gap-2">
                <div className="flex items-center gap-3 text-slate-600 font-medium mb-2">
                  <Clock className="w-5 h-5 text-pastel-blue-hover" /> Time Spent
                </div>
                <p className="text-3xl font-bold text-slate-700">0 <span className="text-lg font-normal text-slate-400">hours</span></p>
                <p className="text-sm text-slate-400 mt-2">
                  Tracking coming soon
                </p>
              </ClayCard>

              <ClayCard className="flex flex-col p-6 gap-2">
                <div className="flex items-center gap-3 text-slate-600 font-medium mb-2">
                  <CheckCircle2 className="w-5 h-5 text-pastel-purple-hover" /> Classes Assigned
                </div>
                <p className="text-3xl font-bold text-slate-700">0/0 <span className="text-lg font-normal text-slate-400">attended</span></p>
                <div className="w-full bg-pastel-bg h-3 rounded-full mt-3 shadow-clay-active overflow-hidden">
                  <div className="w-0 bg-pastel-purple h-full rounded-full" />
                </div>
              </ClayCard>
            </div>
          </div>
        </div>

        {/* Task Progress Sidebar */}
        <div className="flex flex-col gap-6">
          <h2 className="text-2xl font-semibold text-slate-700">Progress</h2>
          <ClayCard className="flex flex-col p-6 gap-6 h-full">
            <div>
              <div className="flex justify-between items-end mb-3">
                <span className="text-slate-600 font-medium">Daily Goals</span>
                <span className="text-slate-700 font-bold text-xl">0%</span>
              </div>
              <div className="w-full bg-pastel-bg h-5 rounded-3xl shadow-clay-active overflow-hidden p-1">
                <div className="w-[0%] bg-pastel-blue h-full rounded-2xl transition-all duration-500" />
              </div>
            </div>

            <hr className="border-slate-200 border-opacity-50" />

            <div className="flex-1 flex flex-col gap-4">
              <h4 className="font-semibold text-slate-500 uppercase text-sm">Quick Stats</h4>
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Tasks Completed</span>
                  <span className="font-semibold text-slate-700 bg-pastel-bg px-3 py-1 rounded-lg shadow-clay-sm">0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Pending</span>
                  <span className="font-semibold text-slate-700 bg-pastel-bg px-3 py-1 rounded-lg shadow-clay-sm">0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Focus Score</span>
                  <span className="font-semibold text-pastel-purple-hover bg-pastel-bg px-3 py-1 rounded-lg shadow-clay-sm">-</span>
                </div>
              </div>
            </div>
          </ClayCard>
        </div>
      </div>
    </div>
  );
}

