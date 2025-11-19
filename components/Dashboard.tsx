import React from 'react';
import { GlassCard } from './UI/GlassCard';
import { Homework, Exam, StudySession, ViewState } from '../types';
import { ArrowRight, CheckCircle, Calendar, Trophy, CloudSun, Zap } from 'lucide-react';

interface DashboardProps {
  homework: Homework[];
  exams: Exam[];
  studySessions: StudySession[];
  setView: (view: ViewState) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ homework, exams, studySessions, setView }) => {
  const pendingHomework = homework.filter(h => !h.completed).length;
  const completedHomework = homework.filter(h => h.completed).length;
  
  const nextExam = exams
    .map(e => ({ ...e, daysLeft: Math.ceil((new Date(e.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) }))
    .filter(e => e.daysLeft >= 0)
    .sort((a, b) => a.daysLeft - b.daysLeft)[0];
  
  const completedStudy = studySessions.filter(s => s.completed).length;
  const totalStudy = studySessions.length;
  const studyProgress = totalStudy === 0 ? 0 : Math.round((completedStudy / totalStudy) * 100);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Guten Morgen';
    if (hour < 18) return 'Guten Tag';
    return 'Guten Abend';
  };

  return (
    <div className="flex flex-col gap-5 animate-fade-in" style={{ animationDelay: '200ms' }}>
      {/* Hero Header - Compact 1080p Version */}
      <header className="flex flex-col md:flex-row md:items-end gap-4 pb-2 relative">
        {/* Horizontal Light Edge (Hero Separator) */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50 md:hidden" />

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1 opacity-80">
              <CloudSun size={20} className="text-brand-gold" />
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Dashboard</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tighter leading-[0.95]">
            {getGreeting()}, <span className="bg-clip-text text-transparent bg-gradient-to-b from-brand-purple to-brand-purple/60 dark:from-white dark:to-white/60">Schüler</span>
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 font-medium tracking-tight max-w-xl">
            Dein Fokus heute: <span className="text-brand-purple dark:text-brand-neon font-bold">{pendingHomework} Aufgaben</span> offen.
          </p>
        </div>
        
        {/* Status Pill - Compact */}
        <div className="hidden md:flex items-center gap-3 p-1 bg-white/40 dark:bg-[#0f172a]/40 rounded-full border border-white/10 backdrop-blur-md shadow-lg">
            <div className="px-3 py-1.5 rounded-full bg-brand-purple/10 dark:bg-brand-purple/20 text-brand-purple dark:text-brand-neon font-bold text-[10px] uppercase tracking-wider">
                Pro
            </div>
            <div className="pr-3 text-[10px] font-bold text-slate-500 dark:text-slate-400">
                v2.1
            </div>
        </div>
      </header>

      {/* Bento Grid Layout - 1080p Optimized (gap-5, smaller rows) */}
      {/* Row height 110px. row-span-2 = ~240px total height (ideal for compact view) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 auto-rows-[minmax(110px,auto)]">
        
        {/* Homework Card - Wide & Compact (approx 240px height) */}
        <GlassCard 
            delay={0}
            onClick={() => setView('homework')} 
            variant="featured"
            className="md:col-span-2 lg:col-span-2 row-span-2 p-6 flex flex-col justify-between relative group min-h-[240px]"
        >
           {/* Decorative Background Element */}
           <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-brand-purple/20 to-brand-blue/10 rounded-full blur-[60px] -mr-16 -mt-16 pointer-events-none" />

          <div className="relative z-10 flex justify-between items-start">
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white dark:bg-white/10 flex items-center justify-center shadow-inner">
                    <CheckCircle size={24} className="text-brand-purple dark:text-brand-neon" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">Hausaufgaben</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">To-Do Liste</p>
                </div>
            </div>
            <div className="w-10 h-10 rounded-full border border-slate-200 dark:border-white/10 flex items-center justify-center group-hover:bg-brand-purple group-hover:border-brand-purple group-hover:text-white transition-all duration-300">
                <ArrowRight size={18} />
            </div>
          </div>
          
          <div className="relative z-10 mt-auto pt-4">
            <div className="flex items-baseline gap-2">
                 <span className="text-7xl font-black text-slate-800 dark:text-white tracking-tighter leading-none">
                    {pendingHomework}
                </span>
                <span className="text-lg font-medium text-slate-400">offen</span>
            </div>
            
            {/* Mini Progress Bar */}
            <div className="mt-5">
                <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-2 tracking-wide">
                    <span>FORTSCHRITT</span>
                    <span>{Math.round((completedHomework / (homework.length || 1)) * 100)}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-gradient-to-r from-brand-purple to-brand-magenta shadow-[0_0_10px_rgba(216,27,96,0.5)]" 
                        style={{ width: `${homework.length > 0 ? (completedHomework / homework.length) * 100 : 0}%` }}
                    />
                </div>
            </div>
          </div>
        </GlassCard>

        {/* Next Exam - Compact Vertical (approx 240px height) */}
        <GlassCard 
            delay={50}
            onClick={() => setView('exams')} 
            variant="alert"
            className="md:col-span-1 lg:col-span-1 row-span-2 p-5 flex flex-col relative overflow-hidden min-h-[240px]"
        >
            <div className="flex items-center justify-between mb-4 relative z-10">
                <div className="p-2 bg-brand-magenta/10 text-brand-magenta rounded-xl">
                    <Calendar size={20} />
                </div>
                {nextExam && (
                    <span className="text-[10px] font-bold bg-brand-magenta text-white px-2 py-0.5 rounded-full shadow-lg shadow-brand-magenta/30 animate-pulse-slow uppercase tracking-wider">
                        Soon
                    </span>
                )}
            </div>

            <div className="flex-1 flex flex-col items-center justify-center relative z-10 text-center">
                 {nextExam ? (
                     <>
                        <div className="text-6xl font-black text-slate-800 dark:text-white mb-1 tracking-tighter">
                            {nextExam.daysLeft}
                        </div>
                        <div className="text-xs font-bold text-brand-magenta uppercase tracking-[0.2em] mb-4">Tage</div>
                        <div className="w-full">
                            <h4 className="font-bold text-lg text-slate-800 dark:text-white truncate">{nextExam.subject}</h4>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 truncate">{nextExam.topic}</p>
                        </div>
                     </>
                 ) : (
                     <div className="text-center opacity-50">
                         <div className="text-4xl mb-3">🎉</div>
                         <p className="font-bold text-xs tracking-wide">Frei!</p>
                     </div>
                 )}
            </div>
        </GlassCard>

        {/* Study Goal - Compact (approx 240px height to match row) */}
        <GlassCard 
            delay={100} 
            onClick={() => setView('study')} 
            className="md:col-span-1 lg:col-span-1 row-span-2 p-5 flex flex-col justify-between bg-gradient-to-br from-brand-gold/5 to-brand-gold/10 border-brand-gold/20 min-h-[240px]"
        >
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-bold text-base text-slate-800 dark:text-white tracking-tight">Lernzeit</h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">Woche</p>
                </div>
                <Trophy size={18} className="text-brand-gold" />
            </div>
            
            <div className="flex flex-col items-center mt-2">
                 <div className="relative w-24 h-24 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                        <circle cx="48" cy="48" r="42" stroke="currentColor" strokeWidth="5" fill="transparent" className="text-slate-200 dark:text-white/10" />
                        <circle cx="48" cy="48" r="42" stroke="currentColor" strokeWidth="5" fill="transparent" strokeDasharray={263} strokeDashoffset={263 - (263 * studyProgress) / 100} className="text-brand-gold transition-all duration-1000 ease-vision" />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                        <span className="text-xl font-bold text-slate-700 dark:text-white">{studyProgress}%</span>
                    </div>
                 </div>
            </div>
            
            <div className="text-center mt-2">
                <div className="text-2xl font-bold text-slate-800 dark:text-white leading-none">{completedStudy}/{totalStudy}</div>
                <div className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mt-1">Sessions</div>
            </div>
        </GlassCard>

        {/* AI Tip - Ultra Compact (approx 110px height) - Spans full width on mobile, 2 cols on large, 4 cols on very large or as filler */}
        <GlassCard delay={150} noHover className="md:col-span-2 lg:col-span-4 p-5 bg-brand-purple text-white relative overflow-hidden border-none shadow-xl shadow-brand-purple/20 min-h-[110px] flex items-center">
            <div className="absolute inset-0 bg-gradient-to-r from-brand-purple via-brand-magenta to-brand-purple opacity-90" />
            <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-gradient-to-t from-white/10 to-transparent rotate-45" />
            
            <div className="relative z-10 flex items-center gap-6 w-full">
                <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm shrink-0">
                     <Zap size={20} className="text-brand-gold fill-brand-gold" />
                </div>
                <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-1">Daily Smart Tip</div>
                    <p className="text-sm font-medium leading-snug opacity-95 tracking-tight max-w-2xl">
                        "Nutze die Pomodoro-Technik im Lern-Tab für mehr Fokus und weniger Stress."
                    </p>
                </div>
            </div>
        </GlassCard>

      </div>
    </div>
  );
};