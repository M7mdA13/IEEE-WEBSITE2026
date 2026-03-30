<?php
require_once 'config.php';
require_once 'auth.php';

$auth = new Auth($db);

// Check if user is logged in, if not redirect to login page
if (!isLoggedIn()) {
    redirect('login.php');
}

// Logout logic
if (isset($_GET['logout'])) {
    $auth->logout();
    redirect('login.php');
}

// Get current user data
$userId = $_SESSION['user_id'];
$query = "SELECT * FROM users WHERE id = :id LIMIT 1";
$stmt = $db->prepare($query);
$stmt->bindParam(':id', $userId);
$stmt->execute();
$user = $stmt->fetch(PDO::FETCH_ASSOC);

// Get stats for dashboard
$stats = [];
$query = "SELECT COUNT(*) as total FROM members";
$stmt = $db->query($query);
$stats['members'] = $stmt->fetchColumn();

$query = "SELECT COUNT(*) as total FROM events";
$stmt = $db->query($query);
$stats['events'] = $stmt->fetchColumn();

$query = "SELECT COUNT(*) as total FROM partners";
$stmt = $db->query($query);
$stats['partners'] = $stmt->fetchColumn();

// Get recent events
$query = "SELECT * FROM events ORDER BY start_datetime DESC LIMIT 3";
$stmt = $db->query($query);
$recentEvents = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>IEEE MUST Student Branch - Admin Dashboard</title>
    <link rel="stylesheet" href="styles.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
    <div class="container">
        <!-- Sidebar -->
        <aside class="sidebar">
            <div class="sidebar-header">
                <img src="images/ieeelogo.png" alt="IEEE MUST Logo" class="logo">
                <h2>IEEE MUST</h2>
            </div>
            <ul class="sidebar-menu">
                <li class="active">
                    <a href="#"><i class="fas fa-tachometer-alt"></i> Dashboard</a>
                </li>
                <li>
                    <a href="events.php"><i class="fas fa-calendar-alt"></i> Events</a>
                </li>
                <li>
                    <a href="members.php"><i class="fas fa-users"></i> Members</a>
                </li>
                <li>
                    <a href="partners.php"><i class="fas fa-handshake"></i> Partners</a>
                </li>
                <li>
                    <a href="analytics.php"><i class="fas fa-chart-line"></i> Analytics</a>
                </li>
                <li>
                    <a href="settings.php"><i class="fas fa-cog"></i> Settings</a>
                </li>
            </ul>
        </aside>

        <!-- Main Content -->
        <main class="main-content">
            <!-- Top Navbar -->
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
                        <img src="https://randomuser.me/api/portraits/men/1.jpg" alt="User Profile">
                        <div class="user-dropdown">
                            <span class="user-name"><?php echo htmlspecialchars($user['first_name']); ?></span>
                            <i class="fas fa-chevron-down"></i>
                            <div class="dropdown-menu">
                                <a href="#" id="profile-link"><i class="fas fa-user"></i> Profile</a>
                                <a href="?logout=1"><i class="fas fa-sign-out-alt"></i> Logout</a>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <!-- Dashboard Content -->
            <div class="dashboard-content">
                <!-- Dashboard Overview Section -->
                <section id="dashboard-section" class="content-section active">
                    <h1>Dashboard Overview</h1>
                    
                    <!-- Stats Cards -->
                    <div class="stats-cards">
                        <div class="card members-card">
                            <div class="card-icon">
                                <i class="fas fa-users"></i>
                            </div>
                            <div class="card-info">
                                <h3>Total Members</h3>
                                <h2><?php echo $stats['members']; ?></h2>
                                <p><span class="positive">+12%</span> from last month</p>
                            </div>
                        </div>
                        
                        <div class="card events-card">
                            <div class="card-icon">
                                <i class="fas fa-calendar-alt"></i>
                            </div>
                            <div class="card-info">
                                <h3>Events Held</h3>
                                <h2><?php echo $stats['events']; ?></h2>
                                <p><span class="positive">+5</span> this year</p>
                            </div>
                        </div>
                        
                        <div class="card partners-card">
                            <div class="card-icon">
                                <i class="fas fa-handshake"></i>
                            </div>
                            <div class="card-info">
                                <h3>Partners</h3>
                                <h2><?php echo $stats['partners']; ?></h2>
                                <p><span class="positive">+3</span> new partners</p>
                            </div>
                        </div>
                        
                        <div class="card founded-card">
                            <div class="card-icon">
                                <i class="fas fa-flag"></i>
                            </div>
                            <div class="card-info">
                                <h3>Founded In</h3>
                                <h2>2011</h2>
                                <p><span class="neutral">12 years</span> of excellence</p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Recent Events Section -->
                    <div class="recent-section">
                        <div class="section-header">
                            <h2>Recent Events</h2>
                            <a href="#" class="view-all">View All</a>
                        </div>
                        <div class="events-list">
                            <?php foreach ($recentEvents as $event): ?>
                            <div class="event-item">
                                <div class="event-date">
                                    <span class="day"><?php echo date('d', strtotime($event['start_datetime'])); ?></span>
                                    <span class="month"><?php echo strtoupper(date('M', strtotime($event['start_datetime']))); ?></span>
                                </div>
                                <div class="event-details">
                                    <h3><?php echo htmlspecialchars($event['title']); ?></h3>
                                    <p><?php echo htmlspecialchars($event['description']); ?></p>
                                    <div class="event-meta">
                                        <span><i class="fas fa-map-marker-alt"></i> <?php echo htmlspecialchars($event['location']); ?></span>
                                        <span><i class="fas fa-users"></i> 120 Attendees</span>
                                    </div>
                                </div>
                                <div class="event-status <?php echo strtolower($event['status']); ?>">
                                    <span><?php echo ucfirst($event['status']); ?></span>
                                </div>
                            </div>
                            <?php endforeach; ?>
                        </div>
                    </div>
                </section>
                
                <!-- Other sections remain the same as in your original index.html -->
                <!-- ... -->
            </div>
        </main>
    </div>

    <script src="script.js"></script>
</body>
</html>