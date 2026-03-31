<?php
require_once 'config.php';

// Check authentication and permissions
if (!isLoggedIn()) {
    redirect('login.php');
}
if (!hasPermission('admin')) {
    die('You do not have permission to access this page');
}

// Initialize all variables with default values
$error = '';
$successMessage = '';
$events = [];
$eventData = [
    'id' => null,
    'title' => '',
    'description' => '',
    'start_datetime' => date('Y-m-d\TH:i'),
    'end_datetime' => date('Y-m-d\TH:i', strtotime('+2 hours')),
    'location' => '',
    'max_attendees' => '',
    'status' => 'planning',
    'image_path' => '',
    'register_link' => '',
    'agenda_link' => ''
];
$editId = null;
$filter = isset($_GET['filter']) ? sanitizeInput($_GET['filter']) : 'all';

// Generate CSRF token
$csrfToken = generateCsrfToken();

try {
    // Handle event deletion
 if (isset($_GET['delete'])) {
        try {
            $id = (int)$_GET['delete'];
            
            // Debug: Log received data
            error_log("Delete request received for ID: $id");
            error_log("CSRF Token: " . ($_GET['csrf_token'] ?? 'none'));
            
            // Get image path first
            $stmt = $db->prepare("SELECT image_path FROM events WHERE id = ?");
            $stmt->execute([$id]);
            $imagePath = $stmt->fetchColumn();
            
            // Delete the event
            $stmt = $db->prepare("DELETE FROM events WHERE id = ?");
            $result = $stmt->execute([$id]);
            
            if ($result && $stmt->rowCount() > 0) {
                // Delete associated image
                if ($imagePath && file_exists(UPLOAD_PATH . basename($imagePath))) {
                    unlink(UPLOAD_PATH . basename($imagePath));
                }
                $_SESSION['message'] = 'Event deleted successfully';
                error_log("Successfully deleted event ID: $id");
            } else {
                $_SESSION['error'] = 'Event not found or already deleted';
                error_log("Delete failed - no rows affected for ID: $id");
            }
            
            redirect('events.php');
            
        } catch (PDOException $e) {
            error_log("Database error during delete: " . $e->getMessage());
            $_SESSION['error'] = 'Database error during deletion';
            redirect('events.php');
        }
    }
    // If edit mode
    if (isset($_GET['edit'])) {
        $editId = (int)$_GET['edit'];
        $stmt = $db->prepare("SELECT * FROM events WHERE id = :id LIMIT 1");
        $stmt->bindParam(':id', $editId);
        $stmt->execute();
        $eventData = $stmt->fetch(PDO::FETCH_ASSOC) ?: $eventData;
        $eventData['start_datetime'] = date('Y-m-d\TH:i', strtotime($eventData['start_datetime']));
        $eventData['end_datetime'] = date('Y-m-d\TH:i', strtotime($eventData['end_datetime']));
    }

    // Handle form submission
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        if (!validateCsrfToken($_POST['csrf_token'] ?? '')) {
            die('CSRF token validation failed');
        }

        // Sanitize inputs
        $title = sanitizeInput($_POST['title'] ?? '');
        $description = sanitizeInput($_POST['description'] ?? '');
        $startDatetime = sanitizeInput($_POST['start_datetime'] ?? '');
        $endDatetime = sanitizeInput($_POST['end_datetime'] ?? '');
        $location = sanitizeInput($_POST['location'] ?? '');
        $maxAttendees = sanitizeInput($_POST['max_attendees'] ?? '');
        $status = sanitizeInput($_POST['status'] ?? 'planning');
        $registerLink = sanitizeInput($_POST['register_link'] ?? '');
        $agendaLink = sanitizeInput($_POST['agenda_link'] ?? '');
        $removeImage = isset($_POST['remove_image']);

        // Validate inputs
        $errors = [];
        if (empty($title)) $errors[] = 'Title is required';
        if (empty($description)) $errors[] = 'Description is required';
        if (empty($location)) $errors[] = 'Location is required';
        if (strtotime($endDatetime) <= strtotime($startDatetime)) {
            $errors[] = 'End date must be after start date';
        }
        if ($maxAttendees && (!is_numeric($maxAttendees) || $maxAttendees < 0)) {
            $errors[] = 'Max attendees must be a positive number';
        }
        if ($registerLink && !filter_var($registerLink, FILTER_VALIDATE_URL)) {
            $errors[] = 'Register link must be a valid URL';
        }
        if ($agendaLink && !filter_var($agendaLink, FILTER_VALIDATE_URL)) {
            $errors[] = 'Agenda link must be a valid URL';
        }

        // Handle file upload
        $imagePath = $editId ? ($eventData['image_path'] ?? '') : '';
        if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
            $file = $_FILES['image'];
            $allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
            $maxSize = 2 * 1024 * 1024; // 2MB

            if (!in_array($file['type'], $allowedTypes)) {
                $errors[] = 'Only JPEG, PNG, and GIF files are allowed';
            } elseif ($file['size'] > $maxSize) {
                $errors[] = 'File size must be less than 2MB';
            } else {
                $fileName = uniqid() . '_' . $file['name'];
                $targetPath = UPLOAD_PATH . $fileName;

                if (move_uploaded_file($file['tmp_name'], $targetPath)) {
                    if ($editId && $imagePath && file_exists(UPLOAD_PATH . basename($imagePath))) {
                        unlink(UPLOAD_PATH . basename($imagePath));
                    }
                    $imagePath = 'uploads/' . $fileName;
                } else {
                    $errors[] = 'Failed to upload image';
                }
            }
        } elseif ($removeImage && $editId && $imagePath) {
            if (file_exists(UPLOAD_PATH . basename($imagePath))) {
                unlink(UPLOAD_PATH . basename($imagePath));
            }
            $imagePath = '';
        }

        if (empty($errors)) {
            if (!empty($_POST['edit_id'])) {
                // Update existing event
                $editId = (int)$_POST['edit_id'];
                $query = "UPDATE events SET 
                            title = :title, 
                            description = :description, 
                            start_datetime = :start_datetime, 
                            end_datetime = :end_datetime, 
                            location = :location, 
                            max_attendees = :max_attendees, 
                            status = :status, 
                            image_path = :image_path,
                            register_link = :register_link,
                            agenda_link = :agenda_link
                          WHERE id = :id";
            } else {
                // Insert new event
                $query = "INSERT INTO events 
                            (title, description, start_datetime, end_datetime, location, max_attendees, status, image_path, register_link, agenda_link, created_by) 
                          VALUES 
                            (:title, :description, :start_datetime, :end_datetime, :location, :max_attendees, :status, :image_path, :register_link, :agenda_link, :created_by)";
            }

            $stmt = $db->prepare($query);
            $stmt->bindParam(':title', $title);
            $stmt->bindParam(':description', $description);
            $stmt->bindParam(':start_datetime', $startDatetime);
            $stmt->bindParam(':end_datetime', $endDatetime);
            $stmt->bindParam(':location', $location);
            $stmt->bindParam(':max_attendees', $maxAttendees);
            $stmt->bindParam(':status', $status);
            $stmt->bindParam(':image_path', $imagePath);
            $stmt->bindParam(':register_link', $registerLink);
            $stmt->bindParam(':agenda_link', $agendaLink);

            if (!empty($_POST['edit_id'])) {
                $stmt->bindParam(':id', $editId);
            } else {
                $stmt->bindParam(':created_by', $_SESSION['user_id']);
            }

            if ($stmt->execute()) {
                $_SESSION['message'] = !empty($_POST['edit_id']) ? 'Event updated successfully' : 'Event added successfully';
                redirect('events.php');
            } else {
                $error = 'Database error: ' . implode(' ', $stmt->errorInfo());
            }
        } else {
            $error = implode('<br>', $errors);
            // Preserve form data
            $eventData = [
                'id' => $_POST['edit_id'] ?? null,
                'title' => $title,
                'description' => $description,
                'start_datetime' => $startDatetime,
                'end_datetime' => $endDatetime,
                'location' => $location,
                'max_attendees' => $maxAttendees,
                'status' => $status,
                'image_path' => $imagePath,
                'register_link' => $registerLink,
                'agenda_link' => $agendaLink
            ];
        }
    }

    // Get all events with optional filtering
    $query = "SELECT e.*, u.first_name as creator_first, u.last_name as creator_last 
              FROM events e 
              LEFT JOIN users u ON e.created_by = u.id";
    if ($filter !== 'all') {
        $query .= " WHERE e.status = :filter";
    }
    $query .= " ORDER BY e.start_datetime DESC";

    $stmt = $db->prepare($query);
    if ($filter !== 'all') {
        $stmt->bindParam(':filter', $filter);
    }
    $stmt->execute();
    $events = $stmt->fetchAll(PDO::FETCH_ASSOC);

} catch (PDOException $e) {
    $error = 'Database error: ' . $e->getMessage();
}

// Check for session messages
if (isset($_SESSION['message'])) {
    $successMessage = $_SESSION['message'];
    unset($_SESSION['message']);
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Events Management - IEEE MUST</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        :root {
            --primary-color: #00629B; /* IEEE blue */
            --secondary-color: #FFA300; /* IEEE gold */
            --dark-color: #333;
            --light-color: #f8f9fa;
            --danger-color: #dc3545;
            --success-color: #28a745;
            --border-radius: 4px;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        body {
            background-color: #f5f5f5;
            color: var(--dark-color);
        }
        
        .container {
            display: flex;
            min-height: 100vh;
        }
        
        /* Sidebar styling */
        .sidebar {
            width: 250px;
            background-color: var(--primary-color);
            color: white;
            padding: 20px 0;
            box-shadow: 2px 0 5px rgba(0,0,0,0.1);
            position: fixed;
            height: 100%;
        }
        
        .sidebar-header {
            padding: 0 20px 20px;
            border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        
        .sidebar-header h2 {
            display: flex;
            align-items: center;
        }
        
        .sidebar-header h2 i {
            margin-right: 10px;
            color: var(--secondary-color);
        }
        
        .sidebar-menu {
            list-style: none;
            padding: 20px 0;
        }
        
        .sidebar-menu li {
            padding: 10px 20px;
            transition: all 0.3s;
        }
        
        .sidebar-menu li:hover {
            background-color: rgba(255,255,255,0.1);
        }
        
        .sidebar-menu li.active {
            background-color: var(--secondary-color);
        }
        
        .sidebar-menu li a {
            color: white;
            text-decoration: none;
            display: flex;
            align-items: center;
        }
        
        .sidebar-menu li a i {
            margin-right: 10px;
            width: 20px;
            text-align: center;
        }
        
        /* Main content area */
        .main-content {
            flex: 1;
            margin-left: 250px;
            padding: 20px;
        }
        
        .navbar {
            background-color: white;
            padding: 15px 20px;
            border-radius: var(--border-radius);
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            margin-bottom: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .user-info {
            display: flex;
            align-items: center;
        }
        
        .user-info img {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            margin-right: 10px;
        }
        
        /* Content styling */
        h1 {
            color: var(--primary-color);
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid var(--secondary-color);
        }
        
        h2 {
            color: var(--primary-color);
            margin: 20px 0 15px;
            font-size: 1.5rem;
        }
        
        /* Alert messages */
        .alert {
            padding: 10px 15px;
            border-radius: var(--border-radius);
            margin-bottom: 20px;
        }
        
        .alert-success {
            background-color: #d4edda;
            color: var(--success-color);
            border: 1px solid #c3e6cb;
        }
        
        .alert-danger {
            background-color: #f8d7da;
            color: var(--danger-color);
            border: 1px solid #f5c6cb;
        }
        
        /* Form styling */
        form {
            background-color: white;
            padding: 20px;
            border-radius: var(--border-radius);
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            margin-bottom: 30px;
        }
        
        label {
            display: block;
            margin-bottom: 5px;
            font-weight: 500;
            color: var(--dark-color);
        }
        
        input[type="text"],
        input[type="email"],
        input[type="password"],
        input[type="datetime-local"],
        input[type="number"],
        input[type="url"],
        input[type="file"],
        select,
        textarea {
            width: 100%;
            padding: 10px;
            margin-bottom: 15px;
            border: 1px solid #ddd;
            border-radius: var(--border-radius);
            font-size: 1rem;
        }
        
        input[type="text"]:focus,
        input[type="email"]:focus,
        input[type="password"]:focus,
        input[type="datetime-local"]:focus,
        input[type="number"]:focus,
        input[type="url"]:focus,
        select:focus,
        textarea:focus {
            outline: none;
            border-color: var(--primary-color);
            box-shadow: 0 0 0 2px rgba(0,98,155,0.2);
        }
        
        button, .btn {
            background-color: var(--primary-color);
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: var(--border-radius);
            cursor: pointer;
            font-size: 1rem;
            transition: background-color 0.3s;
        }
        
        button:hover, .btn:hover {
            background-color: #004f7c;
        }
        
        .btn-secondary {
            background-color: #6c757d;
        }
        
        .btn-secondary:hover {
            background-color: #5a6268;
        }
        
        .btn-danger {
            background-color: var(--danger-color);
        }
        
        .btn-danger:hover {
            background-color: #c82333;
        }
        
        /* Table styling */
        table {
            width: 100%;
            border-collapse: collapse;
            background-color: white;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            border-radius: var(--border-radius);
            overflow: hidden;
            margin-bottom: 30px;
        }
        
        th, td {
            padding: 12px 15px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        
        th {
            background-color: var(--primary-color);
            color: white;
            font-weight: 500;
        }
        
        tr:hover {
            background-color: #f5f5f5;
        }
        
        .actions a {
            color: var(--primary-color);
            margin-right: 10px;
            text-decoration: none;
        }
        
        .actions a:hover {
            text-decoration: underline;
        }
        
        .actions a.delete {
            color: var(--danger-color);
        }
        
        /* Event status badges */
        .status-badge {
            display: inline-block;
            padding: 3px 8px;
            border-radius: 12px;
            font-size: 0.8rem;
            font-weight: 500;
        }
        
        .status-planning {
            background-color: #6c757d;
            color: white;
        }
        
        .status-upcoming {
            background-color: #17a2b8;
            color: white;
        }
        
        .status-ongoing {
            background-color: #28a745;
            color: white;
        }
        
        .status-completed {
            background-color: #343a40;
            color: white;
        }
        
        /* Filter controls */
        .filter-controls {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }
        
        .filter-select {
            padding: 8px 12px;
            border-radius: var(--border-radius);
            border: 1px solid #ddd;
            background-color: white;
        }
        
        /* Responsive design */
        @media (max-width: 768px) {
            .container {
                flex-direction: column;
            }
            
            .sidebar {
                width: 100%;
                position: relative;
                height: auto;
            }
            
            .main-content {
                margin-left: 0;
            }
        }
        
        /* Form sections */
        .form-row {
            display: flex;
            flex-wrap: wrap;
            margin: 0 -10px;
        }
        
        .form-group {
            flex: 1;
            min-width: 200px;
            padding: 0 10px;
            margin-bottom: 15px;
        }
        
        /* Utility classes */
        .text-right {
            text-align: right;
        }
        
        .mb-4 {
            margin-bottom: 1.5rem;
        }
        
        .mt-4 {
            margin-top: 1.5rem;
        }
        
        .current-image {
            margin-bottom: 15px;
        }
        
        .current-image img {
            max-width: 100%;
            height: auto;
            border-radius: var(--border-radius);
        }
    </style>
</head>
<body>

<div class="container">
    <!-- Sidebar -->
    <aside class="sidebar">
        <div class="sidebar-header">
            <h2><i class="fas fa-bolt"></i> IEEE MUST</h2>
        </div>
        <ul class="sidebar-menu">
            <li><a href="index.php"><i class="fas fa-tachometer-alt"></i> Dashboard</a></li>
            <li class="active"><a href="events.php"><i class="fas fa-calendar-alt"></i> Events</a></li>
            <li><a href="members.php"><i class="fas fa-users"></i> Members</a></li>
            <li><a href="partners.php"><i class="fas fa-handshake"></i> Partners</a></li>
            <li><a href="analytics.php"><i class="fas fa-chart-bar"></i> Analytics</a></li>
            <li><a href="settings.php"><i class="fas fa-cog"></i> Settings</a></li>
        </ul>
    </aside>

    <!-- Main Content -->
    <main class="main-content">
        <!-- Navbar -->
        <nav class="navbar">
            <h3>Events Management</h3>
            <div class="user-info">
                <img src="https://via.placeholder.com/40" alt="User">
                <span>Admin User</span>
            </div>
        </nav>

        <!-- Messages -->
        <?php if ($successMessage): ?>
            <div class="alert alert-success"><?= htmlspecialchars($successMessage) ?></div>
        <?php endif; ?>

        <?php if ($error): ?>
            <div class="alert alert-danger"><?= htmlspecialchars($error) ?></div>
        <?php endif; ?>

        <!-- Add/Edit Form Section -->
        <section id="event-form-section">
            <h2><i class="fas fa-user-edit"></i> <?= $editId ? 'Edit Event' : 'Add New Event' ?></h2>
            <form method="POST" action="events.php" enctype="multipart/form-data">
                <input type="hidden" name="csrf_token" value="<?= htmlspecialchars($csrfToken) ?>">
                <?php if ($editId): ?>
                    <input type="hidden" name="edit_id" value="<?= $editId ?>">
                <?php endif; ?>

                <div class="form-group">
                    <label>Title *</label>
                    <input type="text" name="title" value="<?= htmlspecialchars($eventData['title']) ?>" required>
                </div>

                <div class="form-group">
                    <label>Description *</label>
                    <textarea name="description" rows="4" required><?= htmlspecialchars($eventData['description']) ?></textarea>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Start Date & Time *</label>
                        <input type="datetime-local" name="start_datetime" value="<?= htmlspecialchars($eventData['start_datetime']) ?>" required>
                    </div>
                    <div class="form-group">
                        <label>End Date & Time *</label>
                        <input type="datetime-local" name="end_datetime" value="<?= htmlspecialchars($eventData['end_datetime']) ?>" required>
                    </div>
                </div>

                <div class="form-group">
                    <label>Location *</label>
                    <input type="text" name="location" value="<?= htmlspecialchars($eventData['location']) ?>" required>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Max Attendees</label>
                        <input type="number" name="max_attendees" value="<?= htmlspecialchars($eventData['max_attendees']) ?>" min="0">
                    </div>
                    <div class="form-group">
                        <label>Status *</label>
                        <select name="status" required>
                            <option value="planning" <?= $eventData['status'] === 'planning' ? 'selected' : '' ?>>Planning</option>
                            <option value="upcoming" <?= $eventData['status'] === 'upcoming' ? 'selected' : '' ?>>Upcoming</option>
                            <option value="ongoing" <?= $eventData['status'] === 'ongoing' ? 'selected' : '' ?>>Ongoing</option>
                            <option value="completed" <?= $eventData['status'] === 'completed' ? 'selected' : '' ?>>Completed</option>
                        </select>
                    </div>
                </div>

                <div class="form-group">
                    <label>Event Image</label>
                    <?php if ($editId && $eventData['image_path']): ?>
                        <div class="current-image">
                            <img src="<?= htmlspecialchars($eventData['image_path']) ?>" alt="Current event image">
                            <label style="display: block; margin-top: 10px;">
                                <input type="checkbox" name="remove_image" value="1"> Remove current image
                            </label>
                        </div>
                    <?php endif; ?>
                    <input type="file" name="image" accept="image/jpeg,image/png,image/gif">
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Register Link</label>
                        <input type="url" name="register_link" value="<?= htmlspecialchars($eventData['register_link']) ?>" placeholder="https://example.com/register">
                    </div>
                    <div class="form-group">
                        <label>Agenda Link</label>
                        <input type="url" name="agenda_link" value="<?= htmlspecialchars($eventData['agenda_link']) ?>" placeholder="https://example.com/agenda">
                    </div>
                </div>

                <div class="text-right">
                    <button type="submit" name="save_event" class="btn">
                        <i class="fas fa-save"></i> <?= $editId ? 'Update' : 'Add' ?> Event
                    </button>
                    <?php if ($editId): ?>
                        <a href="events.php" class="btn btn-secondary">Cancel</a>
                    <?php endif; ?>
                </div>
            </form>
        </section>

        <!-- Events List Section -->
        <section id="events-list-section">
            <div class="filter-controls">
                <h2><i class="fas fa-calendar-alt"></i> All Events</h2>
                <div>
                    <form method="GET" class="filter-form">
                        <select name="filter" class="filter-select" onchange="this.form.submit()">
                            <option value="all" <?= $filter === 'all' ? 'selected' : '' ?>>All Events</option>
                            <option value="planning" <?= $filter === 'planning' ? 'selected' : '' ?>>Planning</option>
                            <option value="upcoming" <?= $filter === 'upcoming' ? 'selected' : '' ?>>Upcoming</option>
                            <option value="ongoing" <?= $filter === 'ongoing' ? 'selected' : '' ?>>Ongoing</option>
                            <option value="completed" <?= $filter === 'completed' ? 'selected' : '' ?>>Completed</option>
                        </select>
                    </form>
                </div>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Date & Time</th>
                        <th>Location</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
             <tbody>
    <?php foreach ($events as $event): ?>
        <tr>
            <td><?= htmlspecialchars($event['title']) ?></td>
            <td>
                <?= date('M j, Y g:i A', strtotime($event['start_datetime'])) ?><br>
                to <?= date('M j, Y g:i A', strtotime($event['end_datetime'])) ?>
            </td>
            <td><?= htmlspecialchars($event['location']) ?></td>
            <td>
                <span class="status-badge status-<?= $event['status'] ?>">
                    <?= ucfirst($event['status']) ?>
                </span>
            </td>
            <td class="actions">
                <a href="events.php?edit=<?= $event['id'] ?>" class="edit">
                    <i class="fas fa-edit"></i> Edit
                </a>
                <a href="events.php?delete=<?= $event['id'] ?>&csrf_token=<?= htmlspecialchars($csrfToken) ?>" 
                   onclick="return confirm('Are you sure you want to delete this event?')" class="delete">
                   <i class="fas fa-trash-alt"></i> Delete
                </a>
            </td>
        </tr>
    <?php endforeach; ?>
    <?php if (empty($events)): ?>
        <tr><td colspan="5" style="text-align: center;">No events found</td></tr>
    <?php endif; ?>
</tbody>
            </table>
        </section>
    </main>
</div>

<script>
    // Client-side form validation
    document.addEventListener('DOMContentLoaded', function() {
        const form = document.querySelector('form[action="events.php"]');
        if (form) {
            form.addEventListener('submit', function(e) {
                const startDate = new Date(form.querySelector('input[name="start_datetime"]').value);
                const endDate = new Date(form.querySelector('input[name="end_datetime"]').value);
                
                if (endDate <= startDate) {
                    e.preventDefault();
                    alert('End date must be after start date');
                    return false;
                }
                
                return true;
            });
        }
    });
</script>

</body>
</html>