// Script básico para la landing del restaurante

document.addEventListener('DOMContentLoaded', function() {
    // Agregar funcionalidad a los platos del menú
    const platos = document.querySelectorAll('.plato');

    platos.forEach(plato => {
        plato.addEventListener('click', function() {
            const nombre = this.querySelector('h3').textContent;
            alert(`Has seleccionado: ${nombre}`);
        });
    });
});