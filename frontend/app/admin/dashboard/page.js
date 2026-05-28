'use client';
import { useState } from 'react';

// Données de simulation globales pour le Super Admin de KAMERPHARM
const MOCK_GLOBAL_STATS = {
  totalPharmacies: 48,
  pendingApprovals: 5,
  totalReservations: 14205,
  globalRevenueCFA: 28410000, // Chiffre d'affaires généré et finalisé au comptoir
};

const MOCK_PHARMACIES = [
  { id: 'PH-001', name: 'Pharmacie du Centre', city: 'Douala', manager: 'Dr. Camerounais', status: 'Active', joinedDate: '12 Janv 2026', totalSales: 1240000 },
  { id: 'PH-002', name: 'Pharmacie de la Poste', city: 'Yaoundé', manager: 'Dr. Etoa', status: 'Active', joinedDate: '03 Fév 2026', totalSales: 890000 },
  { id: 'PH-003', name: 'Pharmacie des Monts', city: 'Bafoussam', manager: 'Dr. Tagne', status: 'En attente', joinedDate: '22 Mai 2026', licenseDoc: 'LIC-2026-BFM.pdf' },
  { id: 'PH-004', name: 'Pharmacie Sawa', city: 'Douala', manager: 'Dr. Pokam', status: 'Active', joinedDate: '20 Fév 2026', totalSales: 2100000 },
  { id: 'PH-005', name: 'Pharmacie de l\'Université', city: 'Dschang', manager: 'Dr. Kenfack', status: 'Suspendue', joinedDate: '15 Nov 2025', totalSales: 450000 },
  { id: 'PH-006', name: 'Pharmacie du Rail', city: 'Ngaoundéré', manager: 'Dr. Issa', status: 'En attente', joinedDate: '23 Mai 2026', licenseDoc: 'LIC-2026-NGA.pdf' },
];

const MOCK_TOP_MEDICAMENTS = [
  { rank: 1, name: 'Amoxicilline 1g', requests: 3420, trend: '+12%' },
  { rank: 2, name: 'Paracétamol Efferalgan 500mg', requests: 2910, trend: '+5%' },
  { rank: 3, name: 'Aspirin Cardio 500mg', requests: 1840, trend: '+22%' },
  { rank: 4, name: 'Tégrétol 1000mg', requests: 950, trend: '-2%' },
];

const MOCK_REGIONAL_DISTRIBUTION = [
  { city: 'Douala', count: 22, percentage: '45%' },
  { city: 'Yaoundé', count: 16, percentage: '33%' },
  { city: 'Bafoussam', count: 5, percentage: '11%' },
  { city: 'Autres villes', count: 5, percentage: '11%' },
];

export default function SuperAdminDashboard() {
  const [activeTab, setActiveTab] = useState('Vue Globale');
  const [pharmacies, setPharmacies] = useState(MOCK_PHARMACIES);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Paramètres système modifiables par le Super Admin (Frais de plateforme retirés)
  const [systemConfig, setSystemConfig] = useState({
    maxReservationHoldHours: 24, // Temps limite avant annulation automatique de la réservation
    smsAlertsEnabled: true,
    maintenanceMode: false,
  });

  // Approbation d'une pharmacie partenaire
  const handleApprovePharmacy = (id) => {
    setPharmacies(pharmacies.map(p => p.id === id ? { ...p, status: 'Active', totalSales: 0 } : p));
  };

  // Suspension ou désactivation d'un compte d'officine
  const handleToggleStatus = (id, currentStatus) => {
    const newStatus = currentStatus === 'Active' ? 'Suspendue' : 'Active';
    setPharmacies(pharmacies.map(p => p.id === id ? { ...p, status: newStatus } : p));
  };

  const filteredPharmacies = pharmacies.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.manager.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const menuItems = [
    { label: 'Vue Globale', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0V18m0 3h7.5m0 0h1.5m-1.5 0v-3m-7.5 0v3m0 0h-1.5" /></svg> },
    { label: 'Réseau Pharmacies', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1M18.75 3v6.205m0-6.205l-3.65 1.328m-1.377-3.06a4.5 4.5 0 11-2.83 0V3.545" /></svg> },
    { label: 'Analyses de Santé', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" /><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" /></svg> },
    { label: 'Contrôle Système', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077l1.41-.513m14.095-5.13l1.41-.513M5.106 17.785l1.15-.827m11.379-8.16l1.15-.827M8.14 21.27l.707-.957m6.305-8.543l.707-.957M12 21.75V21m0-18v-.75" /></svg> }
  ];

  return (
    <div className="flex min-h-screen bg-[#f8fafc] text-slate-800 font-sans tracking-tight relative">
      
      {/* SIDEBAR CENTRALISÉE */}
      <aside className="w-64 bg-white border-r border-slate-100 flex flex-col fixed h-full z-30">
        <div className="p-6">
          <div className="flex items-center gap-2.5 mb-9 px-2">
            <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black text-xs shadow-sm">HQ</div>
            <span className="font-extrabold text-lg text-slate-900">Kamer<span className="text-indigo-600 font-medium">pharm</span> <span className="text-[10px] bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded font-bold uppercase tracking-normal">HQ</span></span>
          </div>
          <nav className="space-y-1">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(item.label)}
                className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === item.label ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-700'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="mt-auto p-4 border-t border-slate-50">
          <div className="bg-slate-50 p-3 rounded-xl text-[11px] text-slate-400 font-medium">
            <p>🔒 Accès Super Admin</p>
            <p className="text-[9px] text-slate-400 font-mono mt-1">v1.0.0 - Production</p>
          </div>
        </div>
      </aside>

      {/* RESTE DE LA PAGE */}
      <main className="flex-1 ml-64 p-8 lg:p-10">
        
        {/* TOP BAR */}
        <header className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-slate-200/40 px-3 py-1.5 rounded-full">
            <span>KAMERPHARM HQ</span> <span className="text-slate-300">/</span> <span className="text-slate-600">{activeTab}</span>
          </div>
          <div className="flex items-center gap-3 bg-white p-1.5 pr-4 rounded-full border border-slate-100 shadow-sm">
            <div className="w-8 h-8 bg-indigo-700 rounded-full flex items-center justify-center text-white font-bold text-xs">SA</div>
            <p className="text-xs font-bold text-slate-800">Direction Générale</p>
          </div>
        </header>

        {/* ONGLET 1 : VUE GLOBALE DU RÉSEAU */}
        {activeTab === 'Vue Globale' && (
          <div className="max-w-5xl mx-auto space-y-8">
            {/* KPI METRICS */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Pharmacies Partenaires</p>
                <p className="text-2xl font-black text-slate-800 mt-2">{MOCK_GLOBAL_STATS.totalPharmacies}</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-start">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Dossiers à Valider</p>
                  <p className="text-2xl font-black text-amber-600 mt-2">{pharmacies.filter(p => p.status === 'En attente').length}</p>
                </div>
                {pharmacies.filter(p => p.status === 'En attente').length > 0 && (
                  <span className="bg-amber-50 text-amber-700 font-bold text-[9px] uppercase px-2 py-1 rounded-lg animate-pulse">Urgent</span>
                )}
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Réservations Globales</p>
                <p className="text-2xl font-black text-slate-800 mt-2">{MOCK_GLOBAL_STATS.totalReservations.toLocaleString()}</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                <p className="text-[10px] uppercase font-bold text-indigo-600 tracking-wider">CA Généré (Retrait Comptoir)</p>
                <p className="text-xl font-black text-indigo-600 mt-2">{MOCK_GLOBAL_STATS.globalRevenueCFA.toLocaleString()} CFA</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* TOP MEDICAMENTS DEMANDÉS AU CAMEROUN */}
              <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div className="mb-4 flex justify-between items-center">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Tendances Nationales de Santé</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">Top des molécules et produits les plus recherchés sur l'application.</p>
                  </div>
                  <span className="text-[10px] font-bold bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-lg text-slate-500">Mise à jour Live</span>
                </div>
                <div className="space-y-3 pt-2">
                  {MOCK_TOP_MEDICAMENTS.map((med) => (
                    <div key={med.rank} className="flex items-center justify-between p-3.5 bg-slate-50/50 rounded-xl border border-slate-100/50">
                      <div className="flex items-center gap-4">
                        <span className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-700 font-bold font-mono text-xs flex items-center justify-center">{med.rank}</span>
                        <p className="text-xs font-bold text-slate-800">{med.name}</p>
                      </div>
                      <div className="flex items-center gap-6 text-right">
                        <div>
                          <p className="text-xs font-black text-slate-800">{med.requests.toLocaleString()}</p>
                          <p className="text-[9px] text-slate-400 font-semibold uppercase">Recherches</p>
                        </div>
                        <span className={`text-[10px] font-bold ${med.trend.startsWith('+') ? 'text-emerald-600' : 'text-slate-400'}`}>{med.trend}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* RÉPARTITION GÉOGRAPHIQUE */}
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Couverture Territoriale</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">Densité du réseau d'officines par pôle urbain.</p>
                </div>
                <div className="space-y-3.5 my-4">
                  {MOCK_REGIONAL_DISTRIBUTION.map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-slate-700">{item.city}</span>
                        <span className="text-slate-400 font-mono">{item.count} ({item.percentage})</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div style={{ width: item.percentage }} className="bg-indigo-600 h-full rounded-full"></div>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-slate-400 text-center font-medium bg-indigo-50/50 py-2 rounded-xl border border-indigo-50">Objectif 2026 : Extension Grand Nord & Ouest en cours</p>
              </div>
            </div>
          </div>
        )}

        {/* ONGLET 2 : RÉSEAU PHARMACIES & MODÉRATION */}
        {activeTab === 'Réseau Pharmacies' && (
          <div className="max-w-5xl mx-auto space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
              <div className="relative flex-1 max-w-md">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.603 10.603z" /></svg>
                </span>
                <input type="text" placeholder="Rechercher une pharmacie (nom, ville, titulaire)..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs font-medium focus:outline-none" />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-100 text-[10px] uppercase font-bold text-slate-400">
                    <th className="p-4 pl-6">ID & Officine</th>
                    <th className="p-4">Ville</th>
                    <th className="p-4">Pharmacien Titulaire</th>
                    <th className="p-4">Date d'intégration</th>
                    <th className="p-4">Chiffre d'Affaires Estimé</th>
                    <th className="p-4 text-center">Statut</th>
                    <th className="p-4 pr-6 text-right">Actions HQ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
                  {filteredPharmacies.map((pharmacy) => (
                    <tr key={pharmacy.id} className="hover:bg-slate-50/40 transition-colors">
                      <td className="p-4 pl-6">
                        <p className="font-bold text-slate-800">{pharmacy.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono font-bold">{pharmacy.id}</p>
                      </td>
                      <td className="p-4 text-slate-600 font-semibold">{pharmacy.city}</td>
                      <td className="p-4 text-slate-500">{pharmacy.manager}</td>
                      <td className="p-4 text-slate-400">{pharmacy.joinedDate}</td>
                      <td className="p-4 font-bold text-slate-900">
                        {pharmacy.status === 'En attente' ? '---' : `${pharmacy.totalSales?.toLocaleString()} CFA`}
                      </td>
                      <td className="p-4 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${pharmacy.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : pharmacy.status === 'En attente' ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'}`}>
                          {pharmacy.status}
                        </span>
                      </td>
                      <td className="p-4 pr-6 text-right">
                        {pharmacy.status === 'En attente' ? (
                          <div className="flex gap-2 justify-end">
                            <button onClick={() => alert(`Téléchargement de la licence : ${pharmacy.licenseDoc}`)} className="p-1 text-slate-400 hover:text-indigo-600" title="Voir la licence d'exploitation">📄</button>
                            <button onClick={() => handleApprovePharmacy(pharmacy.id)} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-2.5 py-1 rounded-lg text-[10px] shadow-sm">Approuver</button>
                          </div>
                        ) : (
                          <button onClick={() => handleToggleStatus(pharmacy.id, pharmacy.status)} className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border ${pharmacy.status === 'Active' ? 'border-rose-100 text-rose-600 hover:bg-rose-50' : 'border-slate-200 text-emerald-600 hover:bg-emerald-50'}`}>
                            {pharmacy.status === 'Active' ? 'Suspendre' : 'Réactiver'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ONGLET 3 : ANALYSES DE SANTÉ GLOBALES */}
        {activeTab === 'Analyses de Santé' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
              <h2 className="text-sm font-bold text-slate-900 mb-2">Rapport Epidémiologique & Pénuries Réseau</h2>
              <p className="text-xs text-slate-400">Ces métriques sont calculées à partir des recherches infructueuses des patients (demandes rejetées ou médicaments indisponibles sur KAMERPHARM).</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                <div className="border border-rose-100 bg-rose-50/20 p-4 rounded-xl">
                  <h4 className="text-xs font-bold text-rose-700 uppercase tracking-wider">🚨 Alertes Pénuries (Réseau National)</h4>
                  <p className="text-[11px] text-slate-500 mt-1">Médicaments à fort taux de rejet de réservation pour cause de rupture de stock générale :</p>
                  <ul className="text-xs mt-3 space-y-1.5 font-semibold text-slate-700">
                    <li className="flex justify-between"><span>• Sirop Coquelusedal (Pédiatrie)</span> <span className="text-rose-600">86% d'indisponibilité</span></li>
                    <li className="flex justify-between"><span>• Vitamines C Laroscorbine</span> <span className="text-rose-500">62% d'indisponibilité</span></li>
                  </ul>
                </div>

                <div className="border border-indigo-100 bg-indigo-50/20 p-4 rounded-xl">
                  <h4 className="text-xs font-bold text-indigo-700 uppercase tracking-wider">📈 Pics de Demandes par Zone</h4>
                  <p className="text-[11px] text-slate-500 mt-1">Analyses prédictives basées sur l'activité récente :</p>
                  <ul className="text-xs mt-3 space-y-1.5 font-semibold text-slate-700">
                    <li className="flex justify-between"><span>• Antipaludiques (Douala V)</span> <span className="text-indigo-600">+34% cette semaine</span></li>
                    <li className="flex justify-between"><span>• Antibiotiques enfants (Yaoundé)</span> <span className="text-indigo-600">+14% ce mois</span></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ONGLET 4 : CONTRÔLE SYSTÈME & PARAMÈTRES GENERAUX */}
        {activeTab === 'Contrôle Système' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-6">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Configuration Globale de la Plateforme</h2>
                <p className="text-xs text-slate-400 mt-0.5">Ajustez les règles métiers appliquées à l'ensemble de l'écosystème KAMERPHARM.</p>
              </div>

              <div className="space-y-4 text-xs font-semibold">
                {/* CONFIGURATION DES DELAIS (SECTION COMMISSIONS RETIRÉE D'ICI) */}
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="text-slate-400 block mb-1">Délai de garde maximum des réservations (Heures)</label>
                    <input 
                      type="number" 
                      value={systemConfig.maxReservationHoldHours} 
                      onChange={(e) => setSystemConfig({...systemConfig, maxReservationHoldHours: parseInt(e.target.value) || 0})}
                      className="w-full max-w-sm bg-[#f8fafc] border border-slate-100 rounded-xl p-2.5 font-medium outline-none focus:bg-white focus:border-indigo-500 transition-all" 
                    />
                    <p className="text-[10px] text-slate-400 font-normal mt-1">Temps maximum accordé au patient pour se déplacer et récupérer sa boîte en officine avant annulation automatique de la réservation.</p>
                  </div>
                </div>

                <hr className="border-slate-100 my-2" />

                {/* OPTIONS DE SÉCURITÉ / MAINTENANCE */}
                <div className="space-y-3">
                  <h3 className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Interrupteurs de Secours (Kill-Switches)</h3>
                  
                  <label className="flex items-center justify-between p-3.5 border border-slate-100 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                    <div>
                      <p className="text-xs font-bold text-slate-700">Alertes SMS Automatiques</p>
                      <p className="text-[10px] text-slate-400 font-normal">Envoyer un SMS au patient dès que la pharmacie accepte/refuse la réservation pour lui confirmer la mise de côté du produit.</p>
                    </div>
                    <input type="checkbox" checked={systemConfig.smsAlertsEnabled} onChange={(e) => setSystemConfig({...systemConfig, smsAlertsEnabled: e.target.checked})} className="accent-indigo-600 w-4 h-4 cursor-pointer" />
                  </label>

                  <label className="flex items-center justify-between p-3.5 border border-rose-100 bg-rose-50/10 rounded-xl cursor-pointer hover:bg-rose-50/20 transition-colors">
                    <div>
                      <p className="text-xs font-bold text-rose-700">Mode Maintenance Général</p>
                      <p className="text-[10px] text-rose-400 font-normal">Bloquer momentanément l'application mobile grand public pour les mises à jour de base de données.</p>
                    </div>
                    <input type="checkbox" checked={systemConfig.maintenanceMode} onChange={(e) => setSystemConfig({...systemConfig, maintenanceMode: e.target.checked})} className="accent-rose-600 w-4 h-4 cursor-pointer" />
                  </label>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button onClick={() => alert('Configuration système mise à jour au niveau de la base centrale.')} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all shadow-sm">
                  Appliquer les modifications système
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}