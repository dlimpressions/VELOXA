
document.addEventListener('DOMContentLoaded', async function() {
    if (!checkAuth()) return;
    await cargarPerfil();
    document.getElementById('perfilForm').addEventListener('submit', guardarPerfil);
});
async function cargarPerfil() {
    try {
        const result = await obtenerPerfil();
        if (result.success) {
            const p = result.data;
            document.querySelectorAll('.user-name').forEach(el => el.textContent = p.nombre || 'Conductor');
            document.getElementById('perfilAvatar').textContent = (p.nombre || 'C').charAt(0).toUpperCase();
            document.getElementById('perfilNombre').value = p.nombre || '';
            document.getElementById('perfilApellido').value = p.apellido || '';
            document.getElementById('perfilCedula').value = p.cedula || '';
            document.getElementById('perfilFechaNac').value = p.fechaNac || '';
            document.getElementById('perfilCiudad').value = p.ciudad || '';
            document.getElementById('perfilDireccion').value = p.direccion || '';
            document.getElementById('perfilEmail').value = p.email || '';
            document.getElementById('perfilCelular').value = p.celular || '';
            document.getElementById('perfilFoto').value = p.fotoPerfil || '';
            document.getElementById('perfilTipoVehiculo').value = p.tipoVehiculo || 'Carro';
            document.getElementById('perfilPlaca').value = p.placa || '';
            document.getElementById('perfilMarca').value = p.marca || '';
            document.getElementById('perfilModelo').value = p.modelo || '';
            document.getElementById('perfilBanco').value = p.banco || '';
            document.getElementById('perfilTipoCuenta').value = p.tipoCuenta || 'Ahorros';
            document.getElementById('perfilNumCuenta').value = p.numCuenta || '';
            document.getElementById('perfilTitular').value = p.titular || '';
            if (p.fechaRegistro) document.getElementById('fechaRegistro').textContent = formatDate(p.fechaRegistro);
        } else { showToast('Error al cargar el perfil: ' + result.message, 'error'); }
    } catch (error) { showToast('Error al cargar el perfil', 'error'); }
}
async function guardarPerfil(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<span>⏳ Guardando...</span>'; btn.disabled = true;
    const data = {
        nombre: document.getElementById('perfilNombre').value,
        apellido: document.getElementById('perfilApellido').value,
        cedula: document.getElementById('perfilCedula').value,
        fechaNac: document.getElementById('perfilFechaNac').value,
        ciudad: document.getElementById('perfilCiudad').value,
        direccion: document.getElementById('perfilDireccion').value,
        email: document.getElementById('perfilEmail').value,
        celular: document.getElementById('perfilCelular').value,
        fotoPerfil: document.getElementById('perfilFoto').value,
        tipoVehiculo: document.getElementById('perfilTipoVehiculo').value,
        placa: document.getElementById('perfilPlaca').value,
        marca: document.getElementById('perfilMarca').value,
        modelo: document.getElementById('perfilModelo').value,
        banco: document.getElementById('perfilBanco').value,
        tipoCuenta: document.getElementById('perfilTipoCuenta').value,
        numCuenta: document.getElementById('perfilNumCuenta').value,
        titular: document.getElementById('perfilTitular').value
    };
    try {
        const result = await actualizarPerfil(data);
        const msg = document.getElementById('perfilMessage');
        if (result.success) {
            showToast('Perfil actualizado correctamente', 'success');
            msg.innerHTML = `<div class="alert" style="background:rgba(0,255,136,0.1);border:1px solid rgba(0,255,136,0.3);color:var(--accent-success);border-radius:12px;padding:1rem">✅ ${result.message}</div>`;
            setConductorNombre(data.nombre); updateUserName();
        } else {
            showToast(result.message, 'error');
            msg.innerHTML = `<div class="alert" style="background:rgba(255,51,102,0.1);border:1px solid rgba(255,51,102,0.3);color:var(--accent-danger);border-radius:12px;padding:1rem">❌ ${result.message}</div>`;
        }
    } catch (error) { showToast('Error al actualizar el perfil', 'error'); }
    finally { btn.innerHTML = originalText; btn.disabled = false; }
}
