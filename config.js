// ============================================================
// CONFIGURACIÓN GLOBAL
// ============================================================

const API_BASE_URL = 'https://script.google.com/macros/s/AKfycbztRyEekZf4OZ287qHjrfGiM4Jbx-A7iXPM7sOHM5wEJxR3pnS41SVAj8YXPqjLGded9Q/exec'; // <-- REEMPLAZA

// ===== Sesión del conductor =====
function getConductorId() {
    return sessionStorage.getItem('conductorId');
}

function setConductorId(id) {
    sessionStorage.setItem('conductorId', id);
}

function getConductorNombre() {
    return sessionStorage.getItem('conductorNombre') || 'Conductor';
}

function setConductorNombre(nombre) {
    sessionStorage.setItem('conductorNombre', nombre);
}

function getConductorRol() {
    return sessionStorage.getItem('conductorRol') || 'conductor';
}

function setConductorRol(rol) {
    sessionStorage.setItem('conductorRol', rol);
}

function isAdmin() {
    return getConductorRol() === 'admin';
}

function clearSession() {
    sessionStorage.removeItem('conductorId');
    sessionStorage.removeItem('conductorNombre');
    sessionStorage.removeItem('conductorRol');
}
