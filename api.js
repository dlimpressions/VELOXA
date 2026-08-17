// ============================================================
// api.js - Comunicación con Google Apps Script vía JSONP
// ============================================================

// Función principal que llama al backend
async function callApi(action, data = {}) {
    // Obtener ID del conductor desde sessionStorage
    const conductorId = getConductorId();
    // Armar el payload con la acción y los datos
    const payload = { action, conductorId, ...data };

    // Generar un nombre único para el callback (para que no choque con otras peticiones)
    const callbackName = 'jsonp_callback_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);

    // Devolver una promesa que se resolverá cuando el script cargue
    return new Promise((resolve, reject) => {
        // 1. Crear la función callback global
        window[callbackName] = function(response) {
            // Limpiar después de recibir la respuesta
            delete window[callbackName];
            document.body.removeChild(script);
            // Resolver la promesa con la respuesta (ya es un objeto JavaScript)
            resolve(response);
        };

        // 2. Construir la URL con el callback y los datos codificados
        const url = `${API_BASE_URL}?callback=${callbackName}&data=${encodeURIComponent(JSON.stringify(payload))}`;

        // 3. Crear y agregar el script al DOM
        const script = document.createElement('script');
        script.src = url;
        script.onerror = function() {
            // Si falla la carga, limpiar y rechazar
            delete window[callbackName];
            document.body.removeChild(script);
            reject(new Error('Error de conexión con el servidor'));
            showToast('No se pudo conectar con el servidor. Revisa tu internet.', 'error');
        };
        document.body.appendChild(script);

        // 4. Timeout por si el script tarda demasiado (10 segundos)
        setTimeout(() => {
            if (window[callbackName]) {
                delete window[callbackName];
                document.body.removeChild(script);
                reject(new Error('Tiempo de espera agotado'));
                showToast('El servidor no responde. Intenta de nuevo.', 'error');
            }
        }, 10000);
    });
}

// ========== Funciones específicas para cada acción ==========

async function registrarConductor(data) {
    return callApi('registrarConductor', data);
}

async function login(email, password) {
    return callApi('login', { email, password });
}

async function obtenerViajesDisponibles() {
    return callApi('obtenerViajesDisponibles');
}

async function aplicarViaje(idViaje) {
    return callApi('aplicarViaje', { idViaje });
}

async function obtenerMisAplicaciones() {
    return callApi('obtenerMisAplicaciones');
}

async function obtenerMisViajes() {
    return callApi('obtenerMisViajes');
}

async function iniciarViaje(idViaje) {
    return callApi('iniciarViaje', { idViaje });
}

async function finalizarViaje(idViaje, observaciones, fotoGuia, fotoEntrega) {
    return callApi('finalizarViaje', { idViaje, observaciones, fotoGuia, fotoEntrega });
}

async function obtenerHistorial(filtros = {}) {
    return callApi('obtenerHistorial', filtros);
}

async function obtenerPagos() {
    return callApi('obtenerPagos');
}

async function registrarPago(idPago, comprobante) {
    return callApi('registrarPago', { idPago, comprobante });
}

async function obtenerPerfil() {
    return callApi('obtenerPerfil');
}

async function actualizarPerfil(data) {
    return callApi('actualizarPerfil', data);
}

async function obtenerDashboard() {
    return callApi('obtenerDashboard');
}

// ========== Funciones de Administrador ==========

async function obtenerConductoresPendientes() {
    return callApi('obtenerConductoresPendientes');
}

async function aprobarConductor(conductorId) {
    return callApi('aprobarConductor', { conductorId });
}

async function rechazarConductor(conductorId, motivo) {
    return callApi('rechazarConductor', { conductorId, motivo });
}

async function obtenerTodosLosViajes() {
    return callApi('obtenerTodosLosViajes');
}

async function crearViajeAdmin(data) {
    return callApi('crearViajeAdmin', data);
}

async function editarViajeAdmin(data) {
    return callApi('editarViajeAdmin', data);
}

async function eliminarViajeAdmin(idViaje) {
    return callApi('eliminarViajeAdmin', { idViaje });
}

async function obtenerPagosPendientes() {
    return callApi('obtenerPagosPendientes');
}

async function validarPagoAdmin(idPago, aprobar) {
    return callApi('validarPagoAdmin', { idPago, aprobar });
}

async function obtenerEstadisticasAdmin() {
    return callApi('obtenerEstadisticasAdmin');
}
