import React, { useState } from 'react';
import { GlassCard } from './UI/GlassCard';
import { Exam } from '../types';
import { Plus, Trash2, Calendar, BookOpen, Clock } from 'lucide-react';

interface ExamViewProps {
  exams: Exam[];
  setExams: (exams: Exam[]) => void;
}

export const ExamView: React.FC<ExamViewProps> = ({ exams, setExams }) => {
  const [showForm, setShowForm] = useState(false);
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !date) return;

    const newExam: Exam = {
      id: Date.now().toString(),
      subject,
      topic,
      date
    };

    setExams([...exams, newExam]);
    setSubject('');
    setTopic('');
    setDate('');
    setShowForm(false);
  };

  const deleteExam = (id: string) => {
    setExams(exams.filter(e => e.id !== id));
  };

  const getDaysLeft = (dateString: string) => {
    const diff = new Date(dateString).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const sortedExams = [...exams].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
        <div>
             <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">Prüfungen</h2>
             <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">Verpasse keine Deadline.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-brand-magenta hover:bg-brand-magenta/90 text-white p-3 rounded-xl shadow-lg shadow-brand-magenta/25 transition-all active:scale-95"
        >
          <Plus size={20} />
        </button>
      </div>

      {showForm && (
        <div className="mb-8 animate-fade-in-down">
            <GlassCard className="p-8 max-w-3xl mx-auto ring-4 ring-brand-magenta/10">
                <h3 className="text-lg font-bold mb-6 text-slate-800 dark:text-white flex items-center gap-2">
                     <div className="p-2 bg-brand-magenta/10 rounded-lg">
                        <Plus size={18} className="text-brand-magenta"/>
                     </div>
                     Neue Prüfung eintragen
                </h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="group">
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 group-focus-within:text-brand-magenta transition-colors">Fach</label>
                            <input 
                                type="text" 
                                value={subject} 
                                onChange={(e) => setSubject(e.target.value)}
                                className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-brand-magenta/50 text-slate-800 dark:text-white transition-all"
                                placeholder="z.B. Englisch"
                                required
                            />
                        </div>
                        <div className="group">
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 group-focus-within:text-brand-magenta transition-colors">Datum</label>
                            <input 
                                type="date" 
                                value={date} 
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-brand-magenta/50 text-slate-800 dark:text-white transition-all"
                                required
                            />
                        </div>
                    </div>
                    <div className="group">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 group-focus-within:text-brand-magenta transition-colors">Thema</label>
                        <input 
                            type="text" 
                            value={topic} 
                            onChange={(e) => setTopic(e.target.value)}
                            className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-brand-magenta/50 text-slate-800 dark:text-white transition-all"
                            placeholder="Vokabeltest Unit 3"
                        />
                    </div>
                    <div className="pt-4 flex gap-3">
                         <button type="button" onClick={() => setShowForm(false)} className="px-6 py-4 rounded-xl font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
                            Abbrechen
                        </button>
                        <button type="submit" className="flex-1 bg-brand-magenta text-white font-bold py-4 rounded-xl shadow-xl shadow-brand-magenta/30 hover:opacity-90 hover:scale-[1.01] active:scale-95 transition-all">
                            Prüfung speichern
                        </button>
                    </div>
                </form>
            </GlassCard>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
        {sortedExams.length === 0 ? (
           <div className="col-span-full flex flex-col items-center justify-center py-20 text-slate-400">
                <div className="w-24 h-24 bg-brand-magenta/5 rounded-full flex items-center justify-center mb-6 animate-pulse">
                    <Calendar size={40} className="text-brand-magenta/50" />
                </div>
                <p className="font-bold text-xl text-slate-600 dark:text-slate-300">Keine Prüfungen!</p>
           </div>
        ) : (
          sortedExams.map((exam, idx) => {
            const days = getDaysLeft(exam.date);
            const isUrgent = days <= 3;
            
            return (
              <GlassCard 
                key={exam.id} 
                delay={idx * 50}
                className={`p-0 flex flex-col h-full overflow-hidden group ${isUrgent ? 'ring-2 ring-brand-magenta' : ''}`}
              >
                {/* Decorative Top Gradient */}
                <div className={`h-1.5 w-full bg-gradient-to-r ${isUrgent ? 'from-red-500 to-brand-magenta' : 'from-brand-blue to-brand-neon'}`} />
                
                <div className="p-6 flex flex-col h-full relative">
                    {/* Giant Background Number */}
                    <div className="absolute -right-6 -top-2 text-9xl font-black text-slate-900/5 dark:text-white/5 pointer-events-none select-none z-0">
                        {days}
                    </div>

                    <div className="flex justify-between items-start mb-8 relative z-10">
                        <div className={`p-2.5 rounded-xl shadow-sm ${isUrgent ? 'bg-brand-magenta text-white' : 'bg-white dark:bg-white/10 text-slate-600 dark:text-white'}`}>
                            <BookOpen size={20} />
                        </div>
                         <button 
                            onClick={() => deleteExam(exam.id)}
                            className="text-slate-300 hover:text-brand-magenta transition-colors opacity-0 group-hover:opacity-100"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>

                    <div className="relative z-10">
                        <h3 className="text-2xl font-bold text-slate-800 dark:text-white truncate tracking-tight">{exam.subject}</h3>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-2 leading-relaxed line-clamp-2 h-10">{exam.topic}</p>
                    </div>

                    <div className="mt-auto pt-6 relative z-10">
                        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/80 dark:bg-black/20 border border-slate-100 dark:border-white/5">
                            <div className="flex items-center gap-2">
                                <Clock size={14} className={isUrgent ? 'text-brand-magenta' : 'text-slate-400'} />
                                <span className={`text-xs font-bold uppercase tracking-wider ${isUrgent ? 'text-brand-magenta' : 'text-slate-500 dark:text-slate-400'}`}>
                                    {days === 0 ? 'Heute' : days === 1 ? 'Morgen' : `In ${days} Tagen`}
                                </span>
                            </div>
                            <span className="text-xs font-mono font-medium text-slate-400">
                                {new Date(exam.date).toLocaleDateString('de-DE', {day: '2-digit', month: '2-digit'})}
                            </span>
                        </div>
                    </div>
                </div>
              </GlassCard>
            );
          })
        )}
      </div>
    </div>
  );
};