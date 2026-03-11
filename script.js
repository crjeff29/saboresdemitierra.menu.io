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

    // Touch/swipe functionality
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    let startTime = 0;

    function handleTouchStart(e) {
        if (images.length <= 1) return;
        startX = e.touches[0].clientX;
        currentX = startX;
        isDragging = true;
        startTime = Date.now();
        modalImage.style.transition = 'none';
    }

    function handleTouchMove(e) {
        if (!isDragging || images.length <= 1) return;
        currentX = e.touches[0].clientX;
        const diff = currentX - startX;
        modalImage.style.transform = `translateX(${diff}px)`;
    }

    function handleTouchEnd(e) {
        if (!isDragging || images.length <= 1) return;
        isDragging = false;
        modalImage.style.transition = 'transform 0.3s ease';

        const diff = currentX - startX;
        const timeDiff = Date.now() - startTime;
        const velocity = Math.abs(diff) / timeDiff;

        // If swipe is significant enough or fast enough
        if (Math.abs(diff) > 50 || velocity > 0.5) {
            if (diff > 0) {
                // Swipe right - previous image
                currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
            } else {
                // Swipe left - next image
                currentImageIndex = (currentImageIndex + 1) % images.length;
            }
        }

        modalImage.style.transform = 'translateX(0)';
        updateImage();
    }

    // Mouse drag functionality for desktop
    function handleMouseDown(e) {
        if (images.length <= 1) return;
        startX = e.clientX;
        currentX = startX;
        isDragging = true;
        startTime = Date.now();
        modalImage.style.transition = 'none';
        modalImage.style.cursor = 'grabbing';
        e.preventDefault();
    }

    function handleMouseMove(e) {
        if (!isDragging || images.length <= 1) return;
        currentX = e.clientX;
        const diff = currentX - startX;
        modalImage.style.transform = `translateX(${diff}px)`;
    }

    function handleMouseUp(e) {
        if (!isDragging || images.length <= 1) return;
        isDragging = false;
        modalImage.style.transition = 'transform 0.3s ease';
        modalImage.style.cursor = 'grab';

        const diff = currentX - startX;
        const timeDiff = Date.now() - startTime;
        const velocity = Math.abs(diff) / timeDiff;

        // If drag is significant enough or fast enough
        if (Math.abs(diff) > 50 || velocity > 0.5) {
            if (diff > 0) {
                // Drag right - previous image
                currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
            } else {
                // Drag left - next image
                currentImageIndex = (currentImageIndex + 1) % images.length;
            }
        }

        modalImage.style.transform = 'translateX(0)';
        updateImage();
    }

    // Add touch event listeners
    modalImage.addEventListener('touchstart', handleTouchStart, { passive: false });
    modalImage.addEventListener('touchmove', handleTouchMove, { passive: false });
    modalImage.addEventListener('touchend', handleTouchEnd, { passive: false });

    // Add mouse event listeners for desktop
    modalImage.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

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