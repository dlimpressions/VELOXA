
document.addEventListener('DOMContentLoaded', async function() {
    if (!checkAuth()) return;
    updateUserName();
    const nombre = getConductorNombre();
    const inicial = nombre.charAt(0).toUpperCase();
    document.querySelectorAll('.user-initial').forEach(el => el.textContent = inicial);
    try {
        showLoading('actividadReciente', 'Cargando tu dashboard...');
        const result = await obtenerDashboard();
        if (result.success) {
            const data = result.data;
            animateValue('disponibles', 0, data.disponibles || 0, 1000);
            animateValue('aplicados', 0, data.aplicados || 0, 1000);
            animateValue('realizados', 0, data.realizados || 0, 1000);
            document.getElementById('comisionesPendientes').textContent = formatCurrency(data.comisionesPendientes || 0);
            document.getElementById('calificacion').textContent = data.calificacion || '-';
            document.getElementById('dineroGanado').textContent = formatCurrency(data.dineroGanado || 0);
            const calif = parseFloat(data.calificacion) || 0;
            const porcentaje = (calif / 5) * 100;
            setTimeout(() => { document.getElementById('calificacionBar').style.width = porcentaje + '%'; }, 500);
            cargarActividadReciente();
        } else {
            showError('actividadReciente', result.message);
        }
    } catch (error) {
        console.error(error);
        showError('actividadReciente', 'No se pudo cargar el dashboard');
    }
});
function animateValue(id, start, end, duration) {
    const obj = document.getElementById(id); if (!obj) return;
    const range = end - start;
    const minTimer = 50;
    let stepTime = Math.abs(Math.floor(duration / range));
    stepTime = Math.max(stepTime, minTimer);
    let startTime = new Date().getTime();
    let endTime = startTime + duration;
    let timer;
    function run() {
        let now = new Date().getTime();
        let remaining = Math.max((endTime - now) / duration, 0);
        let value = Math.round(end - (remaining * range));
        obj.textContent = value.toLocaleString();
        if (value == end) clearInterval(timer);
    }
    timer = setInterval(run, stepTime);
    run();
}
async function cargarActividadReciente() {
    const container = document.getElementById('actividadReciente');
    try {
        const result = await obtenerHistorial({ limite: 5 });
        if (result.success && result.data && result.data.length > 0) {
            let html = '';
            result.data.slice(0, 5).forEach(h => {
                html += `<div class="d-flex align-items-center p-3 mb-2" style="background:rgba(255,255,255,0.03);border-radius:12px;border-left:3px solid var(--accent-cyan)"><div style="flex:1"><div style="color:var(--text-primary);font-weight:600;font-size:0.9rem">Viaje #${h.id || 'N/A'}</div><div style="color:var(--text-secondary);font-size:0.8rem">${h.origen || '-'} → ${h.destino || '-'}</div></div><div style="text-align:right"><div style="color:var(--accent-success);font-weight:700;font-family:var(--font-mono)">${formatCurrency(h.valor || 0)}</div><div style="color:var(--text-muted);font-size:0.75rem">${formatDate(h.fecha)}</div></div></div>`;
            });
            container.innerHTML = html;
        } else {
            showEmpty('actividadReciente', '📭', 'No tienes actividad reciente');
        }
    } catch (e) {
        showEmpty('actividadReciente', '📭', 'No hay actividad para mostrar');
    }
}
