import React, { useState } from 'react';
import { GlassCard } from './UI/GlassCard';
import { StudySession } from '../types';
import { Plus, Clock, CheckCircle, Trash2, Play, RotateCcw, Brain, Coffee } from 'lucide-react';

interface StudyViewProps {
  sessions: StudySession[];
  setSessions: (sessions: StudySession[]) => void;
}

export const StudyView: React.FC<StudyViewProps> = ({ sessions, setSessions }) => {
  const [showForm, setShowForm] = useState(false);
  const [subject, setSubject] = useState('');
  const [duration, setDuration] = useState('30');
  const [topic, setTopic] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject) return;

    const newSession: StudySession = {
      id: Date.now().toString(),
      subject,
      topic,
      durationMinutes: parseInt(duration),
      completed: false
    };

    setSessions([...sessions, newSession]);
    setSubject('');
    setTopic('');
    setDuration('30');
    setShowForm(false);
  };

  const toggleSession = (id: string) => {
    setSessions(sessions.map(s => s.id === id ? { ...s, completed: !s.completed } : s));
  };

  const deleteSession = (id: string) => {
    setSessions(sessions.filter(s => s.id !== id));
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
        <div>
             <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">Fokus Zeit</h2>
             <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">Plane deine Lerneinheiten wie eine Playlist.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-brand-gold hover:bg-brand-gold/90 text-slate-900 p-3 rounded-xl shadow-lg shadow-brand-gold/25 transition-all active:scale-95"
        >
          <Plus size={20} />
        </button>
      </div>

      {showForm && (
        <div className="mb-8 animate-fade-in-down">
            <GlassCard className="p-8 max-w-3xl mx-auto ring-4 ring-brand-gold/10">
                <h3 className="text-lg font-bold mb-6 text-slate-800 dark:text-white flex items-center gap-2">
                     <div className="p-2 bg-brand-gold/20 rounded-lg">
                        <Brain size={18} className="text-brand-gold dark:text-amber-400"/>
                     </div>
                     Neue Session planen
                </h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="group">
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 group-focus-within:text-brand-gold transition-colors">Fach</label>
                            <input 
                                type="text" 
                                value={subject} 
                                onChange={(e) => setSubject(e.target.value)}
                                className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-brand-gold/50 text-slate-800 dark:text-white transition-all"
                                placeholder="z.B. Biologie"
                                required
                            />
                        </div>
                        <div className="group">
                             <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 group-focus-within:text-brand-gold transition-colors">Thema</label>
                            <input 
                                type="text" 
                                value={topic} 
                                onChange={(e) => setTopic(e.target.value)}
                                className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-brand-gold/50 text-slate-800 dark:text-white transition-all"
                                placeholder="Zellteilung"
                            />
                        </div>
                    </div>
                    <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Dauer (Minuten)</label>
                    <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                        {['15', '25', '45', '60', '90'].map((min) => (
                        <button
                            key={min}
                            type="button"
                            onClick={() => setDuration(min)}
                            className={`
                            px-6 py-4 rounded-2xl text-sm font-bold transition-all border whitespace-nowrap flex flex-col items-center gap-1 min-w-[80px]
                            ${duration === min 
                                ? 'bg-brand-gold border-brand-gold text-slate-900 shadow-lg shadow-brand-gold/30' 
                                : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/10'}
                            `}
                        >
                            <span className="text-lg">{min}</span>
                            <span className="text-[10px] uppercase opacity-70">Min</span>
                        </button>
                        ))}
                    </div>
                    </div>
                    <div className="pt-4 flex gap-3">
                        <button type="button" onClick={() => setShowForm(false)} className="px-6 py-4 rounded-xl font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
                            Abbrechen
                        </button>
                        <button type="submit" className="flex-1 bg-brand-gold text-slate-900 font-bold py-4 rounded-xl shadow-xl shadow-brand-gold/30 hover:bg-amber-400 hover:scale-[1.01] active:scale-95 transition-all">
                            Einplanen
                        </button>
                    </div>
                </form>
            </GlassCard>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
        {sessions.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-slate-400">
                <div className="w-24 h-24 bg-brand-gold/10 rounded-full flex items-center justify-center mb-6 animate-pulse">
                    <Coffee size={40} className="text-brand-gold" />
                </div>
                <p className="font-bold text-xl text-slate-600 dark:text-slate-300">Keine Lern-Sessions.</p>
                <p className="text-sm opacity-60 mt-2">Zeit, produktiv zu werden.</p>
            </div>
        ) : (
          sessions.map((session, idx) => (
            <GlassCard 
                key={session.id} 
                delay={idx * 50}
                className={`p-6 transition-all flex flex-col gap-6 justify-between ${session.completed ? 'opacity-60 bg-slate-100/50 dark:bg-white/5' : ''}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                    <div className={`
                    w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-inner
                    ${session.completed 
                        ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400' 
                        : 'bg-brand-gold/20 text-brand-gold'}
                    `}>
                    {session.completed ? <CheckCircle size={24} /> : <Clock size={24} />}
                    </div>
                    <div className="min-w-0">
                        <h3 className="font-bold text-lg text-slate-800 dark:text-white truncate leading-tight">{session.subject}</h3>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mt-1">
                            <Clock size={10} /> {session.durationMinutes} Min
                        </span>
                    </div>
                </div>
                <button 
                    onClick={() => deleteSession(session.id)}
                    className="p-2 rounded-full text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
              </div>

              {session.topic && (
                  <div className="px-4 py-3 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-white/5">
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">{session.topic}</p>
                  </div>
              )}

              <button 
                onClick={() => toggleSession(session.id)}
                className={`
                  w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 active:scale-95
                  ${session.completed 
                    ? 'bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400' 
                    : 'bg-slate-800 dark:bg-white text-white dark:text-slate-900 shadow-lg shadow-slate-800/30 dark:shadow-white/10 hover:scale-[1.02]'}
                `}
              >
                {session.completed ? (
                    <>
                        <RotateCcw size={18} /> Wiederholen
                    </>
                ) : (
                    <>
                        <Play size={18} fill="currentColor" /> Starten
                    </>
                )}
              </button>
            </GlassCard>
          ))
        )}
      </div>
    </div>
  );
};