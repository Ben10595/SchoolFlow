import React from 'react';
import { Home, BookOpen, Calendar, Clock, Settings, LayoutGrid } from 'lucide-react';
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
    { id: 'study', icon: Clock, label: 'Fokus' },
  ];

  return (
    <>
      {/* Mobile Bottom Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-[#0b0b10] border-t border-slate-200 dark:border-white/5 pb-safe">
        <div className="flex justify-around items-center p-4">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setView(item.id as ViewState)}
                className={`flex flex-col items-center gap-1 transition-all duration-300 ${isActive ? 'text-blue-500 dark:text-blue-400' : 'text-slate-400 dark:text-gray-500'}`}
              >
                 <item.icon size={isActive ? 24 : 20} />
                 {isActive && <div className="w-1 h-1 rounded-full bg-blue-500 dark:bg-blue-400 mt-1" />}
              </button>
            );
          })}
          <button onClick={onOpenSettings} className="text-slate-400 dark:text-gray-500">
             <Settings size={20} />
          </button>
        </div>
      </div>

      {/* Desktop Sidebar - Business Pro */}
      <div className="hidden md:flex fixed left-0 top-0 bottom-0 w-[260px] flex-col z-50 bg-white dark:bg-[#0b0b10] border-r border-slate-200 dark:border-white/5 transition-colors">
        
        {/* Logo Area */}
        <div className="px-6 pt-8 mb-2">
           <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
                 <LayoutGrid size={18} strokeWidth={2.5} />
               </div>
               <span className="font-bold text-lg tracking-tight text-slate-800 dark:text-white">SchoolFlow</span>
           </div>
        </div>
        
        {/* Menu Label */}
        <div className="px-6 mb-6 mt-8">
            <p className="text-[10px] font-bold text-slate-400 dark:text-gray-600 uppercase tracking-widest">MENU</p>
        </div>

        {/* Navigation */}
        <div className="flex-1 flex flex-col w-full px-4 gap-1">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setView(item.id as ViewState)}
                className={`
                  group relative flex items-center gap-4 px-4 py-3.5
                  w-full rounded-lg transition-all duration-200
                  ${isActive 
                    ? 'bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-white' 
                    : 'text-slate-500 dark:text-gray-500 hover:text-slate-700 dark:hover:text-gray-300 hover:bg-slate-50 dark:hover:bg-white/[0.02]'}
                `}
              >
                {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-r-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                )}
                <item.icon 
                    size={20} 
                    className={`transition-transform duration-300 ${isActive ? 'scale-110 text-blue-500 dark:text-blue-400' : 'text-slate-400 dark:text-gray-500'}`} 
                />
                <span className={`text-sm ${isActive ? 'font-medium' : 'font-normal'}`}>{item.label}</span>
              </button>
            );
          })}
        </div>
        
        {/* User Profile & Settings (Updated Layout) */}
        <div className="mt-auto px-4 pt-6 pb-6 border-t border-slate-200 dark:border-white/5 mx-2">
             <div className="bg-slate-50 dark:bg-[#161a24] border border-slate-200 dark:border-white/5 rounded-xl p-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-200 dark:bg-gray-800 flex items-center justify-center text-sm font-bold text-slate-700 dark:text-white shrink-0">
                   {user?.displayName?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="flex-1 min-w-0 overflow-hidden">
                    <p className="text-sm font-bold text-slate-800 dark:text-white truncate">
                        {user?.displayName || 'Gast'}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-gray-500 truncate font-medium">
                        Profil verwalten
                    </p>
                </div>
                <button 
                  onClick={onOpenSettings}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:text-gray-500 dark:hover:text-white transition-colors"
                >
                  <Settings size={18} />
                </button>
             </div>
        </div>
      </div>
    </>
  );
};