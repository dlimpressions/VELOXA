
document.addEventListener('DOMContentLoaded', async function() {
    if (!checkAuth()) return;
    await cargarMisViajes();
});
async function cargarMisViajes() {
    const container = document.getElementById('misViajesContainer');
    showLoading('misViajesContainer', 'Cargando tus viajes asignados...');
    try {
        const result = await obtenerMisViajes();
        if (result.success) {
            const viajes = result.data || [];
            if (viajes.length === 0) {
                showEmpty('misViajesContainer', '🛣️', 'No tienes viajes asignados actualmente. Aplica a viajes disponibles y espera la selección del administrador.');
                return;
            }
            let html = '';
            viajes.forEach((v, index) => {
                const steps = [
                    { label: 'Asignado', icon: '📋', active: v.estado === 'Asignado', completed: ['En ruta', 'Finalizado'].includes(v.estado) },
                    { label: 'En ruta', icon: '🚚', active: v.estado === 'En ruta', completed: v.estado === 'Finalizado' },
                    { label: 'Finalizado', icon: '✅', active: v.estado === 'Finalizado', completed: false }
                ];
                let timelineHtml = '<div class="estado-timeline">';
                steps.forEach(step => {
                    let dotClass = '';
                    if (step.active) dotClass = 'active';
                    else if (step.completed) dotClass = 'completed';
                    timelineHtml += `<div class="estado-step ${dotClass}"><div class="estado-dot">${step.icon}</div><div class="estado-label">${step.label}</div></div>`;
                });
                timelineHtml += '</div>';
                let actionButtons = '';
                if (v.estado === 'Asignado') {
                    actionButtons = `<button class="btn-futuristic btn-success-futuristic" onclick="iniciar('${v.id}')"><span>🚀 Iniciar viaje</span></button>`;
                } else if (v.estado === 'En ruta') {
                    actionButtons = `<button class="btn-futuristic btn-primary-futuristic" onclick="finalizar('${v.id}')"><span>🏁 Finalizar viaje</span></button>`;
                } else if (v.estado === 'Finalizado') {
                    actionButtons = `<span class="badge-futuristic badge-finalizado">Viaje completado</span>`;
                }
                html += `<div class="viaje-timeline-card fade-in" style="animation-delay:${index * 0.1}s"><div class="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-3"><div><div style="font-family:var(--font-mono);color:var(--accent-cyan);font-size:0.8rem;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:4px">Viaje #${v.id}</div><h5 style="color:var(--text-primary);margin:0">${v.origen || '-'} → ${v.destino || '-'}</h5></div><div style="text-align:right"><div style="color:var(--accent-success);font-weight:800;font-size:1.25rem;font-family:var(--font-mono)">${formatCurrency(v.valor || 0)}</div><div style="color:var(--text-muted);font-size:0.8rem">${formatDate(v.fecha)}</div></div></div><div class="row g-2 mb-3" style="font-size:0.85rem"><div class="col-md-4"><span style="color:var(--text-muted)">🕐 Hora:</span><span style="color:var(--text-secondary)"> ${v.hora || '--:--'}</span></div><div class="col-md-4"><span style="color:var(--text-muted)">🏢 Empresa:</span><span style="color:var(--text-secondary)"> ${v.empresa || '-'}</span></div><div class="col-md-4"><span style="color:var(--text-muted)">📊 Estado:</span><span style="color:var(--text-secondary)"> ${v.estado}</span></div></div>${timelineHtml}<div class="mt-3">${actionButtons}</div></div>`;
            });
            container.innerHTML = html;
        } else {
            showError('misViajesContainer', result.message);
        }
    } catch (error) {
        showError('misViajesContainer', 'Error al cargar los viajes');
    }
}
async function iniciar(idViaje) {
    confirmAction('Iniciar viaje', '¿Confirmas que estás listo para iniciar este viaje? Asegúrate de tener el vehículo en condiciones y la documentación al día.', async () => {
        try {
            const result = await iniciarViaje(idViaje);
            if (result.success) { showToast(result.message, 'success'); await cargarMisViajes(); }
            else { showToast(result.message, 'error'); }
        } catch (error) { showToast('Error al iniciar el viaje', 'error'); }
    }, 'Sí, iniciar', 'Cancelar');
}
async function finalizar(idViaje) {
    confirmAction('Finalizar viaje', '¿Confirmas que has completado la entrega? Deberás subir las fotos de guía y entrega, y pagar la comisión correspondiente.', async () => {
        const observaciones = prompt('📝 Observaciones del viaje (opcional):');
        const fotoGuia = prompt('📷 URL de la foto de guía (opcional):');
        const fotoEntrega = prompt('📷 URL de la foto de entrega (opcional):');
        try {
            const result = await finalizarViaje(idViaje, observaciones, fotoGuia, fotoEntrega);
            if (result.success) { showToast(result.message, 'success'); await cargarMisViajes(); }
            else { showToast(result.message, 'error'); }
        } catch (error) { showToast('Error al finalizar el viaje', 'error'); }
    }, 'Finalizar', 'Cancelar');
}
