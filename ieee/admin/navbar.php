<nav class="top-navbar">
    <div class="toggle-menu">
        <i class="fas fa-bars"></i>
    </div>
    <div class="search-bar">
        <i class="fas fa-search"></i>
        <input type="text" placeholder="Search...">
    </div>
    <div class="navbar-right">
        <div class="theme-toggle">
            <input type="checkbox" id="theme-switch" class="theme-switch">
            <label for="theme-switch" class="switch-label">
                <i class="fas fa-sun"></i>
                <i class="fas fa-moon"></i>
                <span class="switch-ball"></span>
            </label>
        </div>
        <div class="notification">
            <i class="fas fa-bell"></i>
            <span class="notification-count">3</span>
        </div>
        <div class="user-profile">
            <img src="<?php echo $user['profile_image'] ? htmlspecialchars($user['profile_image']) : 'https://ui-avatars.com/api/?name=' . urlencode($_SESSION['user_name']); ?>" alt="User Profile">
            <div class="user-dropdown">
                <span class="user-name"><?php echo htmlspecialchars($_SESSION['user_name'] ?? 'Admin'); ?></span>
                <i class="fas fa-chevron-down"></i>
                <div class="dropdown-menu">
                    <a href="settings.php"><i class="fas fa-user"></i> Profile</a>
                    <a href="index.php?logout=1"><i class="fas fa-sign-out-alt"></i> Logout</a>
                </div>
            </div>
        </div>
    </div>
</nav>