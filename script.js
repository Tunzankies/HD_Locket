document.addEventListener("DOMContentLoaded", () => {
    // Array of 10 fixed keys provided by the admin
    const VALID_KEYS = [
        "XG7Q1L9ZB4M5",
        "W8N2V6KJ0C3P",
        "T5D9X1B7Z4M8",
        "L0Q6W3N2C7KJ",
        "M9B1X5T4D8Z7",
        "KJ2C3W6N0LQ8",
        "B4M5X7T9D1ZQ",
        "N2C7KJ0LQ6W3",
        "D9X5T4M8B7Z1",
        "W3N2KJ0LQ6C7"
    ];

    // Elements
    const keyVerification = document.getElementById("keyVerification");
    const mainContent = document.getElementById("mainContent");
    const keyInput = document.getElementById("keyInput");
    const submitKeyBtn = document.getElementById("submitKey");
    const errorMessage = document.getElementById("errorMessage");

    // Check if access is already granted (stored in localStorage)
    if (localStorage.getItem("accessGranted") === "true") {
        keyVerification.style.display = "none";
        mainContent.style.display = "block";
    }

    // Handle key submission
    submitKeyBtn.addEventListener("click", () => {
        const enteredKey = keyInput.value.trim();

        // Check if the entered key matches any of the valid keys
        if (VALID_KEYS.includes(enteredKey)) {
            // Key is valid, show main content
            localStorage.setItem("accessGranted", "true"); // Persist access
            keyVerification.style.display = "none";
            mainContent.style.display = "block";
            errorMessage.textContent = "";
        } else {
            // Key is invalid, show error message
            errorMessage.textContent = "Key không đúng. Vui lòng thử lại hoặc liên hệ admin.";
            keyInput.value = ""; // Clear the input
        }
    });

    // Smooth scrolling for anchor links (once content is visible)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute("href")).scrollIntoView({
                behavior: "smooth"
            });
        });
    });

    // Image Zooming and Dragging Functionality
    const images = document.querySelectorAll(".image-gallery img");
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    document.body.appendChild(overlay);

    let isDragging = false;
    let startX, startY, translateX = 0, translateY = 0;
    let currentScale = 1;
    let lastWheelEventTime = 0;
    const WHEEL_DEBOUNCE_TIME = 50; // Debounce time in milliseconds

    images.forEach(img => {
        img.addEventListener("click", (e) => {
            if (isDragging) return;

            const isZoomed = img.classList.contains('zoomed');
            if (!isZoomed) {
                // Enter zoomed state
                img.classList.add('zoomed');
                overlay.style.display = 'block';
                currentScale = 1; // Reset scale
                translateX = 0; // Reset translation
                translateY = 0;
                img.dataset.scale = currentScale; // Store scale in dataset
                img.style.transform = `translate(${translateX}px, ${translateY}px) scale(${currentScale})`;
                img.style.left = `${window.innerWidth / 2 - img.offsetWidth / 2}px`; // Center horizontally
                img.style.top = `${window.innerHeight / 2 - img.offsetHeight / 2}px`; // Center vertically
            }
        });
    });

    // Handle dragging
    document.addEventListener('mousedown', (e) => {
        const zoomedImg = document.querySelector('.zoomed');
        if (zoomedImg && e.target === zoomedImg) {
            isDragging = true;
            startX = e.clientX - translateX;
            startY = e.clientY - translateY;
            zoomedImg.style.cursor = 'grabbing';
            zoomedImg.style.transition = 'none'; // Disable transition during drag
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        const zoomedImg = document.querySelector('.zoomed');
        if (zoomedImg) {
            translateX = e.clientX - startX;
            translateY = e.clientY - startY;
            zoomedImg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${currentScale})`;
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        const zoomedImg = document.querySelector('.zoomed');
        if (zoomedImg) {
            zoomedImg.style.cursor = 'grab';
            zoomedImg.style.transition = 'transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)';
        }
    });

    // Close zoom when clicking overlay
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            document.querySelectorAll('.zoomed').forEach(img => {
                img.classList.remove('zoomed');
                img.style.transform = 'none'; // Reset transform
                img.style.left = 'auto'; // Reset position
                img.style.top = 'auto';
                currentScale = 1; // Reset scale
                translateX = 0; // Reset translation
                translateY = 0;
            });
            overlay.style.display = 'none';
        }
    });

    // Zoom with scroll wheel (with debounce)
    document.addEventListener('wheel', (e) => {
        const zoomedImg = document.querySelector('.zoomed');
        if (!zoomedImg) return;

        e.preventDefault();

        // Debounce the wheel event
        const now = Date.now();
        if (now - lastWheelEventTime < WHEEL_DEBOUNCE_TIME) return;
        lastWheelEventTime = now;

        // Adjust scale based on scroll direction
        const delta = e.deltaY > 0 ? -0.05 : 0.05; // Smaller step for smoother zooming
        currentScale = Math.min(Math.max(0.5, currentScale + delta), 3); // Limit scale between 0.5 and 3
        zoomedImg.dataset.scale = currentScale; // Update scale in dataset
        zoomedImg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${currentScale})`;
    }, { passive: false });

    // Handle copy module (if applicable)
    document.querySelectorAll('.module-box').forEach(box => {
        const copyBtn = box.querySelector('.copy-btn');
        const successMsg = box.querySelector('.success-message');

        if (copyBtn && successMsg) {
            copyBtn.addEventListener('click', () => {
                const textToCopy = box.querySelector('p').textContent;
                navigator.clipboard.writeText(textToCopy)
                    .then(() => {
                        successMsg.style.display = 'block';
                        setTimeout(() => {
                            successMsg.style.display = 'none';
                        }, 2000);
                    })
                    .catch(err => {
                        console.error('Lỗi khi copy:', err);
                    });
            });
        }
    });
});