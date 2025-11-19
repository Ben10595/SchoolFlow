import React, { useState } from 'react';
import { Exam } from '../types';
import { Plus, Trash2, Calendar, X } from 'lucide-react';
import { GlassCard } from './UI/GlassCard';

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

    setExams([...exams, { id: Date.now().toString(), subject, topic, date }]);
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
    <div className="animate-fade-in max-w-screen-xl mx-auto">
       <header className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
        <div>
            <h2 className="text-3xl font-semibold text-white tracking-tight">Prüfungen</h2>
            <p className="text-sm text-gray-400 mt-1">Anstehende Tests und Klausuren.</p>
        </div>
        <button 
            onClick={() => setShowForm(!showForm)}
            className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-lg shadow-purple-600/20"
            >
            <Plus size={16} />
            <span>Prüfung</span>
        </button>
      </header>

      {showForm && (
        <div className="mb-8 animate-fade-in">
             <div className="bg-[#161a24] p-6 rounded-xl border border-white/10 shadow-2xl">
                 <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">Neue Prüfung</h3>
                    <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-white"><X size={16}/></button>
                </div>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="space-y-1">
                        <label className="text-xs text-gray-500 font-medium ml-1">Fach</label>
                        <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="z.B. Englisch" className="w-full p-3 rounded-lg bg-[#0f0f17] border border-white/10 text-white text-sm focus:border-purple-500 focus:outline-none transition-colors" required />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs text-gray-500 font-medium ml-1">Thema</label>
                        <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="z.B. Vokabeln Unit 1" className="w-full p-3 rounded-lg bg-[#0f0f17] border border-white/10 text-white text-sm focus:border-purple-500 focus:outline-none transition-colors" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs text-gray-500 font-medium ml-1">Datum</label>
                        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full p-3 rounded-lg bg-[#0f0f17] border border-white/10 text-white text-sm focus:border-purple-500 focus:outline-none transition-colors" required />
                    </div>
                    <div className="md:col-span-3 flex justify-end pt-2">
                        <button type="submit" className="px-8 py-2.5 bg-purple-600 text-white rounded-lg font-bold text-sm hover:bg-purple-500 transition-colors">Speichern</button>
                    </div>
                </form>
            </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exams.length === 0 && (
            <div className="md:col-span-3 text-center py-20 border border-dashed border-white/5 rounded-xl">
                <p className="text-gray-500 text-sm">Keine Prüfungen eingetragen.</p>
            </div>
        )}
        {sortedExams.map((exam) => {
            const days = getDaysLeft(exam.date);
            const isUrgent = days <= 3 && days >= 0;
            
            return (
              <GlassCard 
                key={exam.id} 
                variant={isUrgent ? 'primary' : 'secondary'}
                className={`p-6 flex flex-col justify-between min-h-[180px] group ${isUrgent ? 'border-purple-500/30' : ''}`}
              >
                  <div className="flex justify-between items-start">
                      <div className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-sm border ${isUrgent ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-purple-500/10 text-purple-400 border-purple-500/20'}`}>
                          {days === 0 ? 'Heute' : days === 1 ? 'Morgen' : `Noch ${days} Tage`}
                      </div>
                      <button onClick={() => deleteExam(exam.id)} className="text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={16} /></button>
                  </div>
                  
                  <div className="mt-4">
                      <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-bold text-white tracking-tight">{days}</span>
                          <span className="text-xs text-gray-500 uppercase font-medium">Tage</span>
                      </div>
                      <h3 className="text-lg font-medium text-white mt-2">{exam.subject}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">{exam.topic || 'Kein Thema'}</p>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-2 text-xs text-gray-400">
                      <Calendar size={12} />
                      {new Date(exam.date).toLocaleDateString('de-DE', { weekday: 'long', day: '2-digit', month: 'long' })}
                  </div>
              </GlassCard>
            );
        })}
      </div>
    </div>
  );
};