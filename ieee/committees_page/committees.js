// Mobile menu functionality
const hamburger = document.querySelector('.hamburger');
const navContainer = document.querySelector('.nav-container');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navContainer.classList.toggle('active');
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('nav')) {
        navContainer.classList.remove('active');
        hamburger.classList.remove('open');
    }
});

// Close menu when clicking on a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navContainer.classList.remove('active');
        hamburger.classList.remove('open');
    });
});

// Sticky navbar on scroll
window.addEventListener('scroll', () => {
    const nav = document.querySelector('.main-head');
    if (window.scrollY > 50) {
        nav.classList.add('slidedown');
    } else {
        nav.classList.remove('slidedown');
    }
});

// Committee toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    const toggleBtns = document.querySelectorAll('.toggle-btn');
    const committeeCards = document.querySelectorAll('.committee-card');
    const toggleBackground = document.querySelector('.toggle-background');

    toggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const type = btn.getAttribute('data-type');
            
            // Update active button
            toggleBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Move toggle background
            if (type === 'technical') {
                toggleBackground.style.transform = 'translateX(100%)';
            } else {
                toggleBackground.style.transform = 'translateX(0)';
            }
            
            // Show/hide committee cards
            committeeCards.forEach(card => {
                if (type === 'all' || card.classList.contains(type)) {
                    card.style.display = 'block';
                    card.classList.add('active');
                } else {
                    card.style.display = 'none';
                    card.classList.remove('active');
                }
            });
        });
    });

    // Committee card navigation
    document.querySelectorAll('.view-details-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent event bubbling
            const card = button.closest('.committee-card');
            const url = card.getAttribute('data-url');
            if (url) {
                window.location.href = url;
            }
        });
    });
});
