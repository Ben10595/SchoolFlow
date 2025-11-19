
import React from 'react';
import { Home, BookOpen, Calendar, Clock, Settings, Sparkles } from 'lucide-react';
import { ViewState } from '../types';
import { User } from 'firebase/auth';

interface NavbarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  user: User | null;
  onOpenSettings: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, setView, user, onOpenSettings }) => {
  const navItems = [
    { id: 'dashboard', icon: Home, label: 'Übersicht' },
    { id: 'homework', icon: BookOpen, label: 'Aufgaben' },
    { id: 'exams', icon: Calendar, label: 'Prüfungen' },
    { id: 'study', icon: Clock, label: 'Fokus-Zeit' },
  ];

  return (
    <>
      {/* Mobile Bottom Bar - Floating iOS Style */}
      <div className="md:hidden fixed bottom-6 left-0 right-0 z-50 flex justify-center pointer-events-none">
        <div className="
          pointer-events-auto
          flex items-center gap-2
          bg-white/80 dark:bg-[#0f172a]/80
          backdrop-blur-2xl backdrop-saturate-150
          border border-white/20 dark:border-white/10
          rounded-3xl shadow-2xl shadow-black/20
          p-2 mx-4
        ">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setView(item.id as ViewState)}
                className={`
                  relative
                  flex flex-col items-center justify-center
                  w-14 h-14 rounded-2xl transition-all duration-500 ease-vision
                  ${isActive 
                    ? 'text-brand-purple dark:text-white' 
                    : 'text-slate-400 hover:bg-black/5 dark:hover:bg-white/10'}
                `}
              >
                {isActive && (
                    <div className="absolute inset-0 bg-white/20 dark:bg-white/5 rounded-2xl border border-white/10 animate-scale-in" />
                )}
                <div className="relative z-10">
                   <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                   {isActive && <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-brand-neon rounded-full shadow-[0_0_8px_rgba(0,229,255,0.8)]" />}
                </div>
              </button>
            );
          })}
          {/* Mobile Settings Trigger */}
          <button
                onClick={onOpenSettings}
                className="relative flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition-all duration-500 ease-vision text-slate-400 hover:bg-black/5 dark:hover:bg-white/10"
          >
             <Settings size={22} />
          </button>
        </div>
      </div>

      {/* Desktop Vision Sidebar */}
      <div className="hidden md:flex fixed left-0 top-0 bottom-0 w-[280px] flex-col py-8 px-6 z-50 animate-fade-in" style={{ animationDelay: '150ms' }}>
        {/* Glass Background with Inset Shadow */}
        <div className="absolute inset-0 bg-white/60 dark:bg-[#0f172a]/40 backdrop-blur-3xl border-r border-white/20 dark:border-white/5 shadow-[inset_0_0_20px_rgba(255,255,255,0.02)]" />
        
        {/* Logo Area */}
        <div className="relative z-10 mb-12 flex items-center gap-4 px-2">
           <div className="w-10 h-10 bg-gradient-to-br from-brand-purple via-brand-magenta to-brand-purple rounded-xl flex items-center justify-center shadow-lg shadow-brand-purple/30 group hover:scale-105 transition-transform duration-300">
              <Sparkles size={20} className="text-white group-hover:rotate-12 transition-transform" />
            </div>
            <h1 className="font-bold text-xl text-slate-800 dark:text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-white/70">SchoolFlow</h1>
        </div>

        {/* Navigation Links */}
        <div className="relative z-10 flex-1 flex flex-col gap-3 w-full">
          <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-4 mb-2 opacity-60">Menu</p>
          
          {navItems.map((item, idx) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setView(item.id as ViewState)}
                className={`
                  group relative
                  flex items-center gap-4 px-4 py-3.5
                  w-full rounded-xl transition-all duration-300 ease-vision
                  ${isActive 
                    ? 'bg-white/60 dark:bg-white/5 text-slate-900 dark:text-white shadow-sm' 
                    : 'text-slate-500 dark:text-slate-400 hover:bg-white/40 dark:hover:bg-white/5 hover:text-slate-700 dark:hover:text-slate-200'}
                `}
                style={{ transitionDelay: `${idx * 50}ms` }}
              >
                <div className={`transition-transform duration-300 ease-vision group-hover:scale-[1.15] ${isActive ? 'text-brand-purple dark:text-brand-neon' : ''}`}>
                    <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className={`font-medium text-[15px] tracking-tight ${isActive ? 'font-semibold' : ''}`}>{item.label}</span>
                
                {isActive && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-brand-neon rounded-full shadow-[0_0_8px_rgba(0,229,255,0.8)] animate-pulse-slow" />
                )}
              </button>
            );
          })}
        </div>
        
        {/* Bottom Actions - Real User Profile */}
        <div className="relative z-10 mt-auto pt-6 border-t border-slate-200/50 dark:border-white/5">
             <button 
                onClick={onOpenSettings}
                className="flex items-center gap-3 mt-2 px-3 py-3 w-full text-left bg-white/40 dark:bg-white/5 rounded-2xl border border-white/20 dark:border-white/5 hover:bg-white/60 dark:hover:bg-white/10 transition-colors cursor-pointer group"
             >
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-brand-blue to-brand-neon p-[2px] group-hover:shadow-[0_0_12px_rgba(0,229,255,0.3)] transition-shadow">
                    <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center text-xs font-bold">
                       {user?.displayName?.charAt(0).toUpperCase() || 'U'}
                    </div>
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-800 dark:text-white truncate">
                        {user?.displayName || 'Gast'}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate group-hover:text-brand-neon transition-colors">
                        Einstellungen
                    </p>
                </div>
                <Settings size={16} className="text-slate-400 group-hover:rotate-90 transition-transform duration-500" />
             </button>
        </div>
      </div>
    </>
  );
};
