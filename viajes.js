
let viajesData = [];
let viajeSeleccionado = null;
document.addEventListener('DOMContentLoaded', async function() {
    if (!checkAuth()) return;
    await cargarViajes();
});
async function cargarViajes() {
    const container = document.getElementById('viajesContainer');
    showLoading('viajesContainer', 'Buscando viajes disponibles...');
    try {
        const result = await obtenerViajesDisponibles();
        if (result.success) {
            viajesData = result.data || [];
            renderViajes(viajesData);
        } else {
            showError('viajesContainer', result.message);
        }
    } catch (error) {
        showError('viajesContainer', 'Error al cargar los viajes');
    }
}
function renderViajes(viajes) {
    const container = document.getElementById('viajesContainer');
    if (viajes.length === 0) {
        showEmpty('viajesContainer', '🚚', 'No hay viajes disponibles en este momento. Vuelve pronto.');
        return;
    }
    let html = '';
    viajes.forEach((v, index) => {
        html += `<div class="col fade-in" style="animation-delay:${index * 0.1}s"><div class="trip-card h-100"><div class="trip-header"><div class="d-flex justify-content-between align-items-start"><div><div class="trip-code">Viaje #${v.id}</div><div class="trip-price">${formatCurrency(v.valor || 0)}</div></div><span class="badge-futuristic badge-disponible">Disponible</span></div></div><div class="trip-body"><div class="trip-route"><div><div class="route-dot"></div><div class="route-line"></div><div class="route-dot end"></div></div><div style="flex:1"><div style="color:var(--text-primary);font-weight:600;margin-bottom:12px">${v.origen || '-'}</div><div style="color:var(--text-primary);font-weight:600">${v.destino || '-'}</div></div></div><div class="row g-2 mb-3" style="font-size:0.85rem"><div class="col-6"><span style="color:var(--text-muted)">📅</span><span style="color:var(--text-secondary)">${formatDate(v.fecha)}</span></div><div class="col-6"><span style="color:var(--text-muted)">🕐</span><span style="color:var(--text-secondary)">${v.hora || '--:--'}</span></div><div class="col-6"><span style="color:var(--text-muted)">🚗</span><span style="color:var(--text-secondary)">${v.tipoVehiculo || '-'}</span></div><div class="col-6"><span style="color:var(--text-muted)">⚖️</span><span style="color:var(--text-secondary)">${v.peso || '-'} kg</span></div></div><div style="color:var(--text-secondary);font-size:0.85rem;margin-bottom:1rem"><span style="color:var(--text-muted)">🏢</span> ${v.empresa || 'Empresa no especificada'}</div><div class="d-flex gap-2"><button class="btn-futuristic btn-primary-futuristic flex-fill" style="padding:10px;font-size:0.85rem" onclick="aplicar('${v.id}')"><span>✅ Aplicar</span></button><button class="btn-futuristic btn-outline-futuristic" style="padding:10px 16px;font-size:0.85rem" onclick="verDetalle('${v.id}')"><span>👁️</span></button></div></div></div></div>`;
    });
    container.innerHTML = html;
}
function filtrarViajes() {
    const origen = document.getElementById('filtroOrigen').value.toLowerCase();
    const destino = document.getElementById('filtroDestino').value.toLowerCase();
    const tipo = document.getElementById('filtroTipo').value;
    const filtrados = viajesData.filter(v => {
        const matchOrigen = !origen || (v.origen && v.origen.toLowerCase().includes(origen));
        const matchDestino = !destino || (v.destino && v.destino.toLowerCase().includes(destino));
        const matchTipo = !tipo || v.tipoVehiculo === tipo;
        return matchOrigen && matchDestino && matchTipo;
    });
    renderViajes(filtrados);
}
async function aplicar(idViaje) {
    confirmAction('Confirmar aplicación', '¿Deseas aplicar a este viaje? Recuerda que debes cumplir con los requisitos del vehículo y estar disponible en la fecha indicada.', async () => {
        try {
            const result = await aplicarViaje(idViaje);
            if (result.success) { showToast(result.message, 'success'); await cargarViajes(); }
            else { showToast(result.message, 'error'); }
        } catch (error) { showToast('Error al aplicar al viaje', 'error'); }
    }, 'Sí, aplicar', 'Cancelar');
}
function verDetalle(id) {
    const viaje = viajesData.find(v => v.id === id);
    if (!viaje) return;
    viajeSeleccionado = id;
    const content = document.getElementById('detalleContent');
    content.innerHTML = `<div class="mb-3"><strong style="color:var(--text-primary)">Origen:</strong> ${viaje.origen || '-'}<br><strong style="color:var(--text-primary)">Destino:</strong> ${viaje.destino || '-'}<br><strong style="color:var(--text-primary)">Fecha:</strong> ${formatDate(viaje.fecha)} ${viaje.hora || ''}<br><strong style="color:var(--text-primary)">Valor:</strong> <span style="color:var(--accent-success);font-weight:700">${formatCurrency(viaje.valor || 0)}</span><br><strong style="color:var(--text-primary)">Tipo vehículo:</strong> ${viaje.tipoVehiculo || '-'}<br><strong style="color:var(--text-primary)">Peso:</strong> ${viaje.peso || '-'} kg<br><strong style="color:var(--text-primary)">Empresa:</strong> ${viaje.empresa || '-'}<br><strong style="color:var(--text-primary)">Descripción:</strong> ${viaje.descripcion || 'Sin descripción adicional'}</div>`;
    const modal = new bootstrap.Modal(document.getElementById('detalleModal'));
    modal.show();
}
async function aplicarDesdeModal() {
    if (viajeSeleccionado) {
        bootstrap.Modal.getInstance(document.getElementById('detalleModal')).hide();
        await aplicar(viajeSeleccionado);
    }
}
