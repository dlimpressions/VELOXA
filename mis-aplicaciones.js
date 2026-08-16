
document.addEventListener('DOMContentLoaded', async function() {
    if (!checkAuth()) return;
    await cargarAplicaciones();
});
async function cargarAplicaciones() {
    const container = document.getElementById('aplicacionesContainer');
    showLoading('aplicacionesContainer', 'Cargando tus aplicaciones...');
    try {
        const result = await obtenerMisAplicaciones();
        if (result.success) {
            const apps = result.data || [];
            if (apps.length === 0) {
                showEmpty('aplicacionesContainer', '📋', 'Aún no has aplicado a ningún viaje. ¡Ve a la sección de viajes disponibles y encuentra tu primera oportunidad!');
                return;
            }
            let html = '<div class="table-responsive"><table class="table-futuristic"><thead><tr><th>Viaje</th><th>Fecha</th><th>Estado</th><th>Resultado</th></tr></thead><tbody>';
            apps.forEach(a => {
                let badgeClass = 'badge-pendiente';
                if (a.estado === 'Seleccionado') badgeClass = 'badge-asignado';
                if (a.estado === 'Finalizado') badgeClass = 'badge-finalizado';
                if (a.estado === 'Cancelado') badgeClass = 'badge-cancelado';
                html += `<tr><td><span style="font-family:var(--font-mono);color:var(--accent-cyan);font-weight:600">#${a.idViaje}</span></td><td>${formatDate(a.fecha)}</td><td><span class="badge-futuristic ${badgeClass}">${a.estado}</span></td><td style="color:var(--text-secondary)">${a.resultado || '-'}</td></tr>`;
            });
            html += '</tbody></table></div>';
            container.innerHTML = html;
        } else {
            showError('aplicacionesContainer', result.message);
        }
    } catch (error) {
        showError('aplicacionesContainer', 'Error al cargar las aplicaciones');
    }
}
