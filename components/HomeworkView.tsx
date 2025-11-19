import React, { useState } from 'react';
import { Homework, Priority } from '../types';
import { Trash2, Plus, Check, X } from 'lucide-react';

interface HomeworkViewProps {
  homework: Homework[];
  setHomework: (hw: Homework[]) => void;
}

export const HomeworkView: React.FC<HomeworkViewProps> = ({ homework, setHomework }) => {
  const [showForm, setShowForm] = useState(false);
  
  // Form State
  const [subject, setSubject] = useState('');
  const [desc, setDesc] = useState('');
  const [date, setDate] = useState('');
  const [priority] = useState<Priority>(Priority.MEDIUM);

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
    setSubject(''); setDesc(''); setDate('');
    setShowForm(false);
  };

  const toggleComplete = (id: string) => {
    setHomework(homework.map(h => h.id === id ? { ...h, completed: !h.completed } : h));
  };

  const deleteHomework = (id: string) => {
    setHomework(homework.filter(h => h.id !== id));
  };

  return (
    <div className="animate-fade-in max-w-screen-xl mx-auto h-full flex flex-col">
      <header className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
        <div>
            <h2 className="text-3xl font-semibold text-white tracking-tight">Aufgaben</h2>
            <p className="text-sm text-gray-400 mt-1">Verwalte deine täglichen To-Dos.</p>
        </div>
        <button 
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-lg shadow-blue-600/20"
            >
            <Plus size={16} />
            <span>Aufgabe</span>
        </button>
      </header>

      {showForm && (
        <div className="mb-8 animate-fade-in">
             <div className="bg-[#161a24] p-6 rounded-xl border border-white/10 shadow-2xl">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">Neue Aufgabe</h3>
                    <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-white"><X size={16}/></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs text-gray-500 font-medium ml-1">Fach</label>
                            <input 
                                type="text" value={subject} onChange={(e) => setSubject(e.target.value)}
                                className="w-full p-3 rounded-lg bg-[#0f0f17] border border-white/10 text-white text-sm focus:border-blue-500 focus:outline-none transition-colors placeholder:text-gray-700"
                                placeholder="z.B. Mathe" required
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs text-gray-500 font-medium ml-1">Fälligkeit</label>
                            <input 
                                type="date" value={date} onChange={(e) => setDate(e.target.value)}
                                className="w-full p-3 rounded-lg bg-[#0f0f17] border border-white/10 text-white text-sm focus:border-blue-500 focus:outline-none transition-colors"
                                required
                            />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs text-gray-500 font-medium ml-1">Beschreibung</label>
                        <input 
                            type="text" value={desc} onChange={(e) => setDesc(e.target.value)}
                            className="w-full p-3 rounded-lg bg-[#0f0f17] border border-white/10 text-white text-sm focus:border-blue-500 focus:outline-none transition-colors placeholder:text-gray-700"
                            placeholder="Details zur Aufgabe..."
                        />
                    </div>
                    
                    <div className="flex justify-end pt-4">
                        <button type="submit" className="px-8 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-lg transition-colors">Speichern</button>
                    </div>
                </form>
            </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto pr-2 space-y-2">
        {homework.length === 0 && (
            <div className="text-center py-20 border border-dashed border-white/5 rounded-xl">
                <p className="text-gray-500 text-sm">Keine offenen Aufgaben.</p>
            </div>
        )}
        {homework.map((h) => (
            <div 
                key={h.id}
                className={`
                    group flex items-center gap-4 p-4 rounded-lg border transition-all duration-200
                    ${h.completed 
                        ? 'bg-[#161a24]/40 border-white/5' 
                        : 'bg-[#161a24] border-white/5 hover:border-white/10'}
                `}
            >
                <button 
                    onClick={() => toggleComplete(h.id)}
                    className={`
                        shrink-0 w-5 h-5 rounded border flex items-center justify-center transition-all
                        ${h.completed 
                            ? 'bg-blue-600/20 border-blue-600 text-blue-400' 
                            : 'bg-[#0f0f17] border-white/10 text-transparent hover:border-blue-500'}
                    `}
                >
                    <Check size={12} strokeWidth={3} />
                </button>
                
                <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    <div className="md:col-span-6">
                        <div className="flex items-center gap-2 mb-0.5">
                             <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider bg-blue-400/10 px-1.5 py-0.5 rounded-sm">{h.subject}</span>
                        </div>
                        <h3 className={`text-sm font-medium text-white truncate ${h.completed ? 'line-through text-gray-500' : ''}`}>
                            {h.description || h.subject}
                        </h3>
                    </div>
                    
                    <div className="md:col-span-4 text-xs text-gray-500 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-white/10"></span>
                        {new Date(h.dueDate).toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: 'short' })}
                    </div>
                    
                    <div className="md:col-span-2 flex justify-end">
                         <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full border ${
                             h.priority === Priority.HIGH ? 'text-red-400 border-red-400/20 bg-red-400/5' :
                             h.priority === Priority.MEDIUM ? 'text-yellow-400 border-yellow-400/20 bg-yellow-400/5' :
                             'text-blue-400 border-blue-400/20 bg-blue-400/5'
                         }`}>
                             {h.priority}
                         </span>
                    </div>
                </div>

                <button 
                    onClick={() => deleteHomework(h.id)}
                    className="text-gray-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 p-2"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        ))}
      </div>
    </div>
  );
};