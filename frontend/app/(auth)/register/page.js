'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link'; // Importation du composant de navigation de Next.js

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState('patient');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    lat: '',
    lng: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const isValidCameroonPhone = (phone) => {
    const digits = phone.replace(/\D/g, '');
    return /^(?:237)?[2367]\d{8}$/.test(digits);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    if (!isValidCameroonPhone(formData.phone)) {
      setError('Le numéro de téléphone doit être un numéro camerounais valide (9 chiffres ou +237...).');
      return;
    }

    const bodyData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      role: role,
    };

    if (role === 'pharmacie') {
      bodyData.address = formData.address;
      bodyData.coordinates = [parseFloat(formData.lng), parseFloat(formData.lat)];
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erreur lors de l'inscription");

      localStorage.setItem('token', data.token);
      localStorage.setItem('userRole', data.role);
      localStorage.setItem('userName', data.name);

      setSuccess(true);

      if (data.role === 'patient') {
        router.push('/patient/accueil');
      } else if (data.role === 'pharmacie') {
        if (data.status === 'pending') {
          router.push('/pharmacie/attente');
        } else {
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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-800 p-6">
      <form onSubmit={handleRegister} className="bg-white p-8 rounded-xl border border-slate-200 w-full max-w-lg shadow-xl">
        <h2 className="text-2xl font-bold mb-2 text-center text-emerald-600">Créer un compte</h2>
        <p className="text-slate-500 text-xs text-center mb-6">Rejoignez la plateforme de gestion des pharmacies</p>

        {error && (
          <p className="bg-rose-50 border border-rose-200 text-rose-600 p-3 rounded-lg text-sm mb-4 text-center font-medium">
            {error}
          </p>
        )}
        {success && (
          <p className="bg-emerald-50 border border-emerald-200 text-emerald-600 p-3 rounded-lg text-sm mb-4 text-center font-medium">
            Inscription réussie ! Redirection...
          </p>
        )}

        {/* SÉLECTEUR DE RÔLE */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-lg mb-6 border border-slate-200/60">
          <button
            type="button"
            className={`py-2 text-sm font-medium rounded-md transition-all ${
              role === 'patient' 
                ? 'bg-emerald-600 text-white shadow' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
            onClick={() => setRole('patient')}
          >
            Je suis un Patient
          </button>
          <button
            type="button"
            className={`py-2 text-sm font-medium rounded-md transition-all ${
              role === 'pharmacie' 
                ? 'bg-emerald-600 text-white shadow' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
            onClick={() => setRole('pharmacie')}
          >
            Je suis une Pharmacie
          </button>
        </div>

        {/* CHAMPS */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              placeholder={role === 'patient' ? "Nom complet" : "Nom de la pharmacie"}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Numéro camerounais (ex: 677123456 ou +237677123456)"
              pattern="^(?:\+237|237)?[2367][0-9]{8}$"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <input
            type="email"
            name="email"
            placeholder="Adresse email"
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
            value={formData.email}
            onChange={handleChange}
            required
          />

          {/* MOT DE PASSE + ŒIL */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Mot de passe"
              className="w-full p-3 pr-10 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-emerald-600 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </button>
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirmer le mot de passe"
              className="w-full p-3 pr-10 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-emerald-600 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </button>
          </div>

          {role === 'pharmacie' && (
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Informations Locales</p>
              <input
                type="text"
                name="address"
                placeholder="Adresse physique (Ex: Rue de la Joie, Douala)"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
                value={formData.address}
                onChange={handleChange}
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  step="any"
                  name="lat"
                  placeholder="Latitude"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
                  value={formData.lat}
                  onChange={handleChange}
                  required
                />
                <input
                  type="number"
                  step="any"
                  name="lng"
                  placeholder="Longitude"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
                  value={formData.lng}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          )}
        </div>

        <button 
          type="submit" 
          className="w-full mt-6 bg-emerald-600 text-white p-3 rounded-lg font-semibold hover:bg-emerald-500 transition-colors text-sm shadow-md shadow-emerald-600/10"
        >
          S'inscrire
        </button>

        {/* --- LIEN DE REDIRECTION --- */}
        <p className="text-center text-sm text-slate-500 mt-6 pt-4 border-t border-slate-100">
          Vous avez déjà un compte ?{' '}
          <Link href="/login" className="text-emerald-600 hover:text-emerald-500 font-medium hover:underline transition-colors">
            Se connecter
          </Link>
        </p>
      </form>
    </div>
  );
}