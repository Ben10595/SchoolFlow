import React, { useState } from 'react';
import { GlassCard } from './UI/GlassCard';
import { Homework, Priority } from '../types';
import { Trash2, Check, Plus, Filter, AlertCircle, Book, Calculator, Beaker, Globe, PenTool, Music } from 'lucide-react';

interface HomeworkViewProps {
  homework: Homework[];
  setHomework: (hw: Homework[]) => void;
}

// Helper to get icon based on subject
const getSubjectIcon = (subject: string) => {
  const s = subject.toLowerCase();
  if (s.includes('mathe')) return Calculator;
  if (s.includes('deutsch') || s.includes('englisch')) return Book;
  if (s.includes('bio') || s.includes('chemie') || s.includes('physik')) return Beaker;
  if (s.includes('geo') || s.includes('geschichte')) return Globe;
  if (s.includes('kunst')) return PenTool;
  if (s.includes('musik')) return Music;
  return Book;
};

export const HomeworkView: React.FC<HomeworkViewProps> = ({ homework, setHomework }) => {
  const [showForm, setShowForm] = useState(false);
  const [sortBy, setSortBy] = useState<'date' | 'priority' | 'subject'>('date');
  
  // Form State
  const [subject, setSubject] = useState('');
  const [desc, setDesc] = useState('');
  const [date, setDate] = useState('');
  const [priority, setPriority] = useState<Priority>(Priority.MEDIUM);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !date) return;

    const newHw: Homework = {
      id: Date.now().toString(),
      subject,
      description: desc,
      dueDate: date,
      priority,
      completed: false
    };

    setHomework([...homework, newHw]);
    setSubject('');
    setDesc('');
    setDate('');
    setPriority(Priority.MEDIUM);
    setShowForm(false);
  };

  const toggleComplete = (id: string) => {
    setHomework(homework.map(h => h.id === id ? { ...h, completed: !h.completed } : h));
  };

  const deleteHomework = (id: string) => {
    setHomework(homework.filter(h => h.id !== id));
  };

  const sortedHomework = [...homework].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    if (sortBy === 'date') return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    if (sortBy === 'subject') return a.subject.localeCompare(b.subject);
    if (sortBy === 'priority') {
      const pMap = { [Priority.HIGH]: 3, [Priority.MEDIUM]: 2, [Priority.LOW]: 1 };
      return pMap[b.priority] - pMap[a.priority];
    }
    return 0;
  });

  return (
    <div className="animate-fade-in">
      {/* Header Toolbar */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4 sticky top-0 md:relative z-20 bg-[#f0f2f5]/80 dark:bg-[#050b14]/80 md:bg-transparent backdrop-blur-lg md:backdrop-blur-none py-2 md:py-0">
        <div>
            <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">Aufgaben</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">Verwalte deine Schularbeiten effizient.</p>
        </div>
        
        <div className="flex items-center gap-3">
            <div className="flex gap-1 bg-white/50 dark:bg-white/5 p-1 rounded-xl border border-white/20 backdrop-blur-md">
            {(['date', 'priority', 'subject'] as const).map((key) => (
                <button
                key={key}
                onClick={() => setSortBy(key)}
                className={`
                    px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all
                    ${sortBy === key 
                    ? 'bg-white dark:bg-white/10 text-brand-purple dark:text-white shadow-sm' 
                    : 'text-slate-500 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5'}
                `}
                >
                {key === 'date' ? 'Datum' : key === 'priority' ? 'Prio' : 'Fach'}
                </button>
            ))}
            </div>
            <button 
            onClick={() => setShowForm(!showForm)}
            className="bg-brand-purple hover:bg-brand-purple/90 text-white p-3 rounded-xl shadow-lg shadow-brand-purple/25 transition-all active:scale-95"
            >
            <Plus size={20} />
            </button>
        </div>
      </div>

      {showForm && (
        <div className="mb-8 animate-fade-in-down">
             <GlassCard className="p-8 max-w-3xl mx-auto ring-4 ring-brand-purple/10">
                <h3 className="text-lg font-bold mb-6 text-slate-800 dark:text-white flex items-center gap-2">
                    <div className="p-2 bg-brand-purple/10 rounded-lg">
                         <Plus size={18} className="text-brand-purple"/> 
                    </div>
                    Neue Aufgabe erstellen
                </h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="group">
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 group-focus-within:text-brand-purple transition-colors">Fach</label>
                            <input 
                                type="text" 
                                value={subject} 
                                onChange={(e) => setSubject(e.target.value)}
                                className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-brand-purple/50 text-slate-800 dark:text-white transition-all"
                                placeholder="z.B. Mathe"
                                required
                            />
                        </div>
                        <div className="group">
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 group-focus-within:text-brand-purple transition-colors">Fällig am</label>
                            <input 
                                type="date" 
                                value={date} 
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-brand-purple/50 text-slate-800 dark:text-white transition-all"
                                required
                            />
                        </div>
                    </div>
                    <div className="group">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 group-focus-within:text-brand-purple transition-colors">Beschreibung</label>
                        <input 
                            type="text" 
                            value={desc} 
                            onChange={(e) => setDesc(e.target.value)}
                            className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-brand-purple/50 text-slate-800 dark:text-white transition-all"
                            placeholder="Details zur Aufgabe..."
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Priorität</label>
                        <div className="flex gap-3">
                            {[Priority.LOW, Priority.MEDIUM, Priority.HIGH].map(p => (
                                <button
                                    type="button"
                                    key={p}
                                    onClick={() => setPriority(p)}
                                    className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all border ${priority === p 
                                        ? p === Priority.HIGH ? 'bg-red-500 border-red-600 text-white shadow-lg shadow-red-500/30' : p === Priority.MEDIUM ? 'bg-amber-500 border-amber-600 text-white shadow-lg shadow-amber-500/30' : 'bg-green-500 border-green-600 text-white shadow-lg shadow-green-500/30'
                                        : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/10'}`}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="pt-4 flex gap-3">
                        <button type="button" onClick={() => setShowForm(false)} className="px-6 py-4 rounded-xl font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
                            Abbrechen
                        </button>
                        <button type="submit" className="flex-1 bg-gradient-to-r from-brand-purple to-brand-magenta text-white font-bold py-4 rounded-xl shadow-xl shadow-brand-purple/30 hover:opacity-90 hover:scale-[1.01] active:scale-95 transition-all">
                            Aufgabe hinzufügen
                        </button>
                    </div>
                </form>
            </GlassCard>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
        {sortedHomework.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-slate-400">
            <div className="w-24 h-24 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-6 animate-pulse">
                <Check size={40} className="text-slate-300 dark:text-slate-600" />
            </div>
            <p className="font-bold text-xl text-slate-600 dark:text-slate-300">Alles erledigt!</p>
            <p className="text-sm opacity-60 mt-2">Gönn dir eine Pause.</p>
          </div>
        ) : (
          sortedHomework.map((hw, idx) => {
            const SubjectIcon = getSubjectIcon(hw.subject);
            return (
            <GlassCard 
                delay={idx * 50} // Stagger effect
                key={hw.id} 
                className={`flex flex-col group h-full ${hw.completed ? 'opacity-60 grayscale-[0.5]' : ''} ${hw.priority === Priority.HIGH ? 'border-l-4 border-l-red-500' : hw.priority === Priority.MEDIUM ? 'border-l-4 border-l-amber-500' : ''}`}
            >
              <div className="p-6 flex-1 flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-600 dark:text-slate-300">
                        <SubjectIcon size={20} />
                    </div>
                    <button 
                        onClick={(e) => { e.stopPropagation(); deleteHomework(hw.id); }}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-300 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                    >
                        <Trash2 size={16} />
                    </button>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className={`font-bold text-lg text-slate-800 dark:text-white leading-tight ${hw.completed ? 'line-through decoration-2 decoration-slate-300' : ''}`}>
                            {hw.subject}
                        </h3>
                         {hw.priority === Priority.HIGH && <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />}
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 font-medium">{hw.description}</p>
                  </div>
              </div>
              
              <div className="px-6 py-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-white/5 px-2 py-1 rounded-md">
                    <AlertCircle size={12} className={new Date(hw.dueDate) < new Date() ? 'text-red-500' : 'text-slate-400'}/>
                    {new Date(hw.dueDate).toLocaleDateString('de-DE', { day: 'numeric', month: 'short' })}
                </div>
                <button 
                    onClick={() => toggleComplete(hw.id)}
                    className={`
                      w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 shadow-md
                      ${hw.completed 
                        ? 'bg-green-500 text-white shadow-green-500/30 scale-100' 
                        : 'bg-white dark:bg-white/10 text-slate-300 hover:bg-brand-purple hover:text-white hover:scale-110'}
                    `}
                  >
                    <Check size={16} strokeWidth={3} />
                  </button>
              </div>
            </GlassCard>
          )})
        )}
      </div>
    </div>
  );
};