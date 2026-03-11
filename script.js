// Basic script for the restaurant landing page

document.addEventListener('DOMContentLoaded', function() {
    // Add functionality to menu dishes - only when mouse is inside
    const dishes = document.querySelectorAll('.dish');

    dishes.forEach(dish => {
        let clickEnabled = false;

        dish.addEventListener('mouseenter', function() {
            clickEnabled = true;
        });

        dish.addEventListener('mouseleave', function() {
            clickEnabled = false;
        });

        dish.addEventListener('click', function() {
            if (clickEnabled) {
                const name = this.querySelector('h3').textContent;
                alert(`Has seleccionado: ${name}`);
            }
        });
    });

    // Collapsible categories functionality
    const categories = document.querySelectorAll('.category');
    let activeCategory = null;

    categories.forEach((category, index) => {
        const h2 = category.querySelector('h2');

        // Initially collapse all categories except the first one
        if (index !== 0) {
            category.classList.add('collapsed');
        } else {
            activeCategory = category;
        }

        h2.addEventListener('click', function() {
            // If clicking on the active category, do nothing
            if (category === activeCategory) {
                return;
            }

            // Collapse the currently active category
            if (activeCategory) {
                activeCategory.classList.add('collapsed');
            }

            // Expand the clicked category
            category.classList.remove('collapsed');

            // Update active category
            activeCategory = category;
        });
    });
});