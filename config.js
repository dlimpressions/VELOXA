const API_BASE_URL = 'https://script.google.com/macros/s/AKfycbzrm0SOOJdR3naLj26x42SIyzOB5iecMWX5I0r4G4A0Sil6BdfJOpx3WPrXI9ShHKwH7Q/exec';
function getConductorId() { return sessionStorage.getItem('conductorId'); }
function setConductorId(id) { sessionStorage.setItem('conductorId', id); }
function clearSession() { sessionStorage.removeItem('conductorId'); sessionStorage.removeItem('conductorNombre'); }
function getConductorNombre() { return sessionStorage.getItem('conductorNombre') || 'Conductor'; }
function setConductorNombre(nombre) { sessionStorage.setItem('conductorNombre', nombre); }
