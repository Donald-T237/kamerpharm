'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // État pour l'œil
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Une erreur est survenue');

      localStorage.setItem('token', data.token);
      localStorage.setItem('userRole', data.role);

      if (data.role === 'patient') {
        router.push('/patient/accueil');
      } else if (data.role === 'pharmacie') {
        if (data.status === 'pending') {
          router.push('/pharmacie/attente');
        } else if (data.status === 'approved') {
          router.push('/pharmacie/dashboard');
        }
      } else if (data.role === 'admin') {
        router.push('/admin/dashboard');
      }

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-800 p-4">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl border border-slate-200 w-full max-w-md shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-center text-emerald-600">Connexion</h2>
        
        {error && (
          <p className="bg-rose-50 border border-rose-200 text-rose-600 p-3 rounded-lg text-sm mb-4 text-center font-medium">
            {error}
          </p>
        )}
        
        <div className="space-y-4 mb-6">
          <input 
            type="email" 
            placeholder="Votre email" 
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          
          {/* CHAMP MOT DE PASSE AVEC L'ŒIL */}
          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"} // Dynamique selon l'état
              placeholder="Mot de passe" 
              className="w-full p-3 pr-10 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-emerald-600 transition-colors"
              aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19.5c-5.52 0-10-4.48-10-10 0-2.22.77-4.27 2.06-5.92" />
                  <path d="M1 1l22 22" />
                  <path d="M9.88 9.88a3 3 0 0 0 4.24 4.24" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
        </div>
        
        <button 
          type="submit" 
          className="w-full bg-emerald-600 text-white p-3 rounded-lg font-semibold hover:bg-emerald-500 transition-colors text-sm shadow-md shadow-emerald-600/10"
        >
          Se connecter
        </button>
      </form>
    </div>
  );
}