
import React from 'react';
import { Sparkles, ArrowRight, CheckCircle } from 'lucide-react';

interface LandingPageProps {
  onLoginClick: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLoginClick }) => {
  return (
    <div className="min-h-screen w-full bg-[#050b14] relative overflow-hidden flex flex-col items-center justify-center text-white px-6">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-noise opacity-[0.05] pointer-events-none" />
      <div className="absolute top-[-20%] left-[-10%] w-[90vw] h-[90vw] rounded-full bg-brand-purple filter blur-[150px] opacity-20 animate-pulse-slow" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[80vw] h-[80vw] rounded-full bg-brand-magenta filter blur-[150px] opacity-15" />

      <div className="relative z-10 max-w-4xl w-full text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 animate-fade-in">
          <Sparkles size={14} className="text-brand-gold" />
          <span className="text-xs font-bold tracking-wider uppercase text-white/80">SchoolFlow OS 2.0</span>
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] mb-6 animate-fade-in-up">
          Dein Schulalltag.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-neon via-white to-brand-purple">Neu erfunden.</span>
        </h1>

        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-10 leading-relaxed animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          Verwalte Hausaufgaben, Prüfungen und Lernzeiten in einem Interface, das sich anfühlt wie aus der Zukunft. Keine Server, alles synchronisiert.
        </p>

        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <button 
            onClick={onLoginClick}
            className="px-8 py-4 rounded-2xl bg-white text-black font-bold text-lg flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)]"
          >
            Jetzt Starten <ArrowRight size={20} />
          </button>
          <button className="px-8 py-4 rounded-2xl bg-white/5 text-white border border-white/10 font-bold text-lg flex items-center justify-center hover:bg-white/10 transition-all backdrop-blur-sm">
            Mehr erfahren
          </button>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-left animate-fade-in" style={{ animationDelay: '400ms' }}>
           {[
             { title: "Cloud Sync", desc: "Deine Daten überall verfügbar." },
             { title: "AI Assistant", desc: "Lass die KI deine Aufgaben planen." },
             { title: "Focus Mode", desc: "Integrierte Timer für Lernsessions." }
           ].map((item, i) => (
             <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
               <CheckCircle className="text-brand-neon shrink-0" />
               <div>
                 <h3 className="font-bold text-white">{item.title}</h3>
                 <p className="text-sm text-slate-400">{item.desc}</p>
               </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};
