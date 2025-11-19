
import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from '../firebase';
import { GlassCard } from './UI/GlassCard';
import { X, Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, {
          displayName: name || 'Schüler'
        });
      }
      onClose();
    } catch (err: any) {
      console.error(err);
      let msg = 'Ein Fehler ist aufgetreten.';
      if (err.code === 'auth/invalid-email') msg = 'Ungültige E-Mail-Adresse.';
      if (err.code === 'auth/user-not-found') msg = 'Kein Nutzer gefunden.';
      if (err.code === 'auth/wrong-password') msg = 'Falsches Passwort.';
      if (err.code === 'auth/email-already-in-use') msg = 'E-Mail wird bereits verwendet.';
      if (err.code === 'auth/weak-password') msg = 'Passwort muss mind. 6 Zeichen haben.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[#050b14]/60 backdrop-blur-sm animate-fade-in p-4">
      <GlassCard className="w-full max-w-md p-8 relative overflow-visible" noHover>
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight mb-2">
            {isLogin ? 'Willkommen zurück' : 'Account erstellen'}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            {isLogin 
              ? 'Logge dich ein, um deine Daten zu synchronisieren.' 
              : 'Registriere dich, um deine Planung überall dabei zu haben.'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="group">
              <div className="relative">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-purple transition-colors" />
                <input 
                  type="text" 
                  placeholder="Dein Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-11 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-brand-purple/50 text-slate-800 dark:text-white transition-all placeholder:text-slate-400/70"
                  required
                />
              </div>
            </div>
          )}
          
          <div className="group">
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-purple transition-colors" />
              <input 
                type="email" 
                placeholder="E-Mail Adresse"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-brand-purple/50 text-slate-800 dark:text-white transition-all placeholder:text-slate-400/70"
                required
              />
            </div>
          </div>

          <div className="group">
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-purple transition-colors" />
              <input 
                type="password" 
                placeholder="Passwort"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-brand-purple/50 text-slate-800 dark:text-white transition-all placeholder:text-slate-400/70"
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 mt-4 bg-brand-purple hover:bg-brand-purple/90 text-white font-bold rounded-2xl shadow-lg shadow-brand-purple/25 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : (
              <>
                {isLogin ? 'Einloggen' : 'Registrieren'}
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-brand-purple dark:hover:text-white transition-colors"
          >
            {isLogin ? 'Noch kein Konto? Jetzt registrieren' : 'Bereits registriert? Einloggen'}
          </button>
        </div>
      </GlassCard>
    </div>
  );
};
