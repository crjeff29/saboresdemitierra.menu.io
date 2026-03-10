// Basic script for the restaurant landing page

document.addEventListener('DOMContentLoaded', function() {
    // Add functionality to menu dishes
    const dishes = document.querySelectorAll('.dish');

    dishes.forEach(dish => {
        dish.addEventListener('click', function() {
            const name = this.querySelector('h3').textContent;
            alert(`Has seleccionado: ${name}`);
        });
    });
});