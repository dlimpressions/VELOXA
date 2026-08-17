// ============================================================
// admin-viajes.js - Gestión de viajes
// ============================================================

let viajesData = [];
let viajeEditandoId = null;
let viajeAsignarId = null;

document.addEventListener('DOMContentLoaded', async function() {
    if (!checkAdmin()) return;
    updateUserName();
    updateUserInitial();
    await cargarViajesAdmin();
});

async function cargarViajesAdmin() {
    const container = document.getElementById('viajesAdminContainer');
    showLoading('viajesAdminContainer', 'Cargando viajes...');
    try {
        const result = await obtenerTodosLosViajes();
        if (result.success) {
            viajesData = result.data || [];
            renderViajesAdmin(viajesData);
        } else {
            showError('viajesAdminContainer', result.message);
        }
    } catch (error) {
        showError('viajesAdminContainer', 'Error al cargar viajes');
    }
}

function renderViajesAdmin(viajes) {
    const container = document.getElementById('viajesAdminContainer');
    if (viajes.length === 0) {
        showEmpty('viajesAdminContainer', '🚚', 'No hay viajes creados aún.');
        return;
    }
    let html = '<div class="table-responsive"><table class="table-futuristic"><thead><tr><th>ID</th><th>Origen</th><th>Destino</th><th>Fecha</th><th>Valor</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>';
    viajes.forEach(v => {
        let badgeClass = 'badge-pendiente';
        if (v.estado === 'Disponible') badgeClass = 'badge-disponible';
        else if (v.estado === 'Asignado' || v.estado === 'En ruta') badgeClass = 'badge-asignado';
        else if (v.estado === 'Finalizado') badgeClass = 'badge-finalizado';
        else if (v.estado === 'Cancelado') badgeClass = 'badge-cancelado';

        html += `<tr>
            <td style="font-family:var(--font-mono);color:var(--accent-cyan);font-weight:600">#${v.id}</td>
            <td style="color:var(--text-primary);font-weight:500">${v.origen}</td>
            <td style="color:var(--text-primary);font-weight:500">${v.destino}</td>
            <td>${formatDate(v.fecha)} ${v.hora || ''}</td>
            <td style="font-family:var(--font-mono);color:var(--accent-success);font-weight:700">${formatCurrency(v.valor)}</td>
            <td><span class="badge-futuristic ${badgeClass}">${v.estado}</span></td>
            <td>
                <button class="btn-futuristic btn-outline-futuristic btn-sm" onclick="editarViaje('${v.id}')" style="padding:4px 8px;font-size:0.7rem"><span>✏️</span></button>
                <button class="btn-futuristic btn-danger-futuristic btn-sm" onclick="eliminarViaje('${v.id}')" style="padding:4px 8px;font-size:0.7rem"><span>🗑️</span></button>
                ${v.estado === 'Disponible' || v.estado === 'Con postulantes' ? `<button class="btn-futuristic btn-success-futuristic btn-sm" onclick="abrirAsignar('${v.id}')" style="padding:4px 8px;font-size:0.7rem"><span>👤</span></button>` : ''}
            </td>
        </tr>`;
    });
    html += '</tbody></table></div>';
    container.innerHTML = html;
}

function abrirCrearViaje() {
    viajeEditandoId = null;
    document.getElementById('viajeModalTitle').textContent = 'Nuevo viaje';
    document.getElementById('viajeForm').reset();
    document.getElementById('viajeId').value = '';
    // Fecha por defecto: hoy
    const hoy = new Date().toISOString().split('T')[0];
    document.getElementById('viajeFecha').value = hoy;
    const modal = new bootstrap.Modal(document.getElementById('viajeModal'));
    modal.show();
}

function editarViaje(id) {
    const viaje = viajesData.find(v => v.id === id);
    if (!viaje) return;
    viajeEditandoId = id;
    document.getElementById('viajeModalTitle').textContent = 'Editar viaje';
    document.getElementById('viajeId').value = id;
    document.getElementById('viajeOrigen').value = viaje.origen || '';
    document.getElementById('viajeDestino').value = viaje.destino || '';
    document.getElementById('viajeFecha').value = viaje.fecha || '';
    document.getElementById('viajeHora').value = viaje.hora || '';
    document.getElementById('viajeEmpresa').value = viaje.empresa || '';
    document.getElementById('viajeTipo').value = viaje.tipoVehiculo || 'Carro';
    document.getElementById('viajeValor').value = viaje.valor || '';
    document.getElementById('viajePeso').value = viaje.peso || '';
    document.getElementById('viajeDescripcion').value = viaje.descripcion || '';
    const modal = new bootstrap.Modal(document.getElementById('viajeModal'));
    modal.show();
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('btnGuardarViaje').addEventListener('click', async function() {
        const form = document.getElementById('viajeForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        const data = {
            origen: document.getElementById('viajeOrigen').value,
            destino: document.getElementById('viajeDestino').value,
            fecha: document.getElementById('viajeFecha').value,
            hora: document.getElementById('viajeHora').value,
            empresa: document.getElementById('viajeEmpresa').value,
            tipoVehiculo: document.getElementById('viajeTipo').value,
            valor: parseFloat(document.getElementById('viajeValor').value),
            peso: parseFloat(document.getElementById('viajePeso').value) || 0,
            descripcion: document.getElementById('viajeDescripcion').value
        };
        const id = document.getElementById('viajeId').value;
        try {
            let result;
            if (id) {
                // Editar
                data.id = id;
                result = await editarViajeAdmin(data);
            } else {
                result = await crearViajeAdmin(data);
            }
            if (result.success) {
                showToast(result.message, 'success');
                bootstrap.Modal.getInstance(document.getElementById('viajeModal')).hide();
                await cargarViajesAdmin();
            } else {
                showToast(result.message, 'error');
            }
        } catch (error) {
            showToast('Error al guardar viaje', 'error');
        }
    });
});

async function eliminarViaje(id) {
    confirmAction('Eliminar viaje', '¿Estás seguro de que deseas eliminar este viaje? Esta acción no se puede deshacer.', async () => {
        try {
            const result = await eliminarViajeAdmin(id);
            if (result.success) {
                showToast(result.message, 'success');
                await cargarViajesAdmin();
            } else {
                showToast(result.message, 'error');
            }
        } catch (error) {
            showToast('Error al eliminar', 'error');
        }
    }, 'Eliminar', 'Cancelar');
}

async function abrirAsignar(idViaje) {
    viajeAsignarId = idViaje;
    const select = document.getElementById('selectConductor');
    select.innerHTML = '<option value="">Cargando conductores...</option>';
    const modal = new bootstrap.Modal(document.getElementById('asignarModal'));
    modal.show();
    
    try {
        const result = await obtenerConductoresAprobados();
        if (result.success) {
            const conductores = result.data || [];
            if (conductores.length === 0) {
                select.innerHTML = '<option value="">No hay conductores aprobados disponibles</option>';
            } else {
                let html = '';
                conductores.forEach(c => {
                    html += `<option value="${c.id}">${c.nombre}</option>`;
                });
                select.innerHTML = html;
            }
        } else {
            select.innerHTML = '<option value="">Error al cargar conductores</option>';
            showToast('Error al cargar conductores: ' + result.message, 'error');
        }
    } catch (error) {
        select.innerHTML = '<option value="">Error de conexión</option>';
        showToast('Error de conexión al cargar conductores', 'error');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('btnAsignarConfirm').addEventListener('click', async function() {
        const conductorId = document.getElementById('selectConductor').value;
        if (!conductorId) {
            showToast('Selecciona un conductor', 'warning');
            return;
        }
        try {
            // Necesitas función asignarConductor en api.js
            const result = await asignarConductor(viajeAsignarId, conductorId);
            if (result.success) {
                showToast(result.message, 'success');
                bootstrap.Modal.getInstance(document.getElementById('asignarModal')).hide();
                await cargarViajesAdmin();
            } else {
                showToast(result.message, 'error');
            }
        } catch (error) {
            showToast('Error al asignar', 'error');
        }
    });
});
