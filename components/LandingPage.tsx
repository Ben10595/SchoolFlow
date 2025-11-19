import React from 'react';
import { ArrowRight, Layers, Zap, Shield } from 'lucide-react';

interface LandingPageProps {
  onLoginClick: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLoginClick }) => {
  return (
    <div className="min-h-screen w-full bg-white dark:bg-[#020617] relative overflow-hidden flex flex-col items-center justify-center text-slate-900 dark:text-white px-6">
      <div className="absolute top-[-10%] right-[-5%] w-[60vw] h-[60vw] rounded-full bg-indigo-50 dark:bg-indigo-950/30 blur-[100px] pointer-events-none" />
      
      <div className="relative z-10 max-w-4xl w-full text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 mb-8">
          <span className="w-2 h-2 rounded-full bg-brand-purple animate-pulse"></span>
          <span className="text-xs font-bold tracking-wide text-slate-600 dark:text-slate-300 uppercase">SchoolFlow OS 3.0</span>
        </div>

        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6">
          Fokus.<br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple to-brand-magenta">Nicht Chaos.</span>
        </h1>

        <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Der Schulplaner für Minimalisten. Hausaufgaben, Prüfungen und Lernzeiten in einem Interface, das einfach funktioniert.
        </p>

        <div className="flex justify-center gap-4">
          <button 
            onClick={onLoginClick}
            className="px-8 py-4 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-lg flex items-center gap-2 hover:scale-105 transition-transform shadow-xl shadow-brand-purple/10"
          >
            Loslegen <ArrowRight size={20} />
          </button>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {[
                { icon: Zap, title: "Schnell", text: "Keine Ladezeiten. Alles sofort da." },
                { icon: Layers, title: "Strukturiert", text: "Listen statt Karten-Chaos." },
                { icon: Shield, title: "Sicher", text: "Deine Daten gehören dir." }
            ].map((item, i) => (
                <div key={i} className="p-6 rounded-2xl border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5">
                    <item.icon className="mb-3 text-brand-purple" />
                    <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{item.text}</p>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};