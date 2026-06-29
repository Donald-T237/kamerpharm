/**
 * Utilitaires pour les Pharmacies
 * Calculs de distance, statut ouvert/fermé, etc.
 */

/**
 * Calcule le statut ouvert/fermé d'une pharmacie basé sur les heures
 * @param {Object} hours - Objet contenant les horaires (lundi, mardi, etc.)
 * @returns {Object} { isOpen: boolean, currentDay: string, currentTime: string, nextOpenTime: string }
 */
function getPharmacyStatus(hours) {
  const now = new Date();
  const daysOfWeek = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
  const currentDay = daysOfWeek[now.getDay()];
  
  // Format de l'heure actuelle (HH:MM)
  const currentHours = String(now.getHours()).padStart(2, '0');
  const currentMinutes = String(now.getMinutes()).padStart(2, '0');
  const currentTime = `${currentHours}:${currentMinutes}`;
  
  // Récupération des horaires du jour
  const todaySchedule = hours[currentDay];
  
  if (!todaySchedule || todaySchedule.open === '00:00' && todaySchedule.close === '00:00') {
    return {
      isOpen: false,
      currentDay,
      currentTime,
      reason: 'Fermé le ' + currentDay,
      status: 'Fermé',
      nextOpenTime: null
    };
  }

  const isOpen = currentTime >= todaySchedule.open && currentTime < todaySchedule.close;
  
  return {
    isOpen,
    currentDay,
    currentTime,
    openTime: todaySchedule.open,
    closeTime: todaySchedule.close,
    status: isOpen ? 'Ouvert' : 'Fermé',
    nextOpenTime: isOpen ? todaySchedule.close : todaySchedule.open
  };
}

/**
 * Formate la distance en km avec 1 décimale
 * @param {Number} distanceInMeters - Distance en mètres (du $geoNear)
 * @returns {String} Distance formatée "X.X km"
 */
function formatDistance(distanceInMeters) {
  const km = (distanceInMeters / 1000).toFixed(1);
  return `${km} km`;
}

/**
 * Enrichit une pharmacie avec les infos de statut et distance
 * @param {Object} pharmacy - Objet pharmacie de MongoDB
 * @returns {Object} Pharmacie enrichie
 */
function enrichPharmacyData(pharmacy) {
  const status = getPharmacyStatus(pharmacy.hours);
  const distance = pharmacy.distance ? formatDistance(pharmacy.distance) : 'N/A';
  
  return {
    ...pharmacy,
    distance,
    isOpen: status.isOpen,
    openingHours: status,
    displayStatus: status.status,
    icon: status.isOpen ? '🟢' : '🔴' // Pour afficher dans les résultats
  };
}

module.exports = {
  getPharmacyStatus,
  formatDistance,
  enrichPharmacyData
};
