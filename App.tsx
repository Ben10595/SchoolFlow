import React, { useEffect, useState } from 'react';
import { ViewState, Homework, Exam, StudySession, Theme } from './types';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { HomeworkView } from './components/HomeworkView';
import { ExamView } from './components/ExamView';
import { StudyView } from './components/StudyView';
import { AuthModal } from './components/AuthModal';
import { SettingsModal } from './components/SettingsModal';
import { LandingPage } from './components/LandingPage';
import { Loader2 } from 'lucide-react';
import { auth, db } from './firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('dashboard');
  const [showAuth, setShowAuth] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Data State
  const [homework, setHomework] = useState<Homework[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  
  // Theme State
  const [theme, setTheme] = useState<Theme>('dark');

  // Handle Theme Changes
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark', 'theme-pink');
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'pink') {
      // For Pink theme, we use light mode structure but custom classes might be applied via parents
      // We can rely on Tailwind's default (Light) + specific bg colors in App
    }
    // Light is default (no class)
  }, [theme]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

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
        setDoc(docRef, { homework: [], exams: [], sessions: [] }, { merge: true });
      }
    });

    return () => unsubscribe();
  }, [user]);

  const saveData = (type: 'homework' | 'exams' | 'sessions', data: any) => {
    if (type === 'homework') setHomework(data);
    if (type === 'exams') setExams(data);
    if (type === 'sessions') setSessions(data);
    if (user) {
      const docRef = doc(db, "users", user.uid);
      setDoc(docRef, { [type]: data }, { merge: true });
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0f0f17] flex items-center justify-center text-blue-500">
         <Loader2 size={40} className="animate-spin" />
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

  const handleSetHomework = (newVal: Homework[]) => saveData('homework', newVal);
  const handleSetExams = (newVal: Exam[]) => saveData('exams', newVal);
  const handleSetSessions = (newVal: StudySession[]) => saveData('sessions', newVal);

  const renderView = () => {
    switch (view) {
      case 'dashboard': return <Dashboard homework={homework} exams={exams} studySessions={sessions} setView={setView} user={user} />;
      case 'homework': return <HomeworkView homework={homework} setHomework={handleSetHomework} />;
      case 'exams': return <ExamView exams={exams} setExams={handleSetExams} />;
      case 'study': return <StudyView sessions={sessions} setSessions={handleSetSessions} />;
      default: return <Dashboard homework={homework} exams={exams} studySessions={sessions} setView={setView} user={user} />;
    }
  };

  // Background Logic based on Theme
  const getBackgroundClass = () => {
    switch (theme) {
      case 'light': return 'bg-slate-50 text-slate-900';
      case 'pink': return 'bg-[#fff0f5] text-slate-900'; // Lavender Blush / Pinkish
      case 'dark': 
      default: return 'bg-gradient-to-br from-[#0f0f17] to-[#1a1a24] text-white';
    }
  };

  return (
    <div className={`min-h-screen w-full flex transition-colors duration-500 ${getBackgroundClass()}`}>
      <Navbar 
        currentView={view} 
        setView={setView} 
        user={user} 
        onOpenSettings={() => setShowSettings(true)} 
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative z-10 min-w-0 md:pl-[260px]">
        <main className="flex-1 px-8 pb-8 md:pt-8 max-w-[1600px] mx-auto w-full">
            {renderView()}
        </main>
      </div>

      <SettingsModal 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
        user={user} 
        currentTheme={theme}
        setTheme={setTheme}
      />
    </div>
  );
};

export default App;