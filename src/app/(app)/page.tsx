import { ClayCard } from "@/components/ClayCard";
import { ClayButton } from "@/components/ClayButton";
import { Briefcase, Calendar, Clock, Plus, Settings } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen p-8 md:p-12 flex flex-col gap-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-bold text-slate-700 tracking-tight">Smart Timetable</h1>
          <p className="text-slate-500 mt-2 text-lg">Manage your classes, assignments, and schedule</p>
        </div>
        <div className="flex gap-4">
          <ClayButton variant="secondary" className="flex gap-2">
            <Settings className="w-5 h-5" />
            Options
          </ClayButton>
          <ClayButton className="flex gap-2">
            <Plus className="w-5 h-5" />
            Add Event
          </ClayButton>
        </div>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column - Today's Schedule overview */}
        <div className="col-span-1 md:col-span-2 flex flex-col gap-8">
          <h2 className="text-2xl font-semibold text-slate-700">Today's Schedule</h2>
          
          <div className="flex flex-col gap-6">
            <ClayCard className="flex items-center p-6 gap-6">
              <div className="bg-pastel-blue w-16 h-16 rounded-2xl flex items-center justify-center shadow-clay-sm flex-shrink-0 text-slate-600">
                <Briefcase className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-700">Data Structures & Algorithms</h3>
                <p className="text-slate-500 mt-1 flex items-center gap-2">
                  <Clock className="w-4 h-4" /> 09:00 AM - 10:30 AM
                </p>
              </div>
              <div>
                <span className="px-4 py-2 bg-pastel-bg rounded-xl shadow-clay-sm text-sm font-semibold text-slate-600">Room 302</span>
              </div>
            </ClayCard>

            <ClayCard className="flex items-center p-6 gap-6">
              <div className="bg-pastel-purple w-16 h-16 rounded-2xl flex items-center justify-center shadow-clay-sm flex-shrink-0 text-slate-600">
                <Calendar className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-700">Web Development Workshop</h3>
                <p className="text-slate-500 mt-1 flex items-center gap-2">
                  <Clock className="w-4 h-4" /> 11:00 AM - 01:00 PM
                </p>
              </div>
              <div>
                <span className="px-4 py-2 bg-pastel-bg rounded-xl shadow-clay-sm text-sm font-semibold text-slate-600">Lab A</span>
              </div>
            </ClayCard>
          </div>
        </div>

        {/* Right Column - Summary / Quick Add */}
        <div className="col-span-1 flex flex-col gap-8">
          <h2 className="text-2xl font-semibold text-slate-700">Overview</h2>
          <ClayCard className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <span className="text-slate-600 font-medium">Completed Classes</span>
              <span className="text-2xl font-bold text-pastel-blue-hover">0/2</span>
            </div>
            <div className="w-full bg-pastel-bg h-4 rounded-full shadow-clay-active overflow-hidden">
              <div className="w-0 bg-pastel-blue h-full rounded-full transition-all duration-300"></div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-slate-200 border-opacity-50">
              <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Upcoming Deadlines</h4>
              <ul className="flex flex-col gap-3">
                <li className="flex items-center gap-3 text-slate-600">
                  <div className="w-2 h-2 rounded-full bg-pastel-purple"></div>
                  Database Assignment (Tomorrow)
                </li>
                <li className="flex items-center gap-3 text-slate-600">
                  <div className="w-2 h-2 rounded-full bg-pastel-blue"></div>
                  React Project Review (Friday)
                </li>
              </ul>
            </div>
          </ClayCard>
        </div>
      </main>
    </div>
  );
}

