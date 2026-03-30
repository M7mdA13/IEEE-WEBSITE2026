document.addEventListener('DOMContentLoaded', function() {
    // Sidebar toggle functionality
    const toggleMenu = document.querySelector('.toggle-menu');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    
    if (toggleMenu) {
        toggleMenu.addEventListener('click', function() {
            sidebar.classList.toggle('active');
            mainContent.classList.toggle('full-width');
        });
    }
    
    // User Profile Dropdown
    const userProfile = document.querySelector('.user-profile');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    
    if (userProfile && dropdownMenu) {
        userProfile.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent event from bubbling up
            dropdownMenu.classList.toggle('show');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!userProfile.contains(e.target) && dropdownMenu.classList.contains('show')) {
                dropdownMenu.classList.remove('show');
            }
        });
    }
    
    // Theme toggle functionality
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
    
    // Navigation functionality
    const menuItems = document.querySelectorAll('.sidebar-menu li');
    const sections = document.querySelectorAll('.content-section');
    
    menuItems.forEach((item, index) => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            menuItems.forEach(i => i.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            
            this.classList.add('active');
            sections[index]?.classList.add('active');
        });
    });
    
    // Settings tab navigation
    const settingsTabs = document.querySelectorAll('.settings-menu li');
    const settingsPanels = document.querySelectorAll('.settings-panel');
    
    settingsTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            
            settingsTabs.forEach(t => t.classList.remove('active'));
            settingsPanels.forEach(p => p.classList.remove('active'));
            
            this.classList.add('active');
            document.getElementById(targetId)?.classList.add('active');
        });
    });
    
    // Modal functionality
    const modalTriggers = document.querySelectorAll('[data-modal]');
    const modals = document.querySelectorAll('.modal');
    const closeBtns = document.querySelectorAll('.close-modal');
    
    function closeModal(modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
    
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', function() {
            const modal = document.getElementById(this.getAttribute('data-modal'));
            if (modal) {
                modal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            }
        });
    });
    
    closeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            closeModal(this.closest('.modal'));
        });
    });
    
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal(this);
            }
        });
    });
    
    // Tab functionality in modals
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            this.classList.add('active');
            document.getElementById(tabId)?.classList.add('active');
        });
    });
    
    // Password toggle functionality
    function togglePassword(inputId) {
        const input = document.getElementById(inputId);
        const icon = input.nextElementSibling.querySelector('i');
        
        if (input && icon) {
            const type = input.type === 'password' ? 'text' : 'password';
            input.type = type;
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
        }
    }
    
    // Make togglePassword function globally available
    window.togglePassword = togglePassword;

    // Initialize DataTables for tables
    $('table').DataTable({
        responsive: true,
        language: {
            search: "_INPUT_",
            searchPlaceholder: "Search...",
        }
    });

    // Form validation
    $('form').on('submit', function(e) {
        let valid = true;
        $(this).find('[required]').each(function() {
            if (!$(this).val()) {
                $(this).addClass('error');
                valid = false;
            } else {
                $(this).removeClass('error');
            }
        });
        
        if (!valid) {
            e.preventDefault();
            alert('Please fill all required fields');
        }
    });

    // Password strength indicator
    $('#new_password, #password').on('keyup', function() {
        const strength = checkPasswordStrength($(this).val());
        const indicator = $(this).next('.password-strength');
        
        if (!indicator.length) {
            $(this).after('<div class="password-strength"></div>');
        }
        
        indicator.removeClass('weak medium strong').addClass(strength).text(strength);
    });

    function checkPasswordStrength(password) {
        if (password.length < 8) return 'weak';
        if (password.length < 12) return 'medium';
        if (/[A-Z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) {
            return 'strong';
        }
        return 'medium';
    }
});

// Make functions available globally
function togglePassword(inputId) {
    const passwordInput = document.getElementById(inputId);
    const icon = document.querySelector(`#${inputId} + .password-toggle i`);
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

function confirmAction(message) {
    return confirm(message || 'Are you sure you want to perform this action?');
}