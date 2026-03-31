// Mobile menu functionality
const hamburger = document.querySelector('.hamburger');
const navContainer = document.querySelector('.nav-container');

hamburger.addEventListener('click', () => {
    navContainer.classList.toggle('active');
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('nav')) {
        navContainer.classList.remove('active');
    }
});

// Committee toggle functionality
const toggleBtns = document.querySelectorAll('.toggle-btn');
const toggleBackground = document.querySelector('.toggle-background');
const committeeCards = document.querySelectorAll('.committee-card');

// Initialize the first toggle button and non-technical committees as active
toggleBtns[0].classList.add('active');
document.querySelectorAll('.committee-card.non-technical').forEach(card => {
    card.classList.add('active');
});

// Set initial background position
toggleBackground.style.transform = 'translateX(0)';

// Hide technical committees initially with opacity
document.querySelectorAll('.committee-card.technical').forEach(card => {
    card.style.opacity = '0';
    card.style.display = 'none';
});

toggleBtns.forEach((btn, index) => {
    btn.addEventListener('click', () => {
        // Update toggle button states
        toggleBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Move background with smooth animation
        toggleBackground.style.transform = `translateX(${index * 100}%)`;

        // Show/hide appropriate cards with animation
        const type = btn.dataset.type;
        committeeCards.forEach(card => {
            if (card.classList.contains(type)) {
                // Show card
                card.style.display = 'block';
                // Use setTimeout to ensure display: block has taken effect
                setTimeout(() => {
                    card.style.opacity = '1';
                }, 50);
                card.classList.add('active');
            } else {
                // Hide card
                card.style.opacity = '0';
                card.classList.remove('active');
                // Wait for fade out before hiding
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    });
}); 


document.querySelectorAll('.committee-card[data-url]').forEach(card => {
    card.addEventListener('click', () => {
        const url = card.getAttribute('data-url');
        if (url) {
            window.location.href = url;
        }
    });
});
