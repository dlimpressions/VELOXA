
document.addEventListener('DOMContentLoaded', async function() {
    if (!checkAuth()) return;
    await cargarHistorial();
});
async function cargarHistorial() {
    const container = document.getElementById('historialContainer');
    const mes = document.getElementById('filtroMes').value;
    const estado = document.getElementById('filtroEstado').value;
    showLoading('historialContainer', 'Cargando historial...');
    try {
        const result = await obtenerHistorial({ mes, estado });
        if (result.success) {
            const historial = result.data || [];
            if (historial.length === 0) {
                showEmpty('historialContainer', '📊', 'No hay registros en el historial con los filtros seleccionados.');
                return;
            }
            let html = '<div class="table-responsive"><table class="table-futuristic"><thead><tr><th>Fecha</th><th>Origen</th><th>Destino</th><th>Valor</th><th>Comisión</th><th>Estado</th></tr></thead><tbody>';
            historial.forEach(h => {
                let badgeClass = 'badge-pendiente';
                if (h.estado === 'Finalizado') badgeClass = 'badge-finalizado';
                if (h.estado === 'Cancelado') badgeClass = 'badge-cancelado';
                if (h.estado === 'En ruta') badgeClass = 'badge-asignado';
                html += `<tr><td>${formatDate(h.fecha)}</td><td style="color:var(--text-primary);font-weight:500">${h.origen || '-'}</td><td style="color:var(--text-primary);font-weight:500">${h.destino || '-'}</td><td style="color:var(--accent-success);font-weight:700;font-family:var(--font-mono)">${formatCurrency(h.valor || 0)}</td><td style="color:var(--accent-warning);font-family:var(--font-mono)">${formatCurrency(h.comision || 0)}</td><td><span class="badge-futuristic ${badgeClass}">${h.estado}</span></td></tr>`;
            });
            html += '</tbody></table></div>';
            container.innerHTML = html;
        } else {
            showError('historialContainer', result.message);
        }
    } catch (error) {
        showError('historialContainer', 'Error al cargar el historial');
    }
}
function limpiarFiltros() {
    document.getElementById('filtroMes').value = '';
    document.getElementById('filtroEstado').value = '';
    cargarHistorial();
}
