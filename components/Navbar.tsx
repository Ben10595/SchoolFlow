
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
      {/* Mobile Bottom Bar - VisionOS Floating Dock */}
      <div className="md:hidden fixed bottom-6 left-0 right-0 z-50 flex justify-center pointer-events-none">
        <div className="
          pointer-events-auto
          flex items-center gap-2
          bg-white/70 dark:bg-[#0f172a]/60
          backdrop-blur-3xl backdrop-saturate-200
          border border-white/30 dark:border-white/10
          rounded-[2rem] shadow-2xl shadow-black/30
          p-2.5 mx-4
          ring-1 ring-white/20
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
                    : 'text-slate-400 hover:bg-white/20 dark:hover:bg-white/10'}
                `}
              >
                {isActive && (
                    <div className="absolute inset-0 bg-white/30 dark:bg-white/10 rounded-2xl border border-white/20 shadow-[inset_0_0_10px_rgba(255,255,255,0.2)] animate-scale-in" />
                )}
                <div className="relative z-10">
                   <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} className="transition-transform active:scale-90" />
                   {isActive && <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-brand-neon rounded-full shadow-[0_0_10px_rgba(0,229,255,1)]" />}
                </div>
              </button>
            );
          })}
          {/* Mobile Settings Trigger */}
          <button
                onClick={onOpenSettings}
                className="relative flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition-all duration-500 ease-vision text-slate-400 hover:bg-white/20 dark:hover:bg-white/10"
          >
             <Settings size={24} />
          </button>
        </div>
      </div>

      {/* Desktop Vision Sidebar */}
      <div className="hidden md:flex fixed left-0 top-0 bottom-0 w-[300px] flex-col py-10 px-6 z-50 animate-fade-in" style={{ animationDelay: '150ms' }}>
        {/* Frosted Glass Background with Deep Inset Shadow */}
        <div className="absolute inset-0 bg-white/60 dark:bg-[#0f172a]/40 backdrop-blur-3xl border-r border-white/20 dark:border-white/5 shadow-[inset_-10px_0_30px_rgba(255,255,255,0.05)]" />
        
        {/* Logo Area */}
        <div className="relative z-10 mb-14 flex items-center gap-4 px-3">
           <div className="w-11 h-11 bg-gradient-to-br from-brand-purple via-brand-magenta to-brand-purple rounded-2xl flex items-center justify-center shadow-lg shadow-brand-purple/30 group hover:scale-110 transition-transform duration-300 cursor-default ring-2 ring-white/20">
              <Sparkles size={22} className="text-white group-hover:rotate-12 transition-transform" />
            </div>
            <h1 className="font-extrabold text-2xl text-slate-800 dark:text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-white/70 drop-shadow-sm">SchoolFlow</h1>
        </div>

        {/* Navigation Links */}
        <div className="relative z-10 flex-1 flex flex-col gap-4 w-full">
          <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-5 mb-2 opacity-60">Menu</p>
          
          {navItems.map((item, idx) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setView(item.id as ViewState)}
                className={`
                  group relative
                  flex items-center gap-5 px-5 py-4
                  w-full rounded-2xl transition-all duration-300 ease-vision
                  ${isActive 
                    ? 'bg-white/50 dark:bg-white/10 text-slate-900 dark:text-white shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-white/20' 
                    : 'text-slate-500 dark:text-slate-400 hover:bg-white/30 dark:hover:bg-white/5 hover:text-slate-700 dark:hover:text-slate-200'}
                `}
                style={{ transitionDelay: `${idx * 50}ms` }}
              >
                {isActive && (
                   <div className="absolute inset-0 bg-gradient-to-r from-brand-purple/10 to-transparent rounded-2xl opacity-50" />
                )}

                <div className={`transition-transform duration-300 ease-vision group-hover:scale-[1.2] ${isActive ? 'text-brand-purple dark:text-brand-neon drop-shadow-[0_0_8px_rgba(94,53,177,0.5)]' : ''}`}>
                    <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className={`font-medium text-[16px] tracking-tight ${isActive ? 'font-bold' : ''}`}>{item.label}</span>
                
                {isActive && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 bg-brand-neon rounded-full shadow-[0_0_12px_rgba(0,229,255,1)] animate-pulse-slow" />
                )}
              </button>
            );
          })}
        </div>
        
        {/* Bottom Actions - Real User Profile */}
        <div className="relative z-10 mt-auto pt-8 border-t border-slate-200/50 dark:border-white/5">
             <button 
                onClick={onOpenSettings}
                className="flex items-center gap-4 mt-2 px-4 py-4 w-full text-left bg-white/30 dark:bg-white/5 rounded-[1.2rem] border border-white/20 dark:border-white/5 hover:bg-white/50 dark:hover:bg-white/10 transition-all cursor-pointer group hover:shadow-lg hover:-translate-y-0.5"
             >
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-blue to-brand-neon p-[2px] group-hover:shadow-[0_0_15px_rgba(0,229,255,0.4)] transition-shadow">
                    <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center text-sm font-bold">
                       {user?.displayName?.charAt(0).toUpperCase() || 'U'}
                    </div>
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-[15px] font-bold text-slate-800 dark:text-white truncate">
                        {user?.displayName || 'Gast'}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate group-hover:text-brand-neon transition-colors font-medium">
                        Einstellungen
                    </p>
                </div>
                <Settings size={18} className="text-slate-400 group-hover:rotate-90 transition-transform duration-500" />
             </button>
        </div>
      </div>
    </>
  );
};
