
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Homework, Exam, Priority } from '../types';
import { Sparkles, Send, X, Book, GraduationCap, Zap } from 'lucide-react';

interface AIAssistantProps {
  onAddHomework: (hw: Homework) => void;
  onAddExam: (exam: Exam) => void;
  isOpen: boolean;
  onClose: () => void;
}

type AIResponse = {
  type: 'homework' | 'exam' | 'chat' | 'error';
  message: string;
  data?: any;
};

export const AIAssistant: React.FC<AIAssistantProps> = ({ onAddHomework, onAddExam, isOpen, onClose }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([
    { role: 'ai', text: 'Hi! Ich bin SchoolFlow AI. 👋\nSag mir einfach "Mathe S.4 bis morgen" oder "Bio Test am Freitag".' }
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isOpen, loading]);

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim()) return;

    const userMsg = textToSend;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    // Safe API Key Access
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      setTimeout(() => {
          setMessages(prev => [...prev, { 
              role: 'ai', 
              text: '⚠️ Kein API-Key gefunden! Wenn du das auf GitHub testest: Die KI funktioniert nur, wenn du das Repo lokal klonst und eine .env Datei mit deinem Key anlegst.' 
          }]);
          setLoading(false);
      }, 500);
      return;
    }

    try {
      const ai = new GoogleGenAI({ apiKey: apiKey });
      const today = new Date().toISOString().split('T')[0];
      const dayName = new Date().toLocaleDateString('de-DE', { weekday: 'long' });

      const systemPrompt = `
        Du bist ein intelligenter Schul-Assistent. Heute ist ${dayName}, der ${today}.
        
        Dein Ziel: Daten extrahieren oder motivieren.
        
        1. HAUSAUFGABEN (z.B. "Mathe S.4 bis morgen", "Deutsch Aufsatz"):
           Antworte JSON: { "type": "homework", "message": "Alles klar! 📚 [Fach] wurde eingetragen.", "data": { "subject": "...", "description": "...", "dueDate": "YYYY-MM-DD", "priority": "Medium" } }
           - Priority: High wenn dringend, sonst Medium.

        2. TESTS/ARBEITEN (z.B. "Englisch Klausur am Freitag"):
           Antworte JSON: { "type": "exam", "message": "Viel Erfolg beim Lernen! 🎓 [Fach] Prüfung ist notiert.", "data": { "subject": "...", "topic": "...", "date": "YYYY-MM-DD" } }

        3. SONSTIGES (Chat, Motivation):
           Antworte JSON: { "type": "chat", "message": "Kurze, freundliche Antwort (max 2 Sätze). Nutze Emojis!" }

        Gib NUR valides JSON zurück.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: userMsg,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: 'application/json'
        }
      });

      const resultText = response.text || '{}';
      const result = JSON.parse(resultText) as AIResponse;

      if (result.type === 'homework' && result.data) {
        onAddHomework({
          id: Date.now().toString(),
          subject: result.data.subject || 'Allgemein',
          description: result.data.description || '',
          dueDate: result.data.dueDate || today,
          priority: result.data.priority || Priority.MEDIUM,
          completed: false
        });
      } else if (result.type === 'exam' && result.data) {
        onAddExam({
          id: Date.now().toString(),
          subject: result.data.subject || 'Allgemein',
          topic: result.data.topic || 'Allgemein',
          date: result.data.date || today
        });
      }

      setMessages(prev => [...prev, { role: 'ai', text: result.message }]);

    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'ai', text: 'Ups, da ist was schiefgelaufen. 🤖 Überprüfe deinen API Key oder die Verbindung.' }]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const suggestions = [
    { icon: Book, label: "Mathe bis Montag", text: "Mathe Hausaufgabe Seite 10 bis Montag", color: "text-blue-500 bg-blue-500/10" },
    { icon: GraduationCap, label: "Test am Freitag", text: "Englisch Test am Freitag eintragen", color: "text-brand-magenta bg-brand-magenta/10" },
    { icon: Zap, label: "Motivation", text: "Ich brauche Motivation!", color: "text-brand-gold bg-brand-gold/10" },
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center bg-[#050b14]/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full md:w-[500px] h-[90vh] md:h-[750px] flex flex-col bg-white dark:bg-[#0f172a] rounded-t-[2.5rem] md:rounded-[2.5rem] shadow-2xl shadow-black/50 overflow-hidden animate-fade-in-up relative border border-white/10">
        
        {/* Header */}
        <div className="px-8 py-6 flex justify-between items-center bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-md border-b border-slate-100 dark:border-white/5 relative z-10">
          <div className="flex items-center gap-4">
            <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-tr from-brand-purple via-brand-magenta to-brand-purple rounded-2xl flex items-center justify-center shadow-lg shadow-brand-purple/30">
                    <Sparkles size={24} className="text-white animate-pulse-slow" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-[#0f172a] rounded-full shadow-[0_0_8px_rgba(34,197,94,0.8)]"></div>
            </div>
            <div>
              <h3 className="font-bold text-xl text-slate-800 dark:text-white leading-none tracking-tight">AI Assistant</h3>
              <p className="text-[10px] text-brand-purple dark:text-brand-neon font-bold uppercase tracking-widest mt-1.5">Active</p>
            </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center bg-slate-100 dark:bg-white/5 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 transition-colors group">
            <X size={20} className="text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-white" />
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50 dark:bg-[#050b14]/50 bg-noise" ref={scrollRef}>
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
              <div className={`
                max-w-[85%] p-5 text-[15px] leading-relaxed backdrop-blur-md
                ${msg.role === 'user' 
                  ? 'bg-gradient-to-br from-brand-purple to-brand-magenta text-white rounded-2xl rounded-tr-sm shadow-lg shadow-brand-purple/20' 
                  : 'bg-white dark:bg-[#1e293b]/90 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/5 rounded-2xl rounded-tl-sm drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)]'}
              `}>
                {msg.text}
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex justify-start animate-fade-in">
              <div className="bg-white dark:bg-[#1e293b]/90 px-5 py-4 rounded-2xl rounded-tl-sm border border-slate-200 dark:border-white/5 flex gap-2 items-center shadow-sm drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
                <div className="w-2 h-2 bg-brand-purple rounded-full animate-bounce" style={{ animationDuration: '0.6s', animationDelay: '0s' }} />
                <div className="w-2 h-2 bg-brand-magenta rounded-full animate-bounce" style={{ animationDuration: '0.6s', animationDelay: '0.15s' }} />
                <div className="w-2 h-2 bg-brand-purple rounded-full animate-bounce" style={{ animationDuration: '0.6s', animationDelay: '0.3s' }} />
              </div>
            </div>
          )}

          {/* Quick Chips */}
          {!loading && (
            <div className="pt-4 pb-2 space-y-3">
               {messages.length < 3 && <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-600 text-center mb-2">Vorschläge</p>}
              <div className="flex flex-wrap justify-center gap-3">
                  {suggestions.map((s, i) => (
                    <button 
                    key={i}
                    onClick={() => handleSend(s.text)}
                    className="bg-white/80 dark:bg-[#1e293b]/80 border border-slate-200 dark:border-white/5 hover:border-brand-purple dark:hover:border-brand-purple rounded-xl px-4 py-2.5 flex items-center gap-2 transition-all hover:scale-105 shadow-[0_0_12px_rgba(255,255,255,0.05)] dark:shadow-[0_0_12px_rgba(0,0,0,0.2)] backdrop-blur-sm"
                    >
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${s.color}`}>
                        <s.icon size={14} />
                    </div>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{s.label}</span>
                    </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-5 bg-white/90 dark:bg-[#0f172a]/90 border-t border-slate-100 dark:border-white/5 pb-8 md:pb-5 backdrop-blur-xl">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex gap-3 relative"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Nachricht an AI..."
              className="flex-1 p-4 pl-6 rounded-2xl bg-slate-100 dark:bg-[#050b14] border-0 focus:ring-2 focus:ring-brand-purple/50 text-slate-800 dark:text-white placeholder:text-slate-400 text-base font-medium transition-shadow shadow-inner"
            />
            <button 
              type="submit"
              disabled={loading || !input.trim()}
              className="aspect-square h-14 bg-brand-purple hover:bg-brand-purple/90 disabled:opacity-50 disabled:scale-95 text-white rounded-2xl transition-all shadow-lg shadow-brand-purple/20 flex items-center justify-center group"
            >
              <Send size={20} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
