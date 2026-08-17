// ============================================================
// admin-dashboard.js - Carga de estadísticas para el panel admin
// ============================================================

document.addEventListener('DOMContentLoaded', async function() {
    if (!checkAdmin()) return;
    updateUserName();
    updateUserInitial();

    try {
        // Mostrar loading en el contenedor de estadísticas
        const container = document.getElementById('estadisticasContainer');
        if (container) {
            container.innerHTML = `
                <div class="col-12 text-center py-5">
                    <div style="width:60px;height:60px;margin:0 auto 1rem;border:3px solid rgba(0,240,255,0.1);border-top-color:var(--accent-cyan);border-radius:50%;animation:spin 1s linear infinite"></div>
                    <p style="color:var(--text-secondary)">Cargando estadísticas...</p>
                </div>
            `;
        }

        const result = await obtenerEstadisticasAdmin();
        console.log('Estadísticas recibidas:', result);

        if (result.success) {
            const stats = result.data;
            // Actualizar cada elemento con su ID
            const totalConductores = document.getElementById('totalConductores');
            if (totalConductores) totalConductores.textContent = stats.totalConductores || 0;

            const pendientes = document.getElementById('pendientes');
            if (pendientes) pendientes.textContent = stats.pendientes || 0;

            const viajesActivos = document.getElementById('viajesActivos');
            if (viajesActivos) viajesActivos.textContent = stats.viajesActivos || 0;

            const comisionesPend = document.getElementById('comisionesPend');
            if (comisionesPend) comisionesPend.textContent = formatCurrency(stats.comisionesPendientes || 0);
        } else {
            showToast('Error al cargar estadísticas: ' + result.message, 'error');
            // Mostrar mensaje de error en el contenedor
            const container = document.getElementById('estadisticasContainer');
            if (container) {
                container.innerHTML = `
                    <div class="col-12 text-center py-4">
                        <div class="empty-state-icon">⚠️</div>
                        <h5 style="color:var(--accent-danger);">Error de conexión</h5>
                        <p style="color:var(--text-muted);">${result.message}</p>
                        <button class="btn-futuristic btn-outline-futuristic mt-3" onclick="location.reload()"><span>🔄 Reintentar</span></button>
                    </div>
                `;
            }
        }
    } catch (error) {
        console.error('Error en dashboard:', error);
        showToast('Error al cargar el dashboard', 'error');
        const container = document.getElementById('estadisticasContainer');
        if (container) {
            container.innerHTML = `
                <div class="col-12 text-center py-4">
                    <div class="empty-state-icon">⚠️</div>
                    <h5 style="color:var(--accent-danger);">Error de conexión</h5>
                    <p style="color:var(--text-muted);">No se pudieron cargar las estadísticas. Verifica tu conexión.</p>
                    <button class="btn-futuristic btn-outline-futuristic mt-3" onclick="location.reload()"><span>🔄 Reintentar</span></button>
                </div>
            `;
        }
    }
});
