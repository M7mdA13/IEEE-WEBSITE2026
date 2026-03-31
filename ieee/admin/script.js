document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    App.init();
});

const App = {
    init() {
        this.bindEvents();
        this.initSidebar();
        this.initModals();
        this.initTheme();
        this.initDataTables();
        this.initPasswordToggles();
    },

    bindEvents() {
        // Navigation functionality
        document.querySelectorAll('.sidebar-menu li').forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                const target = this.querySelector('a').getAttribute('href');
                if (target) {
                    window.location.href = target;
                }
            });
        });

        // Settings tab navigation
        document.querySelectorAll('.settings-menu li').forEach(tab => {
            tab.addEventListener('click', function() {
                const targetId = this.getAttribute('data-target');
                
                document.querySelectorAll('.settings-menu li').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.settings-panel').forEach(p => p.classList.remove('active'));
                
                this.classList.add('active');
                if (targetId) {
                    document.getElementById(targetId)?.classList.add('active');
                }
            });
        });
    },

    initSidebar() {
        const toggleMenu = document.querySelector('.toggle-menu');
        const sidebar = document.querySelector('.sidebar');
        const mainContent = document.querySelector('.main-content');
        
        if (toggleMenu && sidebar && mainContent) {
            toggleMenu.addEventListener('click', function() {
                sidebar.classList.toggle('active');
                mainContent.classList.toggle('full-width');
                localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('active'));
            });

            // Initialize sidebar state from localStorage
            const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
            if (isCollapsed) {
                sidebar.classList.add('active');
                mainContent.classList.add('full-width');
            }
        }

        // User Profile Dropdown
        const userProfile = document.querySelector('.user-profile');
        const dropdownMenu = document.querySelector('.dropdown-menu');
        
        if (userProfile && dropdownMenu) {
            userProfile.addEventListener('click', function(e) {
                e.stopPropagation();
                dropdownMenu.classList.toggle('show');
            });
            
            // Close dropdown when clicking outside
            document.addEventListener('click', function(e) {
                if (!userProfile.contains(e.target) && dropdownMenu.classList.contains('show')) {
                    dropdownMenu.classList.remove('show');
                }
            });
        }
    },

    initModals() {
        // Modal functionality
        document.querySelectorAll('[data-modal]').forEach(trigger => {
            trigger.addEventListener('click', function() {
                const modalId = this.getAttribute('data-modal');
                const modal = document.getElementById(modalId);
                if (modal) {
                    modal.style.display = 'flex';
                    document.body.style.overflow = 'hidden';
                }
            });
        });

        // Close modals
        document.querySelectorAll('.close-modal, .close-modal-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const modal = this.closest('.modal');
                if (modal) {
                    modal.style.display = 'none';
                    document.body.style.overflow = '';
                }
            });
        });

        // Close modal when clicking outside
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', function(e) {
                if (e.target === this) {
                    this.style.display = 'none';
                    document.body.style.overflow = '';
                }
            });
        });
    },

    initTheme() {
        const themeSwitch = document.getElementById('theme-switch');
        if (themeSwitch) {
            // Check for saved theme preference or respect OS preference
            const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
            const currentTheme = localStorage.getItem('theme');
            
            if (currentTheme === 'dark' || (!currentTheme && prefersDarkScheme.matches)) {
                document.body.setAttribute('data-theme', 'dark');
                themeSwitch.checked = true;
            }
            
            themeSwitch.addEventListener('change', function() {
                const theme = this.checked ? 'dark' : 'light';
                document.body.setAttribute('data-theme', theme);
                localStorage.setItem('theme', theme);
            });
        }
    },

    initDataTables() {
        if (typeof $ !== 'undefined' && $.fn.DataTable) {
            $('table').DataTable({
                responsive: true,
                language: {
                    search: "_INPUT_",
                    searchPlaceholder: "Search...",
                },
                dom: '<"top"f>rt<"bottom"lip><"clear">',
                pageLength: 25
            });
        }
    },

    initPasswordToggles() {
        document.querySelectorAll('.password-toggle').forEach(toggle => {
            toggle.addEventListener('click', function() {
                const inputId = this.getAttribute('onclick').match(/'([^']+)'/)[1];
                const input = document.getElementById(inputId);
                const icon = this.querySelector('i');
                
                if (input && icon) {
                    const isPassword = input.type === 'password';
                    input.type = isPassword ? 'text' : 'password';
                    icon.classList.toggle('fa-eye');
                    icon.classList.toggle('fa-eye-slash');
                }
            });
        });
    }
};

// Global utility functions
window.togglePassword = function(inputId) {
    const input = document.getElementById(inputId);
    if (input) {
        input.type = input.type === 'password' ? 'text' : 'password';
    }
};

window.confirmAction = function(message) {
    return confirm(message || 'Are you sure you want to perform this action?');
};