
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
    <div className="flex flex-col gap-8 animate-fade-in" style={{ animationDelay: '200ms' }}>
      {/* Hero Header - VisionOS Large Type */}
      <header className="flex flex-col md:flex-row md:items-end gap-6 pb-4 relative">
        {/* Horizontal Light Edge (Hero Separator) */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-50 md:hidden" />

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2 opacity-80">
              <CloudSun size={24} className="text-brand-gold drop-shadow-[0_0_8px_rgba(255,215,0,0.6)]" />
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Dashboard</span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tighter leading-[0.95] drop-shadow-sm">
            {getGreeting()}, <br className="hidden md:block" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-purple via-brand-magenta to-brand-neon animate-gradient-x">Schüler</span>
          </h1>
          <p className="text-base text-slate-600 dark:text-slate-300 mt-4 font-medium tracking-tight max-w-xl leading-relaxed">
            Dein Fokus heute: <span className="text-brand-purple dark:text-brand-neon font-bold bg-brand-purple/10 dark:bg-brand-neon/10 px-2 py-0.5 rounded-lg">{pendingHomework} Aufgaben</span> warten auf dich.
          </p>
        </div>
        
        {/* Status Pill - Vision Style */}
        <div className="hidden md:flex items-center gap-3 p-1.5 bg-white/60 dark:bg-[#0f172a]/60 rounded-full border border-white/20 backdrop-blur-2xl shadow-xl hover:scale-105 transition-transform duration-300 cursor-default">
            <div className="px-4 py-2 rounded-full bg-brand-purple/10 dark:bg-brand-purple/20 text-brand-purple dark:text-brand-neon font-bold text-[11px] uppercase tracking-wider shadow-inner">
                Pro OS
            </div>
            <div className="pr-4 text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                Online
            </div>
        </div>
      </header>

      {/* Bento Grid Layout - Spacious (gap-7) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7 auto-rows-[minmax(140px,auto)]">
        
        {/* Homework Card - Wide & Tall */}
        <GlassCard 
            delay={0}
            onClick={() => setView('homework')} 
            variant="featured"
            className="md:col-span-2 lg:col-span-2 row-span-2 p-8 flex flex-col justify-between relative group min-h-[320px]"
        >
           {/* Decorative Background Element */}
           <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-brand-purple/30 to-brand-blue/20 rounded-full blur-[80px] -mr-20 -mt-20 pointer-events-none mix-blend-screen" />

          <div className="relative z-10 flex justify-between items-start">
            <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-[1.2rem] bg-white dark:bg-white/10 flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.1)] ring-1 ring-white/20">
                    <CheckCircle size={28} className="text-brand-purple dark:text-brand-neon" />
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">Hausaufgaben</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">Deine To-Do Liste</p>
                </div>
            </div>
            <div className="w-12 h-12 rounded-full border border-slate-200 dark:border-white/10 flex items-center justify-center group-hover:bg-brand-purple group-hover:border-brand-purple group-hover:text-white transition-all duration-300 shadow-sm">
                <ArrowRight size={20} />
            </div>
          </div>
          
          <div className="relative z-10 mt-auto pt-6">
            <div className="flex items-baseline gap-3">
                 <span className="text-8xl font-black text-slate-800 dark:text-white tracking-tighter leading-none drop-shadow-sm">
                    {pendingHomework}
                </span>
                <span className="text-xl font-bold text-slate-400 uppercase tracking-wide">offen</span>
            </div>
            
            {/* Mini Progress Bar */}
            <div className="mt-8">
                <div className="flex justify-between text-xs font-bold text-slate-500 mb-2.5 tracking-widest uppercase">
                    <span>Fortschritt</span>
                    <span>{Math.round((completedHomework / (homework.length || 1)) * 100)}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden shadow-inner">
                    <div 
                        className="h-full bg-gradient-to-r from-brand-purple to-brand-magenta shadow-[0_0_15px_rgba(216,27,96,0.6)] rounded-full" 
                        style={{ width: `${homework.length > 0 ? (completedHomework / homework.length) * 100 : 0}%` }}
                    />
                </div>
            </div>
          </div>
        </GlassCard>

        {/* Next Exam - Vertical */}
        <GlassCard 
            delay={50}
            onClick={() => setView('exams')} 
            variant="alert"
            className="md:col-span-1 lg:col-span-1 row-span-2 p-6 flex flex-col relative overflow-hidden min-h-[320px]"
        >
            <div className="flex items-center justify-between mb-4 relative z-10">
                <div className="p-3 bg-brand-magenta/10 text-brand-magenta rounded-2xl backdrop-blur-md">
                    <Calendar size={24} />
                </div>
                {nextExam && (
                    <span className="text-[10px] font-bold bg-brand-magenta text-white px-2.5 py-1 rounded-full shadow-lg shadow-brand-magenta/30 animate-pulse-slow uppercase tracking-wider">
                        Dringend
                    </span>
                )}
            </div>

            <div className="flex-1 flex flex-col items-center justify-center relative z-10 text-center">
                 {nextExam ? (
                     <>
                        <div className="text-7xl font-black text-slate-800 dark:text-white mb-2 tracking-tighter drop-shadow-sm">
                            {nextExam.daysLeft}
                        </div>
                        <div className="text-xs font-black text-brand-magenta uppercase tracking-[0.3em] mb-6 opacity-80">Tage</div>
                        <div className="w-full bg-white/50 dark:bg-white/5 rounded-2xl p-4 border border-white/20 backdrop-blur-md">
                            <h4 className="font-bold text-xl text-slate-800 dark:text-white truncate leading-tight">{nextExam.subject}</h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate font-medium">{nextExam.topic}</p>
                        </div>
                     </>
                 ) : (
                     <div className="text-center opacity-50">
                         <div className="text-5xl mb-4">🎉</div>
                         <p className="font-bold text-sm tracking-wide">Alles erledigt!</p>
                     </div>
                 )}
            </div>
        </GlassCard>

        {/* Study Goal */}
        <GlassCard 
            delay={100} 
            onClick={() => setView('study')} 
            className="md:col-span-1 lg:col-span-1 row-span-2 p-6 flex flex-col justify-between bg-gradient-to-br from-brand-gold/5 to-brand-gold/10 border-brand-gold/20 min-h-[320px]"
        >
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-bold text-lg text-slate-800 dark:text-white tracking-tight">Lernzeit</h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">Diese Woche</p>
                </div>
                <Trophy size={22} className="text-brand-gold drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]" />
            </div>
            
            <div className="flex flex-col items-center mt-4">
                 <div className="relative w-32 h-32 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90 filter drop-shadow-lg">
                        <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-200 dark:text-white/10" />
                        <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={351} strokeDashoffset={351 - (351 * studyProgress) / 100} strokeLinecap="round" className="text-brand-gold transition-all duration-1000 ease-vision" />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                        <span className="text-3xl font-black text-slate-700 dark:text-white tracking-tighter">{studyProgress}%</span>
                    </div>
                 </div>
            </div>
            
            <div className="text-center mt-4 p-3 rounded-2xl bg-brand-gold/10 border border-brand-gold/20">
                <div className="text-2xl font-black text-slate-800 dark:text-white leading-none">{completedStudy}/{totalStudy}</div>
                <div className="text-[10px] font-bold uppercase text-slate-500 tracking-wider mt-1">Sessions erledigt</div>
            </div>
        </GlassCard>

        {/* AI Tip - Spans full width on mobile, 2 cols on large */}
        <GlassCard delay={150} noHover className="md:col-span-2 lg:col-span-4 p-6 bg-brand-purple text-white relative overflow-hidden border-none shadow-2xl shadow-brand-purple/30 min-h-[120px] flex items-center">
            <div className="absolute inset-0 bg-gradient-to-r from-brand-purple via-brand-magenta to-brand-purple opacity-90" />
            <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-gradient-to-t from-white/20 to-transparent rotate-45" />
            
            <div className="relative z-10 flex items-center gap-6 w-full">
                <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm shrink-0 shadow-inner ring-1 ring-white/30">
                     <Zap size={24} className="text-brand-gold fill-brand-gold animate-pulse" />
                </div>
                <div>
                    <div className="text-[11px] font-bold uppercase tracking-widest opacity-80 mb-1.5">Daily Smart Tip</div>
                    <p className="text-lg font-bold leading-snug opacity-95 tracking-tight max-w-3xl">
                        "Nutze die Pomodoro-Technik im Lern-Tab für mehr Fokus: 25min lernen, 5min Pause."
                    </p>
                </div>
            </div>
        </GlassCard>

      </div>
    </div>
  );
};
