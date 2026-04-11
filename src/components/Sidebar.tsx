import Link from "next/link";
import { LayoutDashboard, Calendar, CheckSquare, Settings } from "lucide-react";

export function Sidebar() {
  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Timetable", href: "/", icon: Calendar },
    { name: "Tasks", href: "/tasks", icon: CheckSquare },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <aside className="w-24 md:w-64 h-screen sticky top-0 bg-slate-800 border-r border-slate-200 border-opacity-50 p-6 flex flex-col gap-10">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-indigo-500 shadow-md border border-slate-700 flex items-center justify-center flex-shrink-0">
          <Calendar className="w-6 h-6 text-slate-100" />
        </div>
        <span className="hidden md:block text-xl font-bold text-slate-100 tracking-tight">Smart Time</span>
      </div>

      <nav className="flex flex-col gap-4 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link 
              key={item.name} 
              href={item.href}
              className="flex items-center gap-4 text-slate-300 hover:text-slate-100 hover:bg-indigo-500 hover:bg-opacity-30 p-3 rounded-2xl transition-colors font-medium group"
            >
              <div className="p-2 rounded-xl group-hover:bg-white group-hover:shadow-sm transition-all text-slate-400 group-hover:text-indigo-400">
                <Icon className="w-5 h-5" />
              </div>
              <span className="hidden md:block">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto hidden md:block">
        <div className="p-4 bg-indigo-600 bg-opacity-30 rounded-3xl text-sm text-slate-200 text-center">
          <p className="font-semibold mb-1 text-slate-100">Pro Plan</p>
          <p className="mb-3 text-xs">Unlock all features</p>
          <button className="w-full py-2 bg-indigo-600 rounded-xl shadow-sm border border-slate-700 hover:shadow-md border border-slate-700 text-slate-100 font-medium transition-all hover:-translate-y-0.5">
            Upgrade
          </button>
        </div>
      </div>
    </aside>
  );
}
