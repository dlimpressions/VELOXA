function showToast(message, type = 'info', duration = 4000) {
    let container = document.querySelector('.toast-container');
    if (!container) { container = document.createElement('div'); container.className = 'toast-container'; document.body.appendChild(container); }
    const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
    const toast = document.createElement('div');
    toast.className = `toast-futuristic ${type}`;
    toast.innerHTML = `<span style="font-size:1.2rem">${icons[type]}</span><span style="color:var(--text-primary);font-weight:500">${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => { toast.style.animation = 'slideOut 0.4s cubic-bezier(0.4,0,0.2,1) forwards'; setTimeout(() => toast.remove(), 400); }, duration);
}
function showLoading(elementId, message = 'Cargando...') {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.innerHTML = `<div class="empty-state"><div style="width:60px;height:60px;margin:0 auto 1rem;border:3px solid rgba(0,240,255,0.1);border-top-color:var(--accent-cyan);border-radius:50%;animation:spin 1s linear infinite"></div><p style="color:var(--text-secondary)">${message}</p></div>`;
}
function showEmpty(elementId, icon='📭', message='No hay datos disponibles') {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.innerHTML = `<div class="empty-state fade-in"><div class="empty-state-icon">${icon}</div><h5 style="color:var(--text-secondary);margin-bottom:0.5rem">${message}</h5><p style="color:var(--text-muted);font-size:0.9rem">Vuelve más tarde o intenta con otros filtros</p></div>`;
}
function showError(elementId, message) {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.innerHTML = `<div class="empty-state fade-in"><div class="empty-state-icon">⚠️</div><h5 style="color:var(--accent-danger);margin-bottom:0.5rem">Error de conexión</h5><p style="color:var(--text-muted);font-size:0.9rem">${message}</p><button class="btn-futuristic btn-outline-futuristic mt-3" onclick="location.reload()"><span>🔄 Reintentar</span></button></div>`;
}
function createModal(id, title, content, buttons=[]) {
    const existing = document.getElementById(id); if (existing) existing.remove();
    const modal = document.createElement('div'); modal.className = 'modal fade modal-futuristic'; modal.id = id; modal.tabIndex = -1;
    modal.innerHTML = `<div class="modal-dialog modal-dialog-centered"><div class="modal-content"><div class="modal-header"><h5 class="modal-title text-gradient">${title}</h5><button type="button" class="btn-close" data-bs-dismiss="modal"></button></div><div class="modal-body" style="color:var(--text-secondary)">${content}</div><div class="modal-footer">${buttons.map(btn => `<button type="button" class="btn-futuristic ${btn.class || 'btn-outline-futuristic'}" ${btn.dismiss ? 'data-bs-dismiss="modal"' : ''} ${btn.onclick ? `onclick="${btn.onclick}"` : ''}><span>${btn.text}</span></button>`).join('')}</div></div></div>`;
    document.body.appendChild(modal); return new bootstrap.Modal(modal);
}
function confirmAction(title, message, onConfirm, confirmText='Confirmar', cancelText='Cancelar') {
    const modal = createModal('confirmModal', title, message, [
        { text: cancelText, class: 'btn-outline-futuristic', dismiss: true },
        { text: confirmText, class: 'btn-primary-futuristic', onclick: `document.getElementById('confirmModal').dispatchEvent(new CustomEvent('confirmed'));` }
    ]);
    document.getElementById('confirmModal').addEventListener('confirmed', () => { onConfirm(); modal.hide(); setTimeout(() => document.getElementById('confirmModal').remove(), 300); });
    modal.show();
}
function formatCurrency(value) {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(value);
}
function formatDate(dateStr) {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('es-CO', { day: '2-digit', month: 'short', year: 'numeric' }).format(date);
}
const style = document.createElement('style');
style.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`;
document.head.appendChild(style);
