
import React, { useEffect, useState } from 'react';
import { ViewState, Homework, Exam, StudySession, Theme } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { HomeworkView } from './components/HomeworkView';
import { ExamView } from './components/ExamView';
import { StudyView } from './components/StudyView';
import { AIAssistant } from './components/AIAssistant';
import { AuthModal } from './components/AuthModal';
import { SettingsModal } from './components/SettingsModal';
import { LandingPage } from './components/LandingPage';
import { Moon, Sun, Sparkles, Loader2 } from 'lucide-react';
import { auth, db } from './firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('dashboard');
  const [theme, setTheme] = useLocalStorage<Theme>('schoolflow-theme', 'dark');
  const [showAI, setShowAI] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  // User State
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Data State
  const [homework, setHomework] = useState<Homework[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [sessions, setSessions] = useState<StudySession[]>([]);

  // Theme Effect
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // 1. Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 2. Data Sync Listener
  useEffect(() => {
    if (!user) {
      setHomework([]);
      setExams([]);
      setSessions([]);
      return;
    }

    const docRef = doc(db, "users", user.uid);

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setHomework(data.homework || []);
        setExams(data.exams || []);
        setSessions(data.sessions || []);
      } else {
        setDoc(docRef, {
          homework: [],
          exams: [],
          sessions: []
        }, { merge: true });
      }
    }, (error) => {
        console.error("Firestore Sync Error:", error);
    });

    return () => unsubscribe();
  }, [user]);

  // Helper to save data
  const saveData = (type: 'homework' | 'exams' | 'sessions', data: any) => {
    if (type === 'homework') setHomework(data);
    if (type === 'exams') setExams(data);
    if (type === 'sessions') setSessions(data);

    if (user) {
      const docRef = doc(db, "users", user.uid);
      setDoc(docRef, { [type]: data }, { merge: true });
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleAddHomework = (newHw: Homework | Homework[]) => {
    const newHwList = Array.isArray(newHw) ? [...homework, ...newHw] : [...homework, newHw];
    saveData('homework', newHwList);
  };

  const handleAddExam = (newExam: Exam) => {
    const newExamList = [...exams, newExam];
    saveData('exams', newExamList);
  };

  const handleSetHomework = (newVal: Homework[]) => saveData('homework', newVal);
  const handleSetExams = (newVal: Exam[]) => saveData('exams', newVal);
  const handleSetSessions = (newVal: StudySession[]) => saveData('sessions', newVal);

  const renderView = () => {
    switch (view) {
      case 'dashboard':
        return <Dashboard homework={homework} exams={exams} studySessions={sessions} setView={setView} />;
      case 'homework':
        return <HomeworkView homework={homework} setHomework={handleSetHomework} />;
      case 'exams':
        return <ExamView exams={exams} setExams={handleSetExams} />;
      case 'study':
        return <StudyView sessions={sessions} setSessions={handleSetSessions} />;
      default:
        return <Dashboard homework={homework} exams={exams} studySessions={sessions} setView={setView} />;
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#050b14] flex items-center justify-center text-white">
         <Loader2 size={40} className="animate-spin text-brand-purple" />
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <LandingPage onLoginClick={() => setShowAuth(true)} />
        <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
      </>
    );
  }

  return (
    <div className={`min-h-screen w-full flex transition-colors duration-1000 ${
      theme === 'dark' 
        ? 'bg-[#050b14]' 
        : 'bg-[#f0f2f5]' 
    }`}>
      {/* Background - Enhanced Opacity for VisionOS Depth */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute inset-0 bg-noise opacity-[0.05] mix-blend-overlay z-10" />
        <div className={`absolute top-[-20%] left-[-10%] w-[90vw] h-[90vw] rounded-full mix-blend-screen filter blur-[120px] opacity-40 animate-blob ${theme === 'dark' ? 'bg-brand-purple' : 'bg-purple-300'}`}></div>
        <div className={`absolute top-[10%] right-[-10%] w-[80vw] h-[80vw] rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-blob animation-delay-2000 ${theme === 'dark' ? 'bg-brand-magenta' : 'bg-pink-300'}`}></div>
        <div className={`absolute bottom-[-20%] left-[20%] w-[80vw] h-[80vw] rounded-full mix-blend-screen filter blur-[120px] opacity-35 animate-blob animation-delay-4000 ${theme === 'dark' ? 'bg-brand-blue' : 'bg-blue-300'}`}></div>
      </div>

      <Navbar 
        currentView={view} 
        setView={setView} 
        user={user} 
        onOpenSettings={() => setShowSettings(true)} 
      />

      {/* Main Layout */}
      <div className="flex-1 flex flex-col relative z-10 min-w-0 md:pl-[300px] transition-all duration-300">
        
        {/* Desktop Top Bar */}
        <div className="hidden md:flex px-10 py-6 justify-between items-center sticky top-0 z-20 pointer-events-none">
          <div className="flex items-center gap-2 pointer-events-auto"></div>
          
          <div className="flex items-center gap-5 pointer-events-auto">
            <div className="px-5 py-2 rounded-full bg-white/40 dark:bg-[#0f172a]/40 backdrop-blur-3xl border border-white/20 text-sm font-bold text-slate-600 dark:text-slate-300 shadow-lg">
                {new Date().toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' })}
            </div>
            
            <button 
                onClick={toggleTheme}
                className="w-11 h-11 flex items-center justify-center rounded-full bg-white/40 dark:bg-[#0f172a]/40 backdrop-blur-3xl border border-white/20 hover:bg-white/60 dark:hover:bg-white/10 transition-all shadow-lg group"
            >
                {theme === 'dark' 
                ? <Sun size={18} className="text-brand-gold group-hover:rotate-90 transition-transform" /> 
                : <Moon size={18} className="text-brand-purple group-hover:-rotate-12 transition-transform" />}
            </button>
          </div>
        </div>

        {/* Mobile Top Bar */}
        <div className="md:hidden px-6 py-5 flex justify-between items-center sticky top-0 z-20 backdrop-blur-2xl bg-white/70 dark:bg-[#0f172a]/70 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-tr from-brand-purple to-brand-magenta rounded-xl flex items-center justify-center shadow-lg ring-1 ring-white/20">
              <Sparkles size={18} className="text-white" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-slate-800 dark:text-white">SchoolFlow</span>
          </div>
          <button 
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-white/50 dark:bg-white/10 backdrop-blur-md border border-white/20 dark:border-white/10 shadow-sm"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
        </div>

        {/* Content */}
        <main className="flex-1 px-5 md:px-12 pb-32 md:pb-8 overflow-y-auto no-scrollbar">
          <div className="max-w-[2000px] mx-auto w-full h-full">
            {renderView()}
          </div>
        </main>
      </div>

      {/* Floating AI Button - Vision Size Upgrade */}
      <div className="fixed bottom-24 right-6 md:bottom-20 md:right-10 z-40">
        <button
          onClick={() => setShowAI(true)}
          className="group relative w-16 h-16 md:w-20 md:h-20 flex items-center justify-center transition-all hover:scale-110 duration-500"
        >
          <div className="absolute inset-0 bg-brand-purple rounded-full blur-2xl opacity-50 animate-pulse group-hover:opacity-80 transition-opacity"></div>
          <div className="relative w-full h-full bg-gradient-to-br from-brand-purple via-brand-magenta to-brand-purple text-white rounded-full shadow-2xl shadow-brand-purple/60 flex items-center justify-center border border-white/30 overflow-hidden">
            {/* Shine on Button */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            <Sparkles size={32} className="animate-pulse-slow relative z-10" />
          </div>
        </button>
      </div>

      {/* Modals */}
      <AIAssistant 
        isOpen={showAI} 
        onClose={() => setShowAI(false)} 
        onAddHomework={(hw) => handleAddHomework(hw)}
        onAddExam={handleAddExam}
      />
      
      <SettingsModal 
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        user={user}
      />
      
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.2); }
          66% { transform: translate(-20px, 20px) scale(0.8); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 15s infinite alternate cubic-bezier(0.4, 0, 0.2, 1);
        }
        .animation-delay-2000 {
          animation-delay: 5s;
        }
        .animation-delay-4000 {
          animation-delay: 10s;
        }
      `}</style>
    </div>
  );
};

export default App;
