function checkAuth() {
    const id = getConductorId();
    if (!id) { window.location.href = 'login.html'; return false; }
    return true;
}
function updateUserName() {
    const nombre = getConductorNombre();
    document.querySelectorAll('.user-name').forEach(el => el.textContent = nombre);
}
document.addEventListener('DOMContentLoaded', function() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            confirmAction('Cerrar sesión', '¿Estás seguro de que deseas salir de tu cuenta?', () => {
                clearSession();
                showToast('Sesión cerrada correctamente', 'info');
                setTimeout(() => { window.location.href = 'login.html'; }, 1000);
            }, 'Sí, salir', 'Cancelar');
        });
    }
    updateUserName();
});
