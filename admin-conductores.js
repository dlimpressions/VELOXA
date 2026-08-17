// ============================================================
// admin-conductores.js - Gestión de conductores
// ============================================================

let conductorRechazarId = null;
let rechazoModal = null;

document.addEventListener('DOMContentLoaded', async function() {
    if (!checkAdmin()) return;
    updateUserName();
    updateUserInitial();
    await cargarPendientes();
    await cargarTodos();
});

async function cargarPendientes() {
    const container = document.getElementById('conductoresPendientesContainer');
    showLoading('conductoresPendientesContainer', 'Cargando solicitudes pendientes...');
    try {
        const result = await obtenerConductoresPendientes();
        if (result.success) {
            const conductores = result.data || [];
            if (conductores.length === 0) {
                showEmpty('conductoresPendientesContainer', '✅', 'No hay solicitudes pendientes de aprobación.');
                return;
            }
            let html = '<div class="table-responsive"><table class="table-futuristic"><thead><tr><th>Nombre</th><th>Cédula</th><th>Correo</th><th>Ciudad</th><th>Fecha registro</th><th>Acciones</th></tr></thead><tbody>';
            conductores.forEach(c => {
                html += `<tr><td style="color:var(--text-primary);font-weight:500">${c.nombre} ${c.apellido}</td><td>${c.cedula}</td><td>${c.email}</td><td>${c.ciudad}</td><td>${formatDate(c.fechaRegistro)}</td><td><button class="btn-futuristic btn-success-futuristic btn-sm" onclick="aprobarConductor('${c.id}')" style="padding:4px 12px;font-size:0.75rem"><span>✅</span></button> <button class="btn-futuristic btn-danger-futuristic btn-sm" onclick="abrirRechazo('${c.id}')" style="padding:4px 12px;font-size:0.75rem"><span>❌</span></button></td></tr>`;
            });
            html += '</tbody></table></div>';
            container.innerHTML = html;
        } else {
            showError('conductoresPendientesContainer', result.message);
        }
    } catch (error) {
        showError('conductoresPendientesContainer', 'Error al cargar pendientes');
    }
}

async function cargarTodos() {
    // Por simplicidad, usamos la misma función de obtener pendientes, pero podrías crear una función específica en api.js
    // Para no sobrecargar, usaremos obtenerConductoresPendientes (ya que todos los conductores no están implementados en el backend)
    // Si quieres ver todos, puedes extender la API. Por ahora mostramos un mensaje.
    const container = document.getElementById('todosConductoresContainer');
    container.innerHTML = `<div class="empty-state"><div class="empty-state-icon">👥</div><h5 style="color:var(--text-secondary);">Lista completa de conductores</h5><p style="color:var(--text-muted);">Puedes ver todos los conductores en la hoja de cálculo.</p></div>`;
}

function abrirRechazo(conductorId) {
    conductorRechazarId = conductorId;
    if (!rechazoModal) {
        rechazoModal = new bootstrap.Modal(document.getElementById('rechazoModal'));
    }
    document.getElementById('motivoRechazo').value = '';
    rechazoModal.show();
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('btnConfirmarRechazo').addEventListener('click', async function() {
        const motivo = document.getElementById('motivoRechazo').value.trim();
        if (!motivo) {
            showToast('Debes escribir un motivo de rechazo', 'warning');
            return;
        }
        rechazoModal.hide();
        await rechazarConductor(conductorRechazarId, motivo);
        await cargarPendientes();
    });
});

async function aprobarConductor(conductorId) {
    confirmAction('Aprobar conductor', '¿Confirmas que deseas aprobar a este conductor? Podrá acceder a la plataforma.', async () => {
        try {
            const result = await aprobarConductor(conductorId);
            if (result.success) {
                showToast(result.message, 'success');
                await cargarPendientes();
            } else {
                showToast(result.message, 'error');
            }
        } catch (error) {
            showToast('Error al aprobar', 'error');
        }
    }, 'Sí, aprobar', 'Cancelar');
}

async function rechazarConductor(conductorId, motivo) {
    try {
        const result = await rechazarConductor(conductorId, motivo);
        if (result.success) {
            showToast(result.message, 'success');
        } else {
            showToast(result.message, 'error');
        }
    } catch (error) {
        showToast('Error al rechazar', 'error');
    }
}
