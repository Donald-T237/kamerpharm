'use client';
import { useState, useEffect } from 'react';

// Données enrichies avec la propriété requiresPrescription et des images uniques
const MOCK_MEDICAMENTS = [
  { id: 1, name: 'Paracétamol Efferalgan 500mg', price: 1500, pharmacy: 'Pharmacie du Centre', distance: '0.8 km', available: true, stock: 120, address: 'Rue de la Joie, Douala', hours: 'Ouvert', requiresPrescription: false, image: 'https://images.unsplash.com/photo-1586015555751-63bb77f4322a?w=150&auto=format&fit=crop&q=60' },
  { id: 2, name: 'Amoxicilline 1g', price: 3200, pharmacy: 'Pharmacie de la Poste', distance: '2.4 km', available: true, stock: 45, address: 'Avenue de Gaulle, Douala', hours: 'Ouvert', requiresPrescription: true, image: 'https://images.unsplash.com/photo-1631549916768-4119b295f826?w=150&auto=format&fit=crop&q=60' },
  { id: 3, name: 'Ibuprofène 400mg', price: 1800, pharmacy: 'Pharmacie de la Gare', distance: '4.1 km', available: false, stock: 0, address: 'Quartier Akwa, Douala', hours: 'Fermé', requiresPrescription: false, image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=150&auto=format&fit=crop&q=60' },
  { id: 4, name: 'Augmentin Enfant', price: 4500, pharmacy: 'Pharmacie du Centre', distance: '0.8 km', available: true, stock: 15, address: 'Rue de la Joie, Douala', hours: 'Ouvert', requiresPrescription: true, image: 'https://images.unsplash.com/photo-1576602976047-174e57a47881?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
];

export default function PatientAccueil() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState(MOCK_MEDICAMENTS);
  const [userName, setUserName] = useState('Utilisateur');
  
  // États de navigation et d'interaction
  const [activeTab, setActiveTab] = useState('Tableau de bord');
  const [selectedMed, setSelectedMed] = useState(null); // Pharmacie/Médicament actuellement sélectionné sur la carte
  const [reservationQty, setReservationQty] = useState(1);
  
  // Listes dynamiques pour les tests
  const [reservations, setReservations] = useState([
    { id: 'RES-9081', name: 'Amoxicilline 1g', pharmacy: 'Pharmacie de la Poste', price: 3200, qty: 2, total: 6400, status: 'En cours', date: '23 Mai 2026' }
  ]);
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'Votre réservation RES-9081 est en attente de confirmation par la Pharmacie de la Poste.', time: 'Il y a 5 min', unread: true }
  ]);

  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    if (storedName) setUserName(storedName);
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    const filtered = MOCK_MEDICAMENTS.filter(med => 
      med.name.toLowerCase().includes(query.toLowerCase())
    );
    setResults(filtered);
  };

  const triggerItinerary = (med) => {
    setSelectedMed(med);
    setActiveTab('Carte');
  };

  const triggerReservationSetup = (med) => {
    setSelectedMed(med);
    setReservationQty(1);
    setActiveTab('Réservations');
  };

  const confirmReservation = (e) => {
    e.preventDefault();
    const total = selectedMed.price * reservationQty;
    const newRes = {
      id: `RES-${Math.floor(1000 + Math.random() * 9000)}`,
      name: selectedMed.name,
      pharmacy: selectedMed.pharmacy,
      price: selectedMed.price,
      qty: reservationQty,
      total: total,
      status: 'En cours',
      date: 'Aujourd\'hui'
    };

    setReservations([newRes, ...reservations]);
    setNotifications([
      { id: Date.now(), text: `Nouvelle réservation ${newRes.id} envoyée à la ${newRes.pharmacy}.`, time: 'À l\'instant', unread: true },
      ...notifications
    ]);

    const prescriptionAlert = selectedMed.requiresPrescription 
      ? ` Attention, une ordonnance médicale valide originale vous sera EXIGÉE au comptoir pour ce produit.` 
      : '';

    alert(`Réservation enregistrée ! Médicament disponible en pharmacie, retrait sous 24h après validation.${prescriptionAlert}`);
    setActiveTab('Réservations');
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc] text-slate-800 font-sans tracking-tight">
      
      {/* SIDEBAR GAUCHE */}
      <aside className="w-64 bg-white border-r border-slate-100 flex flex-col fixed h-full z-30">
        <div className="p-6">
          <div className="flex items-center gap-2.5 mb-9 px-2">
            <div className="w-7 h-7 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm">K</div>
            <span className="font-extrabold text-lg text-slate-900">Kamer<span className="text-emerald-600 font-medium">pharm</span></span>
          </div>
          <nav className="space-y-1">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(item.label)}
                className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === item.label ? 'bg-emerald-50 text-emerald-700 shadow-sm' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-700'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="mt-auto p-4 border-t border-slate-50">
          <button onClick={() => { localStorage.clear(); window.location.href = '/login'; }} className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-rose-500 font-bold hover:bg-rose-50 rounded-xl transition-all">
            🚪 Déconnexion
          </button>
        </div>
      </aside>

      {/* CONTENU CENTRAL */}
      <main className="flex-1 ml-64 p-8 lg:p-10">
        
        {/* TOP BAR */}
        <header className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-slate-200/40 px-3 py-1.5 rounded-full">
            <span>Kamerpharm</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-600">{activeTab}</span>
          </div>
          <div className="flex items-center gap-3 bg-white p-1.5 pr-4 rounded-full border border-slate-100 shadow-sm">
            <div className="w-8 h-8 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-700 font-bold text-xs">{userName.charAt(0)}</div>
            <div>
              <p className="text-xs font-bold text-slate-800 leading-tight">{userName}</p>
              <p className="text-[9px] uppercase tracking-wider text-emerald-600 font-extrabold">Espace Patient</p>
            </div>
          </div>
        </header>

        {/* SECTION 1 : VUE TABLEAU DE BORD */}
        {activeTab === 'Tableau de bord' && (
          <div className="max-w-4xl mx-auto">
            <section className="text-center my-12">
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">Trouvez votre médicament <span className="text-emerald-600">immédiatement.</span></h1>
              <p className="text-slate-500 text-xs md:text-sm max-w-lg mx-auto">Saisissez le nom du produit pour localiser la pharmacie partenaire la plus proche.</p>
              
              <div className="relative max-w-xl mx-auto mt-8">
                <span className="absolute inset-y-0 left-4 flex items-center text-slate-400">
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                </span>
                <input type="text" placeholder="Rechercher un médicament..." className="w-full p-3.5 pl-11 bg-white border border-slate-200 rounded-xl outline-none transition-all text-xs font-medium focus:border-emerald-500" value={searchQuery} onChange={handleSearch} />
              </div>
            </section>

            {/* GRILLE DE CARTES */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12">
              {results.map((med) => (
                <div key={med.id} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2 gap-4">
                      <div>
                        <h3 className="font-bold text-slate-800 text-sm md:text-base leading-tight">{med.name}</h3>
                        {med.requiresPrescription && (
                          <span className="inline-block mt-1.5 text-[9px] bg-amber-50 text-amber-700 border border-amber-100 px-2 py-0.5 rounded font-bold uppercase tracking-wide">
                            📋 Sur ordonnance
                          </span>
                        )}
                      </div>
                      <span className="text-emerald-600 font-extrabold text-xs whitespace-nowrap bg-emerald-50 px-2.5 py-1 rounded-lg">{med.price} CFA</span>
                    </div>
                    
                    <div className="flex items-center gap-3 mt-3 bg-slate-50/50 p-2 rounded-xl border border-slate-100">
                      <img src={med.image} alt={med.pharmacy} className="w-12 h-12 rounded-lg object-cover shadow-sm bg-slate-200" />
                      <div>
                        <p className="text-xs font-bold text-slate-700">🏢 {med.pharmacy}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">📍 À {med.distance} de vous</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-5 pt-3.5 border-t border-slate-50">
                    <span className={`px-2.5 py-1 rounded-lg text-[9px] font-extrabold uppercase tracking-wider ${med.available ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>{med.available ? '● En stock' : '○ Rupture'}</span>
                    {med.available && (
                      <button onClick={() => triggerItinerary(med)} className="bg-slate-900 text-white text-[11px] font-bold px-4 py-2 rounded-xl hover:bg-emerald-600 transition-all">Voir l'itinéraire</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 2 : VUE CARTE */}
        {activeTab === 'Carte' && (
          <div className="max-w-5xl mx-auto h-[70vh] relative bg-slate-200 rounded-3xl overflow-hidden shadow-inner border border-slate-100">
            <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] bg-slate-100 flex items-center justify-center">
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest bg-white/90 px-4 py-2 rounded-full border border-slate-200/80 shadow-sm">Réseau des Pharmacies Partenaires • Douala</p>
            </div>

            <div className="absolute inset-0 pointer-events-none">
              <button onClick={() => setSelectedMed(MOCK_MEDICAMENTS[0])} className="absolute top-1/3 left-1/3 pointer-events-auto group transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <div className={`px-2 py-1 rounded-md text-[10px] font-bold shadow-sm border transition-all ${selectedMed?.pharmacy === 'Pharmacie du Centre' ? 'bg-emerald-600 text-white border-emerald-700 scale-105' : 'bg-white text-slate-700 border-slate-200'}`}>Pharmacie du Centre</div>
                <div className={`w-3 h-3 rounded-full border-2 border-white mt-1 shadow-md transition-all ${selectedMed?.pharmacy === 'Pharmacie du Centre' ? 'bg-emerald-600 scale-125' : 'bg-emerald-500'}`}></div>
              </button>

              <button onClick={() => setSelectedMed(MOCK_MEDICAMENTS[1])} className="absolute top-1/2 left-2/3 pointer-events-auto group transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <div className={`px-2 py-1 rounded-md text-[10px] font-bold shadow-sm border transition-all ${selectedMed?.pharmacy === 'Pharmacie de la Poste' ? 'bg-emerald-600 text-white border-emerald-700 scale-105' : 'bg-white text-slate-700 border-slate-200'}`}>Pharmacie de la Poste</div>
                <div className={`w-3 h-3 rounded-full border-2 border-white mt-1 shadow-md transition-all ${selectedMed?.pharmacy === 'Pharmacie de la Poste' ? 'bg-emerald-600 scale-125' : 'bg-emerald-500'}`}></div>
              </button>

              <button onClick={() => setSelectedMed(MOCK_MEDICAMENTS[2])} className="absolute top-2/3 left-1/2 pointer-events-auto group transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <div className={`px-2 py-1 rounded-md text-[10px] font-bold shadow-sm border transition-all ${selectedMed?.pharmacy === 'Pharmacie de la Gare' ? 'bg-emerald-600 text-white border-emerald-700 scale-105' : 'bg-white text-slate-700 border-slate-200'}`}>Pharmacie de la Gare</div>
                <div className={`w-3 h-3 rounded-full border-2 border-white mt-1 shadow-md transition-all ${selectedMed?.pharmacy === 'Pharmacie de la Gare' ? 'bg-emerald-600 scale-125' : 'bg-emerald-500'}`}></div>
              </button>
            </div>

            {selectedMed && (
              <div className="absolute bottom-6 left-6 bg-white p-5 rounded-2xl shadow-xl border border-slate-100 max-w-sm w-80 animate-fadeIn z-10">
                <div className="flex gap-4 items-start">
                  <img src={selectedMed.image} alt={selectedMed.pharmacy} className="w-14 h-14 rounded-xl object-cover border border-slate-100 shadow-sm" />
                  <div className="flex-1">
                    <h3 className="font-bold text-sm text-slate-800">{selectedMed.pharmacy}</h3>
                    <p className="text-[11px] text-slate-400 font-medium mt-0.5">{selectedMed.distance} • <span className="text-emerald-600 font-bold">{selectedMed.hours}</span></p>
                    <p className="text-[11px] text-emerald-600 font-bold mt-1.5 bg-emerald-50/60 inline-block px-2 py-0.5 rounded">En stock • {selectedMed.stock || '0'} boîte(s)</p>
                    {selectedMed.requiresPrescription && (
                      <p className="text-[10px] text-amber-700 font-bold mt-1 bg-amber-50 px-1.5 py-0.5 rounded inline-block uppercase">📋 Ordonnance Obligatoire</p>
                    )}
                    <p className="font-extrabold text-sm text-slate-800 mt-2">{selectedMed.price} FCFA</p>
                  </div>
                </div>
                <button onClick={() => triggerReservationSetup(selectedMed)} className="w-full mt-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-xs transition-colors shadow-md">
                  Réserver
                </button>
              </div>
            )}
          </div>
        )}

        {/* SECTION 3 : VUE RÉSERVATIONS */}
        {activeTab === 'Réservations' && (
          <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-fit">
              <h2 className="text-sm font-bold text-slate-800 mb-4 pb-2 border-b border-slate-50">Nouvelle demande de réservation</h2>
              {selectedMed ? (
                <form onSubmit={confirmReservation} className="space-y-4">
                  <div className="bg-slate-50 p-4 rounded-xl flex gap-4 items-center">
                    <img src={selectedMed.image} alt={selectedMed.pharmacy} className="w-12 h-12 rounded-lg object-cover" />
                    <div className="flex-1">
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Médicament ciblé</p>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-bold text-slate-800 text-sm">{selectedMed.name}</p>
                        {selectedMed.requiresPrescription && (
                          <span className="text-[9px] bg-amber-100 text-amber-800 font-extrabold px-2 py-0.5 rounded uppercase tracking-wide">
                            Sous Ordonnance
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-1">🏢 {selectedMed.pharmacy} — {selectedMed.address}</p>
                    </div>
                  </div>

                  {selectedMed.requiresPrescription && (
                    <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-3 text-xs text-amber-800 font-medium flex items-start gap-2.5">
                      <span className="text-sm mt-0.5">⚠️</span>
                      <p>
                        <span className="font-bold">Justificatif requis :</span> Ce médicament nécessite obligatoirement une ordonnance médicale pour le retrait physique au comptoir de l'officine.
                      </p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-3 rounded-xl">
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Prix unitaire</p>
                      <p className="font-bold text-sm text-slate-800 mt-1">{selectedMed.price} CFA</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl">
                      <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Quantité</label>
                      <input type="number" min="1" max={selectedMed.stock || 1} value={reservationQty} onChange={(e) => setReservationQty(parseInt(e.target.value) || 1)} className="w-full bg-white border border-slate-200 rounded-lg p-1 text-xs font-bold outline-none" />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-50 flex justify-between items-center">
                    <div>
                      <p className="text-xs text-slate-400 font-semibold">Montant total à payer</p>
                      <p className="text-lg font-black text-emerald-600">{selectedMed.price * reservationQty} CFA</p>
                    </div>
                    <button type="submit" className="bg-emerald-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-emerald-500 shadow transition-colors">
                      Confirmer la réservation
                    </button>
                  </div>
                </form>
              ) : (
                <p className="text-xs text-slate-400 py-6 text-center">Aucun produit configuré. Recherchez un médicament pour l'ajouter ici.</p>
              )}
            </div>

            <div className="space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">Mes réservations ({reservations.length})</h2>
              {reservations.map((res) => (
                <div key={res.id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 font-bold">{res.id}</span>
                      <h4 className="font-bold text-xs text-slate-800 leading-tight mt-0.5">{res.name}</h4>
                    </div>
                    <span className="text-[9px] font-bold px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full">{res.status}</span>
                  </div>
                  <p className="text-[11px] text-slate-500">🏢 {res.pharmacy}</p>
                  <div className="flex justify-between items-center text-[11px] pt-2 border-t border-slate-50 font-medium">
                    <span className="text-slate-400">Qté: {res.qty}</span>
                    <span className="font-bold text-slate-800">{res.total} CFA</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 4 : VUE NOTIFICATIONS */}
        {activeTab === 'Notifications' && (
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 px-1">Centre de notifications</h2>
            {notifications.map((notif) => (
              <div key={notif.id} className={`p-4 rounded-xl border transition-all flex gap-3 items-start ${notif.unread ? 'bg-emerald-50/40 border-emerald-100/60 shadow-sm' : 'bg-white border-slate-100'}`}>
                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${notif.unread ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-slate-700 leading-normal">{notif.text}</p>
                  <span className="text-[10px] text-slate-400 mt-1 block">{notif.time}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* SECTION 5 : VUE PARAMÈTRES */}
        {activeTab === 'Paramètres' && (
          <div className="max-w-2xl mx-auto bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
            <div>
              <h2 className="text-sm font-bold text-slate-800">Paramètres du compte</h2>
              <p className="text-xs text-slate-400 mt-0.5">Gérez vos informations de profil patient de Kamerpharm.</p>
            </div>
            <div className="space-y-4 pt-2 border-t border-slate-50 text-xs font-medium">
              <div>
                <label className="text-slate-400 font-bold block mb-1">Nom complet</label>
                <input type="text" disabled value={userName} className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-slate-500" />
              </div>
              <div>
                <label className="text-slate-400 font-bold block mb-1">Rôle utilisateur</label>
                <input type="text" disabled value="Patient Vérifié" className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-slate-500" />
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

// Variables statiques annexes pour la Sidebar
const menuItems = [
  { label: 'Tableau de bord', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg> },
  { label: 'Carte', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503-3.497l4.835-2.417a1.125 1.125 0 00.569-.974V4.914a1.122 1.122 0 00-1.503-1.062l-5.185 1.728a2.25 2.25 0 01-1.411 0L9.412 3.856a2.25 2.25 0 00-1.41 0L2.815 5.584A1.122 1.122 0 001.31 6.646v11.83a1.125 1.125 0 001.623 1.004l4.554-2.277m0 0a2.25 2.25 0 011.41 0l4.368 1.456a2.25 2.25 0 001.41 0l4.291-1.43" /></svg> },
  { label: 'Réservations', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg> },
  { label: 'Notifications', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0M3.124 7.5A8.969 8.969 0 015.292 3m13.416 0a8.969 8.969 0 012.168 4.5" /></svg> },
  { label: 'Paramètres', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.1-.06.2-.12.3-.2l1.22-.46a1.125 1.125 0 011.37.49l1.29 2.25a1.125 1.125 0 01-.26 1.43l-1 .83c.3.3.3.6.3.99s-.1.7-.3.99l1 .83c.42.35.53.95.26 1.43l-1.29 2.25a1.125 1.125 0 01-1.37.49l-1.22-.46c-.1.08-.2.14-.3.2l-.21 1.28c-.09.54-.56.94-1.11.94h-2.59c-.55 0-1.02-.4-1.11-.94l-.21-1.28c-.1-.08-.2-.14-.3-.2l-1.22.46a1.125 1.125 0 01-1.37-.49l-1.29-2.25a1.125 1.125 0 01.26-1.43l1-.83c-.3-.3-.3-.6-.3-.99s.1-.7.3-.99l-1-.83a1.125 1.125 0 01-.26-1.43l1.29-2.25a1.125 1.125 0 011.37-.49l1.22.46c.1-.08.2-.14.3-.2l.21-1.28z" /><circle cx="12" cy="12" r="3" /></svg> }
];