async function callApi(action, data={}) {
    const conductorId = getConductorId();
    const payload = { action: action, conductorId: conductorId, ...data };
    try {
        const response = await fetch(API_BASE_URL, {
            method: 'POST', mode: 'cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const text = await response.text();
        let result;
        try { result = JSON.parse(text); } catch (e) { const cleanText = text.replace(/^[^{]*/, '').replace(/[^}]*$/, ''); result = JSON.parse(cleanText); }
        return result;
    } catch (error) {
        console.error('Error API:', error);
        showToast('Error de conexión con el servidor', 'error');
        return { success: false, message: 'Error de conexión. Intenta de nuevo.' };
    }
}
async function registrarConductor(data) { return callApi('registrarConductor', data); }
async function login(email, password) { return callApi('login', { email, password }); }
async function obtenerViajesDisponibles() { return callApi('obtenerViajesDisponibles'); }
async function aplicarViaje(idViaje) { return callApi('aplicarViaje', { idViaje }); }
async function obtenerMisAplicaciones() { return callApi('obtenerMisAplicaciones'); }
async function obtenerMisViajes() { return callApi('obtenerMisViajes'); }
async function iniciarViaje(idViaje) { return callApi('iniciarViaje', { idViaje }); }
async function finalizarViaje(idViaje, observaciones, fotoGuia, fotoEntrega) { return callApi('finalizarViaje', { idViaje, observaciones, fotoGuia, fotoEntrega }); }
async function obtenerHistorial(filtros={}) { return callApi('obtenerHistorial', filtros); }
async function obtenerPagos() { return callApi('obtenerPagos'); }
async function registrarPago(idPago, comprobante) { return callApi('registrarPago', { idPago, comprobante }); }
async function obtenerPerfil() { return callApi('obtenerPerfil'); }
async function actualizarPerfil(data) { return callApi('actualizarPerfil', data); }
async function obtenerDashboard() { return callApi('obtenerDashboard'); }
