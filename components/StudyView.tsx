import React, { useState } from 'react';
import { StudySession } from '../types';
import { Plus, Play, RotateCcw, Trash2, Coffee, X } from 'lucide-react';
import { GlassCard } from './UI/GlassCard';

interface StudyViewProps {
  sessions: StudySession[];
  setSessions: (sessions: StudySession[]) => void;
}

export const StudyView: React.FC<StudyViewProps> = ({ sessions, setSessions }) => {
  const [showForm, setShowForm] = useState(false);
  const [subject, setSubject] = useState('');
  const [duration, setDuration] = useState('25');
  const [topic, setTopic] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject) return;
    setSessions([...sessions, { id: Date.now().toString(), subject, topic, durationMinutes: parseInt(duration) || 25, completed: false }]);
    setSubject(''); setTopic(''); setDuration('25'); setShowForm(false);
  };

  const toggleSession = (id: string) => {
    setSessions(sessions.map(s => s.id === id ? { ...s, completed: !s.completed } : s));
  };

  const deleteSession = (id: string) => {
    setSessions(sessions.filter(s => s.id !== id));
  };

  return (
    <div className="animate-fade-in max-w-screen-xl mx-auto">
      <header className="flex items-center justify-between mb-8 border-b border-slate-200 dark:border-white/5 pb-6 transition-colors">
        <div>
            <h2 className="text-3xl font-semibold text-slate-800 dark:text-white tracking-tight">Fokus Zeit</h2>
            <p className="text-sm text-slate-500 dark:text-gray-400 mt-1">Plane und tracke deine Lerneinheiten.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-gray-200 text-white dark:text-slate-900 px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2 shadow-lg">
            <Plus size={16} /> <span className="hidden md:inline">Session Planen</span>
        </button>
      </header>

      {showForm && (
         <div className="mb-8 animate-fade-in">
             <div className="bg-white dark:bg-[#161a24] p-6 rounded-xl border border-slate-200 dark:border-white/10 shadow-2xl">
                 <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">Neue Session</h3>
                    <button onClick={() => setShowForm(false)} className="text-slate-400 dark:text-gray-500 hover:text-slate-800 dark:hover:text-white"><X size={16}/></button>
                </div>
                 <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                         <label className="text-xs text-slate-500 dark:text-gray-500 font-medium ml-1">Fach</label>
                        <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="z.B. Geschichte" className="w-full p-3 rounded-lg bg-slate-50 dark:bg-[#0f0f17] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-sm focus:border-blue-500 dark:focus:border-white/30 focus:outline-none transition-colors" required />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs text-slate-500 dark:text-gray-500 font-medium ml-1">Thema</label>
                        <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Optional" className="w-full p-3 rounded-lg bg-slate-50 dark:bg-[#0f0f17] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-sm focus:border-blue-500 dark:focus:border-white/30 focus:outline-none transition-colors" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs text-slate-500 dark:text-gray-500 font-medium ml-1">Dauer (Minuten)</label>
                        <input 
                          type="number" 
                          value={duration} 
                          onChange={(e) => setDuration(e.target.value)} 
                          placeholder="25"
                          min="1"
                          className="w-full p-3 rounded-lg bg-slate-50 dark:bg-[#0f0f17] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-sm focus:border-blue-500 dark:focus:border-white/30 focus:outline-none transition-colors"
                        />
                    </div>
                    <div className="md:col-span-3 flex justify-end pt-2">
                         <button type="submit" className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold py-2.5 px-8 rounded-lg text-sm hover:bg-slate-800 dark:hover:bg-gray-200 transition-colors">Hinzufügen</button>
                    </div>
                 </form>
             </div>
         </div>
      )}

      <div className="grid grid-cols-1 gap-3">
        {sessions.length === 0 && (
            <div className="text-center py-20 border border-dashed border-slate-200 dark:border-white/5 rounded-xl">
                <Coffee size={32} className="mx-auto mb-4 text-slate-400 dark:text-gray-600" />
                <p className="text-slate-500 dark:text-gray-500 text-sm">Keine aktiven Sessions.</p>
            </div>
        )}
        {sessions.map((s) => (
            <GlassCard key={s.id} noHover className={`flex items-center justify-between p-4 ${s.completed ? 'opacity-50' : ''}`}>
                <div className="flex items-center gap-5">
                    <button 
                        onClick={() => toggleSession(s.id)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all border ${s.completed ? 'bg-slate-100 dark:bg-[#161a24] border-slate-200 dark:border-white/10 text-slate-400 dark:text-gray-500' : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-transparent hover:scale-105'}`}
                    >
                        {s.completed ? <RotateCcw size={16} /> : <Play size={16} fill="currentColor" />}
                    </button>
                    <div>
                        <h3 className={`text-sm font-bold text-slate-800 dark:text-white ${s.completed ? 'line-through text-slate-400 dark:text-gray-500' : ''}`}>{s.subject}</h3>
                        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-gray-500 mt-0.5">
                            <span className="text-slate-400 dark:text-gray-400">{s.durationMinutes} Min</span>
                            {s.topic && <span>• {s.topic}</span>}
                        </div>
                    </div>
                </div>
                <button onClick={() => deleteSession(s.id)} className="text-slate-400 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 p-2 transition-colors"><Trash2 size={16} /></button>
            </GlassCard>
        ))}
      </div>
    </div>
  );
};