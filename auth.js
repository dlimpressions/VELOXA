// ============================================================
// AUTENTICACIÓN Y VERIFICACIÓN DE SESIÓN
// ============================================================

function checkAuth() {
    const id = getConductorId();
    if (!id) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

function checkAdmin() {
    if (!checkAuth()) return false;
    if (!isAdmin()) {
        showToast('No tienes permisos de administrador', 'error');
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 2000);
        return false;
    }
    return true;
}

function updateUserName() {
    const nombre = getConductorNombre();
    document.querySelectorAll('.user-name').forEach(el => el.textContent = nombre);
}

function updateUserInitial() {
    const nombre = getConductorNombre();
    const inicial = nombre.charAt(0).toUpperCase();
    document.querySelectorAll('.user-initial').forEach(el => el.textContent = inicial);
}

document.addEventListener('DOMContentLoaded', function() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            confirmAction('Cerrar sesión', '¿Estás seguro de que deseas salir?', () => {
                clearSession();
                showToast('Sesión cerrada correctamente', 'info');
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 1000);
            }, 'Sí, salir', 'Cancelar');
        });
    }
    updateUserName();
    updateUserInitial();
});
