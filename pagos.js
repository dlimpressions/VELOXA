
document.addEventListener('DOMContentLoaded', async function() {
    if (!checkAuth()) return;
    await cargarPagos();
});
async function cargarPagos() {
    const container = document.getElementById('pagosContainer');
    showLoading('pagosContainer', 'Cargando tus pagos...');
    try {
        const result = await obtenerPagos();
        if (result.success) {
            const pagos = result.data || [];
            let totalPendiente = 0, totalPagado = 0;
            pagos.forEach(p => {
                if (p.estado === 'Pendiente') totalPendiente += (p.comision || 0);
                if (p.estado === 'Pagado') totalPagado += (p.comision || 0);
            });
            document.getElementById('totalPendiente').textContent = formatCurrency(totalPendiente);
            document.getElementById('totalPagado').textContent = formatCurrency(totalPagado);
            document.getElementById('totalViajes').textContent = pagos.length;
            if (pagos.length === 0) {
                showEmpty('pagosContainer', '💳', 'No tienes pagos registrados. Los comisiones aparecerán aquí después de finalizar un viaje.');
                return;
            }
            let html = '';
            pagos.forEach((p, index) => {
                let cardClass = p.estado.toLowerCase();
                let estadoBadge = '', actionButton = '';
                if (p.estado === 'Pendiente') {
                    estadoBadge = '<span class="badge-futuristic badge-pendiente">Pendiente de pago</span>';
                    actionButton = `<div class="cuenta-info"><div style="color:var(--text-secondary);font-size:0.85rem;margin-bottom:0.5rem">📋 Datos para transferencia:</div><div style="color:var(--text-primary);font-size:0.9rem;font-family:var(--font-mono)"><div>🏦 Bancolombia: 123-456789-00</div><div>📱 Nequi: 3001234567</div><div>📲 Daviplata: 3001234567</div></div></div><button class="btn-futuristic btn-success-futuristic w-100 mt-2" onclick="pagar('${p.id}', '${p.idViaje}')"><span>✅ Ya realicé el pago</span></button>`;
                } else if (p.estado === 'Pagado') {
                    estadoBadge = '<span class="badge-futuristic badge-disponible">✅ Pagado y validado</span>';
                } else if (p.estado === 'Pendiente de validar') {
                    estadoBadge = '<span class="badge-futuristic badge-asignado">⏳ Pendiente de validar</span>';
                } else if (p.estado === 'Rechazado') {
                    estadoBadge = '<span class="badge-futuristic badge-cancelado">❌ Rechazado</span>';
                }
                html += `<div class="pago-card ${cardClass} fade-in" style="animation-delay:${index * 0.1}s"><div class="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-2"><div><div style="font-family:var(--font-mono);color:var(--accent-cyan);font-size:0.8rem;text-transform:uppercase;letter-spacing:0.1em">Viaje #${p.idViaje}</div><div style="color:var(--text-secondary);font-size:0.85rem">${formatDate(p.fecha)}</div></div>${estadoBadge}</div><div class="row g-2 mt-2"><div class="col-md-6"><div style="color:var(--text-muted);font-size:0.8rem;text-transform:uppercase">Valor del viaje</div><div style="color:var(--accent-success);font-weight:700;font-size:1.25rem;font-family:var(--font-mono)">${formatCurrency(p.valorViaje || 0)}</div></div><div class="col-md-6"><div style="color:var(--text-muted);font-size:0.8rem;text-transform:uppercase">Comisión (10%)</div><div style="color:var(--accent-warning);font-weight:700;font-size:1.25rem;font-family:var(--font-mono)">${formatCurrency(p.comision || 0)}</div></div></div>${actionButton}</div>`;
            });
            container.innerHTML = html;
        } else {
            showError('pagosContainer', result.message);
        }
    } catch (error) {
        showError('pagosContainer', 'Error al cargar los pagos');
    }
}
async function pagar(idPago, idViaje) {
    const comprobante = prompt('📷 Ingresa la URL de la captura del comprobante de pago:');
    if (!comprobante) return;
    if (!comprobante.startsWith('http')) { showToast('Por favor ingresa una URL válida del comprobante', 'warning'); return; }
    try {
        const result = await registrarPago(idPago, comprobante);
        if (result.success) { showToast(result.message, 'success'); await cargarPagos(); }
        else { showToast(result.message, 'error'); }
    } catch (error) { showToast('Error al registrar el pago', 'error'); }
}
