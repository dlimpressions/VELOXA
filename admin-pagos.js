// ============================================================
// admin-pagos.js - Gestión de pagos
// ============================================================

document.addEventListener('DOMContentLoaded', async function() {
    if (!checkAdmin()) return;
    updateUserName();
    updateUserInitial();
    await cargarPagosAdmin();
});

async function cargarPagosAdmin() {
    const container = document.getElementById('pagosAdminContainer');
    showLoading('pagosAdminContainer', 'Cargando pagos pendientes...');
    try {
        const result = await obtenerPagosPendientes();
        if (result.success) {
            const pagos = result.data || [];
            if (pagos.length === 0) {
                showEmpty('pagosAdminContainer', '💳', 'No hay pagos pendientes de validación.');
                return;
            }
            let html = '<div class="table-responsive"><table class="table-futuristic"><thead><tr><th>ID Pago</th><th>Viaje</th><th>Conductor</th><th>Valor viaje</th><th>Comisión</th><th>Comprobante</th><th>Acciones</th></tr></thead><tbody>';
            pagos.forEach(p => {
                html += `<tr>
                    <td style="font-family:var(--font-mono);color:var(--accent-cyan);font-weight:600">#${p.id}</td>
                    <td>#${p.idViaje}</td>
                    <td style="color:var(--text-primary)">${p.conductorNombre || 'N/A'}</td>
                    <td style="font-family:var(--font-mono);color:var(--accent-success)">${formatCurrency(p.valorViaje)}</td>
                    <td style="font-family:var(--font-mono);color:var(--accent-warning)">${formatCurrency(p.comision)}</td>
                    <td><a href="${p.comprobante}" target="_blank" style="color:var(--accent-cyan);text-decoration:underline;">Ver comprobante</a></td>
                    <td>
                        <button class="btn-futuristic btn-success-futuristic btn-sm" onclick="validarPago('${p.id}', true)" style="padding:4px 12px;font-size:0.75rem"><span>✅ Aprobar</span></button>
                        <button class="btn-futuristic btn-danger-futuristic btn-sm" onclick="validarPago('${p.id}', false)" style="padding:4px 12px;font-size:0.75rem"><span>❌ Rechazar</span></button>
                    </td>
                </tr>`;
            });
            html += '</tbody></table></div>';
            container.innerHTML = html;
        } else {
            showError('pagosAdminContainer', result.message);
        }
    } catch (error) {
        showError('pagosAdminContainer', 'Error al cargar pagos');
    }
}

async function validarPago(idPago, aprobar) {
    const mensaje = aprobar ? '¿Confirmas que este pago es válido y deseas aprobarlo?' : '¿Estás seguro de que deseas rechazar este pago?';
    confirmAction('Validar pago', mensaje, async () => {
        try {
            const result = await validarPagoAdmin(idPago, aprobar);
            if (result.success) {
                showToast(result.message, 'success');
                await cargarPagosAdmin();
            } else {
                showToast(result.message, 'error');
            }
        } catch (error) {
            showToast('Error al validar pago', 'error');
        }
    }, aprobar ? 'Aprobar' : 'Rechazar', 'Cancelar');
}
