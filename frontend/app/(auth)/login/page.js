'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

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
      const res = await fetch('http://localhost:5000/api/auth/login', {
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
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-slate-400 hover:text-emerald-600 transition-colors"
            >
              {showPassword ? "👁️" : "🙈"}
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