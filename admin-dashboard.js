// ============================================================
// admin-dashboard.js - Carga de estadísticas para el panel admin
// ============================================================

document.addEventListener('DOMContentLoaded', async function() {
    if (!checkAdmin()) return;
    updateUserName();
    updateUserInitial();

    try {
        showLoading('estadisticasContainer', 'Cargando estadísticas...');
        const result = await obtenerEstadisticasAdmin();
        console.log('Estadísticas recibidas:', result); // <-- LOG para depurar
        if (result.success) {
            const stats = result.data;
            document.getElementById('totalConductores').textContent = stats.totalConductores || 0;
            document.getElementById('pendientes').textContent = stats.pendientes || 0;
            document.getElementById('viajesActivos').textContent = stats.viajesActivos || 0;
            document.getElementById('comisionesPend').textContent = formatCurrency(stats.comisionesPendientes || 0);
        } else {
            showError('estadisticasContainer', result.message);
        }
    } catch (error) {
        console.error('Error en dashboard:', error);
        showError('estadisticasContainer', 'No se pudieron cargar las estadísticas');
    }
});
