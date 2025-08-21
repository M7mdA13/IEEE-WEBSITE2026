<aside class="sidebar">
    <div class="sidebar-header">
        <img src="images/ieeelogo.png" alt="IEEE MUST Logo" class="logo">
        <h2>IEEE MUST</h2>
    </div>
    <ul class="sidebar-menu">
        <li <?php echo basename($_SERVER['PHP_SELF']) === 'index.php' ? 'class="active"' : ''; ?>>
            <a href="index.php"><i class="fas fa-tachometer-alt"></i> Dashboard</a>
        </li>
        <li <?php echo basename($_SERVER['PHP_SELF']) === 'events.php' ? 'class="active"' : ''; ?>>
            <a href="events.php"><i class="fas fa-calendar-alt"></i> Events</a>
        </li>
        <li <?php echo basename($_SERVER['PHP_SELF']) === 'members.php' ? 'class="active"' : ''; ?>>
            <a href="members.php"><i class="fas fa-users"></i> Members</a>
        </li>
        <li <?php echo basename($_SERVER['PHP_SELF']) === 'partners.php' ? 'class="active"' : ''; ?>>
            <a href="partners.php"><i class="fas fa-handshake"></i> Partners</a>
        </li>
        <li <?php echo basename($_SERVER['PHP_SELF']) === 'analytics.php' ? 'class="active"' : ''; ?>>
            <a href="analytics.php"><i class="fas fa-chart-line"></i> Analytics</a>
        </li>
        <li <?php echo basename($_SERVER['PHP_SELF']) === 'settings.php' ? 'class="active"' : ''; ?>>
            <a href="settings.php"><i class="fas fa-cog"></i> Settings</a>
        </li>
    </ul>
</aside>