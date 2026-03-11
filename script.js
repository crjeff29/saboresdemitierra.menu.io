// Basic script for the restaurant landing page

let currentModal = null;

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
                const images = this.getAttribute('data-images').split(',').map(img => img.trim());
                showImageModal(images, this.querySelector('h3').textContent);
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

// Function to show image modal
function showImageModal(images, dishName) {
    // Close existing modal if any
    if (currentModal) {
        closeImageModal(currentModal);
    }

    // Create modal elements
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h2>${dishName}</h2>
            <div class="image-container">
                <img src="${images[0]}" alt="${dishName}" class="modal-image">
                ${images.length > 1 ? `
                    <button class="nav-btn prev-btn">&lt;</button>
                    <button class="nav-btn next-btn">&gt;</button>
                    <div class="image-counter">1 / ${images.length}</div>
                ` : ''}
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    currentModal = modal;

    // Modal functionality
    let currentImageIndex = 0;
    const modalImage = modal.querySelector('.modal-image');
    const prevBtn = modal.querySelector('.prev-btn');
    const nextBtn = modal.querySelector('.next-btn');
    const counter = modal.querySelector('.image-counter');

    function updateImage() {
        modalImage.src = images[currentImageIndex];
        if (counter) {
            counter.textContent = `${currentImageIndex + 1} / ${images.length}`;
        }
    }

    // Navigation functionality
    if (prevBtn && images.length > 1) {
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
            updateImage();
        });
    }

    if (nextBtn && images.length > 1) {
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            currentImageIndex = (currentImageIndex + 1) % images.length;
            updateImage();
        });
    }

    // Close modal handler
    const closeHandler = () => {
        closeImageModal(modal);
    };

    modal.querySelector('.close-modal').addEventListener('click', closeHandler);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeHandler();
        }
    });

    // Keyboard navigation
    const keyHandler = (e) => {
        if (!currentModal || currentModal !== modal) return;
        
        if (e.key === 'Escape') {
            closeHandler();
        } else if (e.key === 'ArrowLeft' && images.length > 1) {
            currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
            updateImage();
        } else if (e.key === 'ArrowRight' && images.length > 1) {
            currentImageIndex = (currentImageIndex + 1) % images.length;
            updateImage();
        }
    };

    document.addEventListener('keydown', keyHandler);
    modal.keyHandler = keyHandler;
}

function closeImageModal(modal) {
    if (!modal) return;
    
    // Remove keyboard listener
    if (modal.keyHandler) {
        document.removeEventListener('keydown', modal.keyHandler);
    }
    
    // Remove modal from DOM
    if (modal.parentNode) {
        modal.parentNode.removeChild(modal);
    }
    
    if (currentModal === modal) {
        currentModal = null;
    }
}