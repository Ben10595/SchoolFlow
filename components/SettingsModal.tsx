import React from 'react';
import { GlassCard } from './UI/GlassCard';
import { X, LogOut, User, Mail, Shield, Moon, Sun, Palette } from 'lucide-react';
import { auth } from '../firebase';
import { signOut, User as FirebaseUser } from 'firebase/auth';
import { Theme } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: FirebaseUser | null;
  currentTheme: Theme;
  setTheme: (theme: Theme) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, user, currentTheme, setTheme }) => {
  if (!isOpen || !user) return null;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      onClose();
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[#050b14]/60 backdrop-blur-sm animate-fade-in p-4">
      <GlassCard className="w-full max-w-md p-0 overflow-hidden relative bg-white dark:bg-[#161a24]" noHover>
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-brand-purple via-brand-magenta to-brand-purple opacity-20 pointer-events-none" />
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-black/5 dark:bg-white/10 text-slate-500 dark:text-white/70 hover:bg-black/10 dark:hover:bg-white/20 transition-colors z-10"
        >
          <X size={20} />
        </button>

        <div className="p-8 pt-12 relative z-0 flex flex-col items-center text-center">
           <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-brand-neon to-brand-purple shadow-xl shadow-brand-purple/20 mb-4">
              <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center text-3xl font-bold text-slate-800 dark:text-white">
                 {user.displayName?.charAt(0).toUpperCase() || 'U'}
              </div>
           </div>
           
           <h2 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">
             {user.displayName || 'Benutzer'}
           </h2>
           <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-purple/10 border border-brand-purple/20 text-brand-purple dark:text-brand-neon text-xs font-bold uppercase tracking-wider mt-2">
             <Shield size={10} />
             SchoolFlow ID
           </div>
        </div>

        <div className="px-6 pb-8 space-y-4">
            
            {/* Theme Switcher */}
            <div className="group">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">Design</label>
                <div className="grid grid-cols-3 gap-2 mt-1">
                    <button 
                        onClick={() => setTheme('dark')}
                        className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${currentTheme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'}`}
                    >
                        <Moon size={18} />
                        <span className="text-xs font-medium">Dark</span>
                    </button>
                    <button 
                        onClick={() => setTheme('light')}
                        className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${currentTheme === 'light' ? 'bg-blue-100 border-blue-200 text-blue-600' : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400 hover:bg-slate-100'}`}
                    >
                        <Sun size={18} />
                        <span className="text-xs font-medium">Light</span>
                    </button>
                    <button 
                        onClick={() => setTheme('pink')}
                        className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${currentTheme === 'pink' ? 'bg-pink-100 border-pink-200 text-pink-600' : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400 hover:bg-slate-100'}`}
                    >
                        <Palette size={18} />
                        <span className="text-xs font-medium">Pink</span>
                    </button>
                </div>
            </div>

            <div className="group">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">Account E-Mail</label>
                <div className="flex items-center gap-3 p-4 mt-1 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                    <Mail size={18} className="text-slate-400" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate flex-1">
                        {user.email}
                    </span>
                </div>
            </div>

            <div className="group">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">Mitglied seit</label>
                <div className="flex items-center gap-3 p-4 mt-1 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                    <User size={18} className="text-slate-400" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate flex-1">
                        {user.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString('de-DE') : 'Unbekannt'}
                    </span>
                </div>
            </div>

            <button 
              onClick={handleLogout}
              className="w-full py-4 mt-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-500 font-bold rounded-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <LogOut size={18} />
              Abmelden
            </button>
        </div>
      </GlassCard>
    </div>
  );
};