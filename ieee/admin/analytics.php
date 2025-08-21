<?php
require_once 'config.php';
require_once 'auth.php';

$auth = new Auth($db);
if (!isLoggedIn()) {
    redirect('login.php');
}

$error = '';
$memberGrowth = [];
$eventAttendance = [];

try {
    // Get member growth data (last 12 months)
    for ($i = 11; $i >= 0; $i--) {
        $month = date('Y-m', strtotime("-$i months"));
        $query = "SELECT COUNT(*) FROM members WHERE DATE_FORMAT(join_date, '%Y-%m') <= :month";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':month', $month);
        $stmt->execute();
        $memberGrowth[] = [
            'month' => date('M Y', strtotime($month . '-01')),
            'count' => (int)$stmt->fetchColumn()
        ];
    }

    // Get event attendance data
    $query = "SELECT e.title, COUNT(a.member_id) as attendees 
              FROM events e 
              LEFT JOIN event_attendees a ON e.id = a.event_id 
              WHERE e.status = 'completed'
              GROUP BY e.id 
              ORDER BY e.start_datetime DESC 
              LIMIT 10";
    $stmt = $db->query($query);
    $eventAttendance = $stmt->fetchAll(PDO::FETCH_ASSOC);

} catch (PDOException $e) {
    $error = 'Database error: ' . $e->getMessage();
    error_log($error);
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Analytics - IEEE MUST Student Branch</title>
    <link rel="stylesheet" href="styles.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
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
                <li>
                    <a href="index.php"><i class="fas fa-tachometer-alt"></i> Dashboard</a>
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
                <li class="active">
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
                            <span class="user-name"><?php echo htmlspecialchars($_SESSION['user_first_name'] ?? 'Admin'); ?></span>
                            <i class="fas fa-chevron-down"></i>
                            <div class="dropdown-menu">
                                <a href="#" id="profile-link"><i class="fas fa-user"></i> Profile</a>
                                <a href="?logout=1"><i class="fas fa-sign-out-alt"></i> Logout</a>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <!-- Analytics Section -->
            <section id="analytics-section" class="content-section">
                <h1>Analytics Dashboard</h1>
                
                <?php if ($error): ?>
                    <div class="alert alert-danger"><?php echo htmlspecialchars($error); ?></div>
                <?php endif; ?>

                <div class="analytics-cards">
                    <div class="analytics-card">
                        <h3>Member Growth</h3>
                        <div class="chart-container">
                            <canvas id="memberGrowthChart"></canvas>
                        </div>
                        <div class="chart-info">
                            <p><strong><?php echo end($memberGrowth)['count'] ?? 0; ?></strong> Total Members</p>
                            <p>
                                <?php 
                                $growthPercent = !empty($memberGrowth) && $memberGrowth[0]['count'] > 0 
                                    ? round((end($memberGrowth)['count'] - $memberGrowth[0]['count']) / $memberGrowth[0]['count'] * 100, 2) 
                                    : 'N/A';
                                echo $growthPercent !== 'N/A' 
                                    ? ($growthPercent > 0 ? "<span class='positive'>+$growthPercent%</span>" : "<span class='negative'>$growthPercent%</span>") . " over 12 months"
                                    : 'No growth data';
                                ?>
                            </p>
                        </div>
                    </div>
                    
                    <div class="analytics-card">
                        <h3>Event Attendance</h3>
                        <div class="chart-container">
                            <canvas id="eventAttendanceChart"></canvas>
                        </div>
                        <div class="chart-info">
                            <p><strong><?php echo array_sum(array_column($eventAttendance, 'attendees')) ?: 0; ?></strong> Total Attendees</p>
                            <p><?php echo count($eventAttendance) ?: 0; ?> Completed Events</p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    </div>

    <script src="script.js"></script>
    <script>
        // Member Growth Chart
        const memberGrowthCtx = document.getElementById('memberGrowthChart').getContext('2d');
        const memberGrowthChart = new Chart(memberGrowthCtx, {
            type: 'line',
            data: {
                labels: <?php echo json_encode(array_column($memberGrowth, 'month') ?: []); ?>,
                datasets: [{
                    label: 'Total Members',
                    data: <?php echo json_encode(array_column($memberGrowth, 'count') ?: []); ?>,
                    backgroundColor: 'rgba(0, 102, 153, 0.2)',
                    borderColor: 'rgba(0, 102, 153, 1)',
                    borderWidth: 2,
                    tension: 0.3,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        // Event Attendance Chart
        const eventAttendanceCtx = document.getElementById('eventAttendanceChart').getContext('2d');
        const eventAttendanceChart = new Chart(eventAttendanceCtx, {
            type: 'bar',
            data: {
                labels: <?php echo json_encode(array_column($eventAttendance, 'title') ?: []); ?>,
                datasets: [{
                    label: 'Attendees',
                    data: <?php echo json_encode(array_column($eventAttendance, 'attendees') ?: []); ?>,
                    backgroundColor: 'rgba(0, 153, 204, 0.7)',
                    borderColor: 'rgba(0, 102, 153, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    </script>
</body>
</html>