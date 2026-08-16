const API_BASE_URL = 'https://script.google.com/macros/s/TU_ID_DE_SCRIPT/exec';
function getConductorId() { return sessionStorage.getItem('conductorId'); }
function setConductorId(id) { sessionStorage.setItem('conductorId', id); }
function clearSession() { sessionStorage.removeItem('conductorId'); sessionStorage.removeItem('conductorNombre'); }
function getConductorNombre() { return sessionStorage.getItem('conductorNombre') || 'Conductor'; }
function setConductorNombre(nombre) { sessionStorage.setItem('conductorNombre', nombre); }
