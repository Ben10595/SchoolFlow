import React from 'react';
import { GlassCard } from './UI/GlassCard';
import { Homework, Exam, StudySession, ViewState } from '../types';
import { ArrowRight, CheckCircle2, CalendarDays, Timer, Quote } from 'lucide-react';
import { User } from 'firebase/auth';

interface DashboardProps {
  homework: Homework[];
  exams: Exam[];
  studySessions: StudySession[];
  setView: (view: ViewState) => void;
  user: User | null;
}

export const Dashboard: React.FC<DashboardProps> = ({ homework, exams, studySessions, setView, user }) => {
  const pendingHomework = homework.filter(h => !h.completed).length;
  const completedHomework = homework.filter(h => h.completed).length;
  
  const nextExam = exams
    .map(e => ({ ...e, daysLeft: Math.ceil((new Date(e.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) }))
    .filter(e => e.daysLeft >= 0)
    .sort((a, b) => a.daysLeft - b.daysLeft)[0];
  
  const totalStudy = studySessions.length;

  return (
    <div className="flex flex-col h-full animate-fade-in">
      {/* Hero Header */}
      <header className="py-8 mb-2 border-b border-slate-200 dark:border-white/5 transition-colors">
        <h1 className="text-3xl font-semibold text-slate-800 dark:text-white tracking-tight mb-1">
          Willkommen zurück, {user?.displayName?.split(' ')[0] || 'Schüler'}
        </h1>
        <p className="text-sm text-slate-500 dark:text-gray-400 font-normal">
          Übersicht deiner aktuellen Lernziele und Aufgaben.
        </p>
      </header>

      {/* Business Grid - Gap 6 */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[minmax(180px,auto)]">
        
        {/* PRIMARY CARD 1: Tasks */}
        <GlassCard 
            onClick={() => setView('homework')} 
            variant="primary"
            className="md:col-span-7 p-8 flex flex-col justify-between group"
        >
          <div className="flex justify-between items-start">
             <div className="flex items-center gap-3">
                <div className="p-2 rounded bg-blue-500/10 border border-blue-500/20">
                    <CheckCircle2 size={20} className="text-blue-500 dark:text-blue-400" />
                </div>
                <span className="text-xs font-medium text-slate-500 dark:text-gray-400 uppercase tracking-wider">Offene Aufgaben</span>
             </div>
             <ArrowRight size={18} className="text-slate-400 dark:text-gray-600 group-hover:text-slate-800 dark:group-hover:text-white transition-colors" />
          </div>
          
          <div className="mt-6">
            <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-slate-800 dark:text-white tracking-tight">{pendingHomework}</span>
                <span className="text-sm text-slate-500 dark:text-gray-500">ausstehend</span>
            </div>
            
            <div className="mt-6 h-1 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-blue-500" 
                    style={{ width: `${homework.length > 0 ? (completedHomework / homework.length) * 100 : 0}%` }}
                />
            </div>
             <div className="flex justify-between mt-2">
                <span className="text-[10px] text-slate-400 dark:text-gray-500 uppercase">Completion Rate</span>
                <span className="text-[10px] text-slate-800 dark:text-white font-bold">{homework.length > 0 ? Math.round((completedHomework / homework.length) * 100) : 0}%</span>
            </div>
          </div>
        </GlassCard>

        {/* SECONDARY CARD: Study */}
        <GlassCard 
            onClick={() => setView('study')} 
            variant="secondary"
            className="md:col-span-5 p-6 flex flex-col justify-between group"
        >
             <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded bg-slate-100 dark:bg-white/5 group-hover:bg-slate-200 dark:group-hover:bg-white/10 transition-colors">
                    <Timer size={18} className="text-slate-500 dark:text-gray-400 group-hover:text-slate-800 dark:group-hover:text-white transition-colors" />
                </div>
                <span className="text-xs font-medium text-slate-500 dark:text-gray-400 uppercase tracking-wider">Fokus Sessions</span>
             </div>
             
             <div>
                 <div className="text-3xl font-bold text-slate-800 dark:text-white">{totalStudy}</div>
                 <div className="text-sm text-slate-500 dark:text-gray-500 mt-1">Sessions abgeschlossen</div>
             </div>
        </GlassCard>

        {/* PRIMARY CARD 2: Exams */}
        <GlassCard 
            onClick={() => setView('exams')} 
            variant="primary"
            className="md:col-span-5 p-8 flex flex-col justify-between group"
        >
            <div className="flex justify-between items-start">
                 <div className="flex items-center gap-3">
                    <div className="p-2 rounded bg-purple-500/10 border border-purple-500/20">
                        <CalendarDays size={20} className="text-purple-500 dark:text-purple-400" />
                    </div>
                    <span className="text-xs font-medium text-slate-500 dark:text-gray-400 uppercase tracking-wider">Nächste Prüfung</span>
                 </div>
            </div>

            <div className="mt-6">
                 {nextExam ? (
                     <>
                        <div className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight mb-1">
                            {nextExam.daysLeft === 1 ? 'Morgen' : nextExam.daysLeft === 0 ? 'Heute' : `In ${nextExam.daysLeft} Tagen`}
                        </div>
                        <div className="text-sm font-medium text-purple-600 dark:text-purple-400">
                             {nextExam.subject}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-gray-500 mt-1 truncate">
                             {nextExam.topic}
                        </div>
                     </>
                 ) : (
                     <div className="text-slate-500 dark:text-gray-500">
                         <p className="font-medium">Keine Prüfungen</p>
                         <p className="text-xs mt-1">Alles erledigt.</p>
                     </div>
                 )}
            </div>
        </GlassCard>

        {/* SECONDARY CARD: Quote */}
        <GlassCard 
            variant="secondary"
            noHover
            className="md:col-span-7 p-6 flex flex-col justify-center relative overflow-hidden"
        >
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-400 to-purple-500"></div>
            <div className="flex items-center gap-2 mb-3">
                <Quote size={16} className="text-yellow-500 dark:text-yellow-400" />
                <span className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">Zitat des Tages</span>
            </div>
            <p className="text-sm text-slate-600 dark:text-gray-300 leading-relaxed font-medium italic">
                "Nicht weil es schwer ist, wagen wir es nicht, sondern weil wir es nicht wagen, ist es schwer."
                <span className="block mt-2 text-xs not-italic text-slate-400 dark:text-gray-500">— Seneca</span>
            </p>
        </GlassCard>

      </div>
    </div>
  );
};