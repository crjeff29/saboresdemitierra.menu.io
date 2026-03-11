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

    // Intersection Observer for scroll-based collapsing
    const observerOptions = {
        root: null,
        // reduce bottom margin to detect last section earlier
        rootMargin: '-20% 0px -20% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const category = entry.target;
                // Only auto-expand if it's not already the active one
                if (category !== activeCategory) {
                    // immediately expand the new category
                    category.classList.remove('collapsed');
                    // collapse the old one after transition time
                    const old = activeCategory;
                    activeCategory = category;
                    if (old) {
                        setTimeout(() => {
                            old.classList.add('collapsed');
                        }, 800); // match CSS transition duration
                    }
                }
            }
        });
    }, observerOptions);

    // Observe all categories
    categories.forEach(category => {
        observer.observe(category);
    });

    // Additional scroll listener to handle very bottom of page (last category)
    window.addEventListener('scroll', () => {
        const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 10;
        if (nearBottom) {
            const last = categories[categories.length - 1];
            if (last && last !== activeCategory) {
                // expand last immediately and collapse old after delay
                last.classList.remove('collapsed');
                const old = activeCategory;
                activeCategory = last;
                if (old) {
                    setTimeout(() => {
                        old.classList.add('collapsed');
                    }, 800);
                }
            }
        }
    });
});