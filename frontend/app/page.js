'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [searching, setSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState('');

  const handleSearch = async (event) => {
    event.preventDefault();
    setError('');
    setStatus('');
    setSearching(true);
    setHasSearched(true);

    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      setError('Veuillez saisir le nom d’un médicament.');
      setResults([]);
      setSearching(false);
      return;
    }

    try {
      const params = new URLSearchParams({ produit: trimmedQuery });
      if (userLocation) {
        params.set('lat', String(userLocation.lat));
        params.set('lng', String(userLocation.lng));
      }

      const response = await fetch(`/api/recherche?${params.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Impossible de récupérer les résultats.');
      }

      const pharmacyResults = Array.isArray(data) ? data : data.data || [];
      if (!pharmacyResults.length) {
        setStatus('Aucun résultat trouvé. Essayez un autre médicament.');
      }
      setResults(pharmacyResults);
    } catch (fetchError) {
      setError(fetchError.message || 'Une erreur est survenue lors de la recherche.');
      setResults([]);
    } finally {
      setSearching(false);
    }
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError("La géolocalisation n'est pas prise en charge par votre navigateur.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (geoError) => {
        setLocationError("Autorisez la géolocalisation pour des résultats proches de chez vous.");
        setUserLocation({ lat: 4.0511, lng: 9.7679 });
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 }
    );
  }, []);

  const loginRedirect = () => {
    window.location.href = '/login';
  };

  const openAuthModal = () => setShowAuthModal(true);
  const closeAuthModal = () => setShowAuthModal(false);
  const goToLogin = () => { window.location.href = '/login'; };
  const goToRegister = () => { window.location.href = '/register'; };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-emerald-600 text-lg font-black text-white shadow-lg shadow-emerald-600/20">K</div>
            <div>
              <p className="text-xl font-semibold tracking-tight text-slate-900">KamerPharm</p>
              <p className="text-sm text-slate-500">Votre pharmacie de confiance en ligne</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="rounded-full border border-emerald-600 px-5 py-2.5 text-sm font-semibold text-emerald-600 transition hover:bg-emerald-50">
              Se connecter
            </Link>
            <Link href="/register" className="rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-600/20 transition hover:bg-emerald-500">
              Inscription
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-12">
        <section className="grid gap-10 rounded-[2rem] bg-white p-8 shadow-xl shadow-slate-200/40 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <p className="text-sm uppercase tracking-[0.32em] text-emerald-700">Bienvenue sur KamerPharm</p>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              Trouvez votre médicament en quelques secondes,
              <span className="text-emerald-600"> puis connectez-vous pour réserver.</span>
            </h1>
            <p className="max-w-2xl text-base leading-8 text-slate-600">
              KamerPharm met en relation patients et pharmacies partenaires avec un moteur de recherche rapide, une expérience soignée et une interface professionnelle. Découvrez les stocks proches de chez vous et accédez aux fonctionnalités avancées après connexion.
            </p>

            <form onSubmit={handleSearch} className="grid gap-3 sm:grid-cols-[1fr_auto]">
              <label htmlFor="search" className="sr-only">Rechercher un médicament</label>
              <input
                id="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Rechercher un médicament..."
                className="min-w-0 rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-900 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-3xl bg-emerald-600 px-6 py-4 text-sm font-semibold text-white shadow-md shadow-emerald-600/20 transition hover:bg-emerald-500"
              >
                Rechercher
              </button>
            </form>
            {/* Aperçu de la recherche (affiché directement sous le formulaire) */}
            {hasSearched && (
              <div className="mt-4">
                {searching && <p className="text-sm text-slate-500">Recherche en cours...</p>}
                {!searching && !results.length && !error && (
                  <p className="text-sm text-slate-500">Aucun résultat pour l'instant.</p>
                )}

                {!searching && results.length > 0 && (
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {results.slice(0, 4).map((item, index) => {
                      const name = item.name || item.description || item.produit || 'Médicament trouvé';
                      const pharmacy = item.pharmacy || item.pharmacie || item.name || 'Pharmacie partenaire';
                      const price = item.price ? `${item.price} CFA` : item.prix ? `${item.prix} CFA` : 'Prix indisponible';

                      return (
                        <div key={`preview-${index}`} className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold text-slate-900 text-sm">{name}</p>
                              <p className="text-xs text-slate-500">{pharmacy}</p>
                            </div>
                            <span className="text-xs font-semibold text-emerald-700">{price}</span>
                          </div>
                          <div className="mt-3 flex gap-2">
                            <button
                              type="button"
                              onClick={openAuthModal}
                              className="rounded-full border border-emerald-600 px-3 py-1 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-50"
                            >
                              Voir l’itinéraire
                            </button>
                            <button
                              type="button"
                              onClick={openAuthModal}
                              className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white transition hover:bg-emerald-500"
                            >
                              Réserver
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
            <p className="text-sm text-slate-500">
              Explorez les pharmacies qui ont votre médicament. Pour voir l’itinéraire ou réserver, il vous sera demandé de vous connecter ou de vous inscrire.
            </p>
          </div>

          <div className="space-y-4 rounded-[2rem] bg-emerald-50 p-6">
            <div className="rounded-3xl bg-white p-6 shadow-sm shadow-slate-200/20">
              <p className="text-xs uppercase tracking-[0.32em] text-emerald-700">Pourquoi KamerPharm</p>
              <h2 className="mt-4 text-2xl font-semibold text-slate-900">Un service fiable pour vos besoins de santé.</h2>
              <ul className="mt-6 space-y-4 text-sm text-slate-600">
                <li className="flex gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-600" />
                  Pharmacies disponibles et affichage clair des stocks.
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-600" />
                  Interface épurée pour une navigation rapide et professionnelle.
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-600" />
                  Inscription facile pour accéder aux itinéraires et réservations.
                </li>
              </ul>
            </div>
            <div className="rounded-3xl bg-white p-6 shadow-sm shadow-slate-200/20">
              <p className="text-xs uppercase tracking-[0.32em] text-emerald-700">Vous êtes une pharmacie ?</p>
              <h3 className="mt-3 text-lg font-semibold text-slate-900">Rejoignez KamerPharm.</h3>
              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                <li className="flex gap-3"><span className="mt-1 h-3 w-3 rounded-full bg-emerald-600" />Plus de visibilité</li>
                <li className="flex gap-3"><span className="mt-1 h-3 w-3 rounded-full bg-emerald-600" />Gestion du stock</li>
                <li className="flex gap-3"><span className="mt-1 h-3 w-3 rounded-full bg-emerald-600" />Réduction des ruptures</li>
                <li className="flex gap-3"><span className="mt-1 h-3 w-3 rounded-full bg-emerald-600" />Réservations en ligne</li>
              </ul>
              <div className="mt-5">
                <Link href="/register" className="inline-flex items-center justify-center rounded-3xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-600/20 transition hover:bg-emerald-500">
                  Devenir partenaire
                </Link>
              </div>
            </div>
            <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm shadow-slate-200/20">
              <p className="text-xs uppercase tracking-[0.32em] text-emerald-700">Nos engagements</p>
              <div className="mt-5 space-y-4 text-sm text-slate-600">
                <div className="rounded-2xl bg-emerald-50 p-4">
                  <p className="font-semibold text-slate-900">Sécurité et qualité</p>
                  <p className="mt-2 text-slate-600">Toutes les données sont gérées en toute confidentialité.</p>
                </div>
                <div className="rounded-2xl bg-emerald-50 p-4">
                  <p className="font-semibold text-slate-900">Assistance disponible</p>
                  <p className="mt-2 text-slate-600">Une aide simple pour suivre vos démarches santé.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl bg-white p-6 shadow-xl shadow-slate-200/20">
            <p className="text-sm uppercase tracking-[0.32em] text-emerald-700">Recherche rapide</p>
            <h3 className="mt-4 text-xl font-semibold text-slate-900">Trouvez un médicament en quelques secondes</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">Notre outil vous aide à localiser rapidement les pharmacies qui disposent du produit recherché.</p>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-xl shadow-slate-200/20">
            <p className="text-sm uppercase tracking-[0.32em] text-emerald-700">Interface médicalisée</p>
            <h3 className="mt-4 text-xl font-semibold text-slate-900">Design simple, impact maximum</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">Une palette verte et blanche pensée pour une expérience sereine et professionnelle.</p>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-xl shadow-slate-200/20">
            <p className="text-sm uppercase tracking-[0.32em] text-emerald-700">Connexion expliquée</p>
            <h3 className="mt-4 text-xl font-semibold text-slate-900">Réservations réservées aux membres</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">Rejoignez KamerPharm pour accéder à l’itinéraire et réserver en pharmacie.</p>
          </div>
        </section>

        <section className="mt-10 rounded-[2rem] bg-white p-8 shadow-xl shadow-slate-200/40">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.32em] text-emerald-700">Aperçu de la recherche</p>
              <h2 className="mt-3 text-2xl font-semibold text-slate-900">Résultats accessibles avant connexion</h2>
            </div>
            <div className="rounded-3xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              Itinéraire et réservation après connexion
            </div>
          </div>

          <div className="mt-8">
            {hasSearched ? (
              <div className="space-y-4">
                {searching && <p className="text-sm text-slate-500">Recherche en cours...</p>}
                {error && <p className="text-sm text-rose-600">{error}</p>}
                {status && !error && <p className="text-sm text-slate-500">{status}</p>}

                {!searching && !error && !results.length && (
                  <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">
                    Saisissez un médicament puis cliquez sur Rechercher pour découvrir des pharmacies partenaires.
                  </div>
                )}

                {!searching && results.length > 0 && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {results.slice(0, 4).map((item, index) => {
                      const name = item.name || item.description || item.produit || 'Médicament trouvé';
                      const pharmacy = item.pharmacy || item.pharmacie || item.name || 'Pharmacie partenaire';
                      const address = item.address || item.location?.address || 'Adresse non renseignée';
                      const price = item.price ? `${item.price} CFA` : item.prix ? `${item.prix} CFA` : 'Prix indisponible';

                      return (
                        <div key={`${name}-${index}`} className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
                          <div className="flex items-center justify-between gap-4">
                            <div>
                              <p className="font-semibold text-slate-900">{name}</p>
                              <p className="mt-2 text-sm text-slate-500">{pharmacy}</p>
                            </div>
                            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100">{price}</span>
                          </div>
                          <p className="mt-4 text-sm text-slate-600">{address}</p>
                          <div className="mt-6 flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={openAuthModal}
                              className="rounded-full border border-emerald-600 px-4 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-50"
                            >
                              Voir l’itinéraire
                            </button>
                            <button
                              type="button"
                              onClick={openAuthModal}
                              className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-500"
                            >
                              Réserver
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">
                Recherchez un médicament pour voir les pharmacies qui le proposent. Vous pouvez continuer après connexion.
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Modal de connexion requis */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={closeAuthModal} />
          <div className="relative mx-4 max-w-md rounded-2xl bg-white p-6 shadow-lg">
            <button onClick={closeAuthModal} className="absolute right-3 top-3 text-slate-400">✕</button>
            <h3 className="text-lg font-semibold text-slate-900">Connexion requise</h3>
            <p className="mt-3 text-sm text-slate-600">Pour réserver un médicament ou consulter l'itinéraire, vous devez être connecté.</p>
            <div className="mt-6 flex gap-3">
              <button onClick={goToLogin} className="rounded-full border border-emerald-600 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50">Connexion</button>
              <button onClick={goToRegister} className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500">Inscription</button>
            </div>
          </div>
        </div>
      )}

      <footer className="border-t border-slate-200 bg-slate-950 text-slate-300">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-white">KamerPharm</p>
            <p className="mt-2 max-w-xl text-sm text-slate-400">Accédez à des pharmacies fiables, comparez les disponibilités et passez à l’étape suivante en toute confiance.</p>
          </div>
          <div className="space-y-2 text-sm text-slate-500 sm:text-right">
            <p>© 2026 KamerPharm</p>
            <p>Service médical & logistique</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
