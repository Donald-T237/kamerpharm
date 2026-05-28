'use client';
import { useState } from 'react';

// Données de simulation pour KAMERPHARM avec l'état de l'ordonnance
const MOCK_RESERVATIONS = [
  { id: 'RES-9081', patient: 'Teffo Donald', phone: '+237 677 88 99 00', medName: 'Amoxicilline 1g', qty: 2, total: 6400, status: 'En attente', date: '23 Mai 2026', time: '10:45' },
  { id: 'RES-8812', patient: 'Nguepi Vanessa', phone: '+237 695 53 92 13', medName: 'Paracétamol Efferalgan 500mg', qty: 1, total: 1500, status: 'Confirmé', date: '22 Mai 2026', time: '16:30' },
  { id: 'RES-8750', patient: 'Francis Nanfack.', phone: '+237 670 28 83 72', medName: 'aspirin cardio 500mg', qty: 3, total: 17700, status: 'Refusé', date: '21 Mai 2026', time: '09:15' },
  { id: 'RES-8610', patient: 'Arthur Z.', phone: '+237 681 44 22 11', medName: 'Paracétamol Efferalgan 500mg', qty: 2, total: 3000, status: 'Confirmé', date: '21 Mai 2026', time: '14:20' },
];

const MOCK_STOCK = [
  { id: 1, name: 'Paracétamol Efferalgan 500mg', price: 1500, stock: 120, category: 'Analgésique', requiresPrescription: false },
  { id: 2, name: 'Amoxicilline 1g', price: 3200, stock: 45, category: 'Antibiotique', requiresPrescription: true },
  { id: 3, name: 'Sirop Coquelusedal', price: 2100, stock: 0, category: 'Pédiatrie', font: false },
  { id: 4, name: 'aspirin cardio', price: 5900, stock: 15, category: 'cardiologie', requiresPrescription: true },
  { id: 5, name: 'Vitamines C Laroscorbine', price: 1800, stock: 0, category: 'Complément', requiresPrescription: false },
  { id: 6, name: 'tégrétol 1000mg', price: 4800, stock: 56, category: 'cardiologie', requiresPrescription: true },
];

const MOCK_DATE_STATS = [
  { date: '19 Mai', totalReservations: 2, confirmed: 1, revenue: 3000, barHeight: '40%' },
  { date: '20 Mai', totalReservations: 4, confirmed: 3, revenue: 9500, barHeight: '80%' },
  { date: '21 Mai', totalReservations: 5, confirmed: 4, revenue: 16500, barHeight: '100%' },
  { date: '22 Mai', totalReservations: 3, confirmed: 2, revenue: 4500, barHeight: '60%' },
  { date: '23 Mai (Auj.)', totalReservations: 1, confirmed: 0, revenue: 0, barHeight: '20%' },
];

export default function PharmacieDashboard() {
  const [activeTab, setActiveTab] = useState('Vue d\'ensemble');
  const [reservations, setReservations] = useState(MOCK_RESERVATIONS);
  const [stock, setStock] = useState(MOCK_STOCK);
  
  // Barres de recherche distinctes pour éviter les conflits entre onglets
  const [searchQuery, setSearchQuery] = useState(''); // Pour le stock
  const [reservationQuery, setReservationQuery] = useState(''); // NOUVEAU : Pour les réservations

  // États pour la gestion des fenêtres contextuelles (Modals)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Formulaire Nouvel Article
  const [newProduct, setNewProduct] = useState({ name: '', category: '', price: '', stock: '', requiresPrescription: false });

  // État pour les informations de l'onglet Paramètres
  const [pharmacyInfo, setPharmacyInfo] = useState({
    name: 'Pharmacie du Centre',
    phone: '+237 670 00 00 00',
    email: 'contact@pharmacieducentre.cm',
    address: 'Avenue Charles de Gaulle, Douala',
    manager: 'Dr. Camerounais',
    openingHours: '24h/24, 7j/7',
    acceptsMomo: true,
    acceptsOm: true,
  });

  // Gestion des actions sur les réservations
  const handleAcceptReservation = (id) => {
    setReservations(reservations.map(res => res.id === id ? { ...res, status: 'Confirmé' } : res));
  };

  const handleRefuseReservation = (id) => {
    setReservations(reservations.map(res => res.id === id ? { ...res, status: 'Refusé' } : res));
  };

  const handlePickupReservation = (id) => {
    setReservations(reservations.map(res => res.id === id ? { ...res, status: 'Récupéré' } : res));
  };

  // Soumission de l'ajout de produit
  const handleAddProductSubmit = (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) return;

    const addedItem = {
      id: stock.length + 1,
      name: newProduct.name,
      category: newProduct.category || 'Général',
      price: parseInt(newProduct.price),
      stock: parseInt(newProduct.stock) || 0,
      requiresPrescription: newProduct.requiresPrescription 
    };

    setStock([...stock, addedItem]);
    setNewProduct({ name: '', category: '', price: '', stock: '', requiresPrescription: false }); 
    setIsAddModalOpen(false);
  };

  // Modification directe des quantités dans la modal d'édition
  const handleStockQuantityChange = (id, newQty) => {
    const qty = parseInt(newQty) || 0;
    setStock(stock.map(item => item.id === id ? { ...item, stock: qty } : item));
  };

  // FILTRES DYNAMIQUES
  const filteredStock = stock.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // NOUVEAU : Filtrage des réservations par Nom du patient OU par Date
  const filteredReservations = reservations.filter(res =>
    res.patient.toLowerCase().includes(reservationQuery.toLowerCase()) ||
    res.date.toLowerCase().includes(reservationQuery.toLowerCase())
  );

  const menuItems = [
    { label: 'Vue d\'ensemble', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg> },
    { label: 'Réservations reçues', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.03 0 1.9.693 2.166 1.638m-7.377 2.24a4.5 4.5 0 112.83 0M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
    { label: 'Gestion des Stocks', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4.5M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg> },
    { label: 'paramètres', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.797.939.396.168.765.414 1.094.729.317.306.75.385 1.156.212l.814-.344c.504-.212 1.097-.015 1.375.467l.547.947c.277.481.159 1.102-.276 1.446l-.705.557c-.346.274-.488.717-.384 1.148.03.128.047.26.047.395v.002c0 .135-.017.268-.047.395-.104.43.038.874.384 1.149l.705.556c.435.344.553.965.276 1.447l-.547.946c-.278.482-.871.68-1.375.468l-.814-.345c-.407-.172-.84-.093-1.156.213-.33.315-.698.562-1.094.73-.413.175-.726.515-.797.94l-.149.893c-.09.543-.56.94-1.11.94h-1.094c-.55 0-1.02-.397-1.11-.94l-.149-.894c-.07-.424-.384-.764-.797-.939a7.111 7.111 0 01-1.094-.73c-.317-.305-.75-.384-1.156-.211l-.814.344c-.504.213-1.097.015-1.375-.467l-.547-.947a1.125 1.125 0 01.276-1.446l.705-.557c.346-.274.488-.718.384-1.148a4.108 4.108 0 01-.047-.396v-.002c0-.135.017-.268.047-.395.104-.43-.038-.874-.384-1.149l-.705-.556a1.125 1.125 0 01-.276-1.447l.547-.946c.278-.482.871-.68 1.375-.468l.814.345c.406.172.84.093 1.156-.213.33-.315.699-.562 1.094-.73.413-.175.726-.515.797-.94l.149-.893z" /><circle cx="12" cy="12" r="3" /></svg> }
  ];

  return (
    <div className="flex min-h-screen bg-[#f8fafc] text-slate-800 font-sans tracking-tight relative">
      
      {/* SIDEBAR */}
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
            🚪 Déconnexion pro
          </button>
        </div>
      </aside>

      {/* CONTENU PRINCIPAL */}
      <main className="flex-1 ml-64 p-8 lg:p-10">
        
        {/* TOP BAR */}
        <header className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-slate-200/40 px-3 py-1.5 rounded-full">
            <span>Kamerpharm</span> <span className="text-slate-300">/</span> <span className="text-slate-600">{activeTab}</span>
          </div>
          <div className="flex items-center gap-3 bg-white p-1.5 pr-4 rounded-full border border-slate-100 shadow-sm">
            <div className="w-8 h-8 bg-emerald-700 rounded-full flex items-center justify-center text-white font-bold text-xs">PC</div>
            <p className="text-xs font-bold text-slate-800">{pharmacyInfo.name}</p>
          </div>
        </header>

        {/* ONGLET 1 : VUE D'ENSEMBLE */}
        {activeTab === 'Vue d\'ensemble' && (
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Réservations en attente</p>
                <p className="text-2xl font-black text-slate-800 mt-2">{reservations.filter(r => r.status === 'En attente').length}</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-start">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Produits Actifs</p>
                  <p className="text-2xl font-black text-slate-800 mt-2">{stock.length}</p>
                </div>
                <div className="bg-rose-50 text-rose-700 rounded-xl px-2.5 py-1.5 text-right">
                  <p className="text-[9px] font-bold uppercase tracking-wider leading-none">Ruptures</p>
                  <p className="text-sm font-black mt-0.5 leading-none">{stock.filter(s => s.stock === 0).length}</p>
                </div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                <p className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider">Revenus Confirmés (CFA)</p>
                <p className="text-2xl font-black text-emerald-600 mt-2">4 500 CFA</p>
              </div>
            </div>

            {/* GRAPHIQUE */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <div className="mb-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Flux des réservations</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Évolution du nombre total de demandes reçues par jour</p>
              </div>
              <div className="h-44 flex items-end justify-between gap-4 pt-4 px-2 border-b border-slate-100">
                {MOCK_DATE_STATS.map((item, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white font-mono text-[10px] font-bold px-2 py-1 rounded-md mb-2 shadow-sm pointer-events-none">{item.totalReservations} rés.</span>
                    <div style={{ height: item.barHeight }} className="w-full max-w-[36px] bg-slate-100 group-hover:bg-emerald-600 rounded-t-lg transition-all duration-300 ease-out relative">
                      {item.confirmed > 0 && <div className="absolute bottom-0 left-0 right-0 bg-emerald-700/20 group-hover:bg-emerald-950/20 rounded-t-lg" style={{ height: `${(item.confirmed / item.totalReservations) * 100}%` }}></div>}
                    </div>
                    <span className="text-[10px] font-semibold text-slate-400 mt-3 whitespace-nowrap">{item.date}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* TABLEAU HISTORIQUE */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-50"><h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Détails des performances</h3></div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50/70 border-b border-slate-100 text-[10px] uppercase tracking-wider font-bold text-slate-400">
                      <th className="p-4 pl-6">Date de l'activité</th>
                      <th className="p-4 text-center">Demandes reçues</th>
                      <th className="p-4 text-center">Réservations validées</th>
                      <th className="p-4 text-right pr-6">Chiffre d'affaires estimé</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
                    {MOCK_DATE_STATS.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/30 transition-colors">
                        <td className="p-4 pl-6 font-bold text-slate-800">{row.date}</td>
                        <td className="p-4 text-center text-slate-500 font-semibold">{row.totalReservations}</td>
                        <td className="p-4 text-center"><span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold">{row.confirmed} validée(s)</span></td>
                        <td className="p-4 text-right pr-6 font-black text-slate-800">{row.revenue} CFA</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ONGLET 2 : RÉSERVATIONS REÇUES */}
        {activeTab === 'Réservations reçues' && (
          <div className="max-w-4xl mx-auto space-y-4">
            
            {/* AJOUT DE LA BARRE DE RECHERCHE POUR LES RÉSERVATIONS */}
            <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center bg-white border border-slate-100 p-3 rounded-2xl shadow-sm">
              <div className="relative flex-1">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.603 10.603z" /></svg>
                </span>
                <input 
                  type="text" 
                  placeholder="Rechercher par nom de patient ou par date (ex: 23 Mai)..." 
                  value={reservationQuery} 
                  onChange={(e) => setReservationQuery(e.target.value)} 
                  className="w-full bg-[#f8fafc] border border-slate-200/60 rounded-xl pl-10 pr-4 py-2 text-xs font-semibold focus:outline-none focus:bg-white focus:border-slate-300 transition-all" 
                />
              </div>
              {reservationQuery && (
                <button 
                  onClick={() => setReservationQuery('')} 
                  className="text-[11px] text-slate-400 font-bold hover:text-slate-600 px-2 py-1"
                >
                  Effacer
                </button>
              )}
            </div>

            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1 pt-2">
              {reservationQuery ? `Résultats de la recherche (${filteredReservations.length})` : 'Demandes de réservation de médicaments'}
            </h2>
            
            <div className="space-y-3">
              {filteredReservations.length > 0 ? (
                filteredReservations.map((res) => (
                  <div key={res.id} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold text-slate-400">{res.id}</span>
                        <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded ${
                          res.status === 'En attente' ? 'bg-amber-50 text-amber-700' : 
                          res.status === 'Confirmé' ? 'bg-blue-50 text-blue-700' : 
                          res.status === 'Récupéré' ? 'bg-emerald-50 text-emerald-700' : 
                          'bg-rose-50 text-rose-700'
                        }`}>
                          {res.status}
                        </span>
                      </div>
                      <h3 className="font-bold text-sm text-slate-800">{res.medName} <span className="text-slate-400 font-normal">(x{res.qty})</span></h3>
                      <p className="text-xs text-slate-500 font-medium">
                        Patient : <span className="text-slate-800 font-semibold">{res.patient}</span> • <span className="text-emerald-700 font-mono">{res.phone}</span> • <span className="text-slate-400">Le {res.date} à <span className="text-slate-900 font-bold">{res.time}</span></span>
                      </p>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-6">
                      <p className="font-black text-sm text-slate-800">{res.total} CFA</p>
                      
                      {res.status === 'En attente' && (
                        <div className="flex gap-2">
                          <button onClick={() => handleRefuseReservation(res.id)} className="px-3 py-1.5 border border-slate-100 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-all">Refuser</button>
                          <button onClick={() => handleAcceptReservation(res.id)} className="px-3 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-emerald-600 shadow-sm transition-all">Accepter</button>
                        </div>
                      )}

                      {res.status === 'Confirmé' && (
                        <div className="flex gap-2">
                          <button onClick={() => handleRefuseReservation(res.id)} className="px-2.5 py-1.5 text-slate-400 text-xs font-bold hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all">Annuler</button>
                          <button onClick={() => handlePickupReservation(res.id)} className="px-4 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-500 shadow-sm transition-all flex items-center gap-1">
                            <span>📦</span> Validé Récupéré
                          </button>
                        </div>
                      )}

                      {res.status === 'Récupéré' && (
                        <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50/50 px-3 py-1.5 rounded-xl border border-emerald-100/40">
                          ✓ Clôturée avec succès
                        </span>
                      )}

                      {res.status === 'Refusé' && (
                        <span className="text-[11px] font-bold text-rose-400 bg-rose-50/30 px-3 py-1.5 rounded-xl">
                          Annulée / Refusée
                        </span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-10 text-center text-xs text-slate-400 font-medium">
                  🔍 Aucune réservation ne correspond à "{reservationQuery}"
                </div>
              )}
            </div>
          </div>
        )}

        {/* ONGLET 3 : GESTION DES STOCKS */}
        {activeTab === 'Gestion des Stocks' && (
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
              <div className="relative flex-1 max-w-md">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.603 10.603z" /></svg>
                </span>
                <input type="text" placeholder="Rechercher un produit..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs font-medium focus:outline-none" />
              </div>
              <div className="flex gap-2">
                <button onClick={() => setIsEditModalOpen(true)} className="border border-slate-200 bg-white text-slate-700 text-[11px] font-bold px-4 py-2 rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
                  ✏️ Modifier le stock
                </button>
                <button onClick={() => setIsAddModalOpen(true)} className="bg-slate-900 text-white text-[11px] font-bold px-4 py-2 rounded-xl hover:bg-emerald-600 transition-colors shadow-sm">
                  + Ajouter un produit
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-100 text-[10px] uppercase font-bold text-slate-400">
                    <th className="p-4 pl-6">Médicament</th>
                    <th className="p-4">Catégorie</th>
                    <th className="p-4">Prix Unitaire</th>
                    <th className="p-4">Quantité en Stock</th>
                    <th className="p-4 text-center">Ordonnance</th>
                    <th className="p-4 pr-6 text-right">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
                  {filteredStock.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/40">
                      <td className="p-4 pl-6 font-bold text-slate-800">{item.name}</td>
                      <td className="p-4 text-slate-400">{item.category}</td>
                      <td className="p-4 font-semibold">{item.price} CFA</td>
                      <td className="p-4 font-mono font-bold text-slate-900">{item.stock} boîtes</td>
                      <td className="p-4 text-center">
                        {item.requiresPrescription ? (
                          <span className="bg-rose-100 text-rose-700 font-extrabold px-2 py-0.5 rounded text-[9px] uppercase tracking-wide">Obligatoire 📄</span>
                        ) : (
                          <span className="text-slate-300 font-bold text-[10px]">-</span>
                        )}
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <span className={`inline-block px-2.5 py-0.5 rounded text-[9px] font-bold uppercase ${item.stock === 0 ? 'bg-rose-50 text-rose-700' : item.stock <= 20 ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'}`}>
                          {item.stock === 0 ? 'Rupture' : item.stock <= 20 ? 'Stock Bas' : 'Sécurisé'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ONGLET 4 : CONFIGURATION (PARAMÈTRES) */}
        {activeTab === 'paramètres' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-6">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Paramètres de l'officine</h2>
                <p className="text-xs text-slate-400 mt-0.5">Gérez les données publiques de votre pharmacie et vos préférences de paiement.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
                <div>
                  <label className="text-slate-400 block mb-1">Nom de la pharmacie</label>
                  <input type="text" value={pharmacyInfo.name} onChange={(e) => setPharmacyInfo({...pharmacyInfo, name: e.target.value})} className="w-full bg-[#f8fafc] border border-slate-100 rounded-xl p-2.5 font-medium outline-none focus:bg-white focus:border-emerald-500 transition-all" />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Pharmacien titulaire (Manager)</label>
                  <input type="text" value={pharmacyInfo.manager} onChange={(e) => setPharmacyInfo({...pharmacyInfo, manager: e.target.value})} className="w-full bg-[#f8fafc] border border-slate-100 rounded-xl p-2.5 font-medium outline-none focus:bg-white focus:border-emerald-500 transition-all" />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Téléphone de contact</label>
                  <input type="text" value={pharmacyInfo.phone} onChange={(e) => setPharmacyInfo({...pharmacyInfo, phone: e.target.value})} className="w-full bg-[#f8fafc] border border-slate-100 rounded-xl p-2.5 font-mono font-medium outline-none focus:bg-white focus:border-emerald-500 transition-all" />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Adresse email</label>
                  <input type="email" value={pharmacyInfo.email} onChange={(e) => setPharmacyInfo({...pharmacyInfo, email: e.target.value})} className="w-full bg-[#f8fafc] border border-slate-100 rounded-xl p-2.5 font-medium outline-none focus:bg-white focus:border-emerald-500 transition-all" />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-slate-400 block mb-1">Adresse physique</label>
                  <input type="text" value={pharmacyInfo.address} onChange={(e) => setPharmacyInfo({...pharmacyInfo, address: e.target.value})} className="w-full bg-[#f8fafc] border border-slate-100 rounded-xl p-2.5 font-medium outline-none focus:bg-white focus:border-emerald-500 transition-all" />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-slate-400 block mb-1">Horaires d'ouverture</label>
                  <input type="text" value={pharmacyInfo.openingHours} onChange={(e) => setPharmacyInfo({...pharmacyInfo, openingHours: e.target.value})} className="w-full bg-[#f8fafc] border border-slate-100 rounded-xl p-2.5 font-medium outline-none focus:bg-white focus:border-emerald-500 transition-all" />
                </div>
              </div>

              <hr className="border-slate-100" />

              <div className="space-y-3">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Intégration des Paiements Mobiles</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">Cochez les modes de paiement que vos clients peuvent utiliser pour régler leurs réservations.</p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 pt-1">
                  <label className="flex-1 flex items-center justify-between p-3 border border-slate-100 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                      <span className="text-xs font-bold text-slate-700">MTN Mobile Money (MoMo)</span>
                    </div>
                    <input type="checkbox" checked={pharmacyInfo.acceptsMomo} onChange={(e) => setPharmacyInfo({...pharmacyInfo, acceptsMomo: e.target.checked})} className="accent-emerald-600 w-4 h-4 cursor-pointer" />
                  </label>

                  <label className="flex-1 flex items-center justify-between p-3 border border-slate-100 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-orange-600"></div>
                      <span className="text-xs font-bold text-slate-700">Orange Money (OM)</span>
                    </div>
                    <input type="checkbox" checked={pharmacyInfo.acceptsOm} onChange={(e) => setPharmacyInfo({...pharmacyInfo, acceptsOm: e.target.checked})} className="accent-emerald-600 w-4 h-4 cursor-pointer" />
                  </label>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button onClick={() => alert('Modifications enregistrées localement !')} className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all shadow-sm">
                  Enregistrer les paramètres
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* 1. FENÊTRE CONTEXTUELLE : FORMULAIRE D'AJOUT PRODUIT */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Ajouter un nouveau médicament</h3>
              <p className="text-xs text-slate-400 mt-0.5">Enregistrez une nouvelle référence au catalogue de l'officine.</p>
            </div>
            
            <form onSubmit={handleAddProductSubmit} className="space-y-3 text-xs font-semibold">
              <div>
                <label className="text-slate-400 block mb-1">Désignation du médicament</label>
                <input required type="text" placeholder="Ex: Paracétamol 500mg" value={newProduct.name} onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} className="w-full border border-slate-200 rounded-xl p-2.5 font-medium outline-none focus:border-emerald-500" />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Catégorie médicale</label>
                <input type="text" placeholder="Ex: Antibiotique, Analgésique..." value={newProduct.category} onChange={(e) => setNewProduct({...newProduct, category: e.target.value})} className="w-full border border-slate-200 rounded-xl p-2.5 font-medium outline-none focus:border-emerald-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Prix de vente (CFA)</label>
                  <input required type="number" placeholder="Prix" value={newProduct.price} onChange={(e) => setNewProduct({...newProduct, price: e.target.value})} className="w-full border border-slate-200 rounded-xl p-2.5 font-medium outline-none focus:border-emerald-500" />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Quantité initiale</label>
                  <input type="number" placeholder="Quantité" value={newProduct.stock} onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})} className="w-full border border-slate-200 rounded-xl p-2.5 font-medium outline-none focus:border-emerald-500" />
                </div>
              </div>

              <div className="pt-1">
                <label className="flex items-center justify-between p-3 border border-slate-100 rounded-xl cursor-pointer bg-slate-50/50 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-2">
                    <span className="text-base">📄</span>
                    <div>
                      <p className="text-xs font-bold text-slate-700">Ordonnance obligatoire</p>
                      <p className="text-[10px] text-slate-400 font-normal">Nécessite une ordonnance par le patient pour retrait du médicament.</p>
                    </div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={newProduct.requiresPrescription} 
                    onChange={(e) => setNewProduct({...newProduct, requiresPrescription: e.target.checked})} 
                    className="accent-rose-600 w-4 h-4 cursor-pointer" 
                  />
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 border border-slate-100 rounded-xl font-bold text-slate-500 hover:bg-slate-50">Annuler</button>
                <button type="submit" className="px-4 py-2 bg-slate-900 text-white rounded-xl font-bold hover:bg-emerald-600 shadow-sm">Valider l'ajout</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. FENÊTRE CONTEXTUELLE : MODIFICATION DES QUANTITÉS */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xl max-w-xl w-full p-6 space-y-4 max-h-[85vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Ajustement rapide des stocks</h3>
              <p className="text-xs text-slate-400 mt-0.5">Modifiez directement les volumes disponibles en officine.</p>
            </div>
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 divide-y divide-slate-50">
              {stock.map((item) => (
                <div key={item.id} className="flex justify-between items-center pt-2 first:pt-0">
                  <div>
                    <p className="text-xs font-bold text-slate-800">{item.name}</p>
                    <p className="text-[10px] text-slate-400">{item.category} • {item.price} CFA</p>
                  </div>
                  <input type="number" value={item.stock} onChange={(e) => handleStockQuantityChange(item.id, e.target.value)} className="w-20 border border-slate-200 rounded-lg p-1.5 text-center text-xs font-mono font-bold focus:border-emerald-500 outline-none" />
                </div>
              ))}
            </div>
            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button onClick={() => setIsEditModalOpen(false)} className="px-5 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl shadow-sm hover:bg-emerald-600 transition-all">Terminer les modifications</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}