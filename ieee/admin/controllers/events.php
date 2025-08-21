<?php
require_once 'config.php';

if (!isLoggedIn()) {
    redirect('login.php');
}

// CSRF Protection
$csrfToken = generateCsrfToken();

// Get all events with optional filtering
$filter = isset($_GET['filter']) ? sanitizeInput($_GET['filter']) : 'all';
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

// Handle event deletion
if (isset($_GET['delete']) && isAdmin()) {
    if (!validateCsrfToken($_GET['csrf_token'])) {
        die('CSRF token validation failed');
    }

    $id = (int)$_GET['delete'];
    
    // First get image path to delete file
    $query = "SELECT image_path FROM events WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $id);
    $stmt->execute();
    $imagePath = $stmt->fetchColumn();
    
    // Delete event
    $query = "DELETE FROM events WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $id);
    
    if ($stmt->execute()) {
        // Delete associated image file
        if ($imagePath && file_exists(UPLOAD_PATH . basename($imagePath))) {
            unlink(UPLOAD_PATH . basename($imagePath));
        }
        $_SESSION['message'] = 'Event deleted successfully';
        redirect('events.php');
    } else {
        $error = 'Failed to delete event';
    }
}

// Handle event addition/editing
$editId = null;
$eventData = [
    'title' => '',
    'description' => '',
    'start_datetime' => date('Y-m-d\TH:i'),
    'end_datetime' => date('Y-m-d\TH:i', strtotime('+2 hours')),
    'location' => '',
    'max_attendees' => '',
    'status' => 'planning',
    'image_path' => ''
];

if (isset($_GET['edit'])) {
    $editId = (int)$_GET['edit'];
    $query = "SELECT * FROM events WHERE id = :id LIMIT 1";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $editId);
    $stmt->execute();
    $eventData = $stmt->fetch(PDO::FETCH_ASSOC);
    $eventData['start_datetime'] = date('Y-m-d\TH:i', strtotime($eventData['start_datetime']));
    $eventData['end_datetime'] = date('Y-m-d\TH:i', strtotime($eventData['end_datetime']));
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!validateCsrfToken($_POST['csrf_token'])) {
        die('CSRF token validation failed');
    }

    $title = sanitizeInput($_POST['title']);
    $description = sanitizeInput($_POST['description']);
    $startDatetime = sanitizeInput($_POST['start_datetime']);
    $endDatetime = sanitizeInput($_POST['end_datetime']);
    $location = sanitizeInput($_POST['location']);
    $maxAttendees = sanitizeInput($_POST['max_attendees']);
    $status = sanitizeInput($_POST['status']);
    $removeImage = isset($_POST['remove_image']);

    // Validate inputs
    $errors = [];
    if (empty($title) || empty($description) || empty($location)) {
        $errors[] = 'Title, description and location are required';
    }
    if (strtotime($endDatetime) <= strtotime($startDatetime)) {
        $errors[] = 'End date must be after start date';
    }

    if (empty($errors)) {
        $imagePath = $editId ? $eventData['image_path'] : null;
        
        // Handle file upload
        if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
            $file = $_FILES['image'];
            $fileName = uniqid() . '_' . $file['name'];
            $targetPath = UPLOAD_PATH . $fileName;
            
            if (move_uploaded_file($file['tmp_name'], $targetPath)) {
                // Delete old image if exists
                if ($editId && $imagePath && file_exists(UPLOAD_PATH . basename($imagePath))) {
                    unlink(UPLOAD_PATH . basename($imagePath));
                }
                $imagePath = 'uploads/' . $fileName;
            }
        } elseif ($removeImage && $editId && $imagePath) {
            // Remove image if checkbox is checked
            if (file_exists(UPLOAD_PATH . basename($imagePath))) {
                unlink(UPLOAD_PATH . basename($imagePath));
            }
            $imagePath = null;
        }

        if ($editId) {
            // Update existing event
            $query = "UPDATE events SET 
                      title = :title, 
                      description = :description, 
                      start_datetime = :start_datetime, 
                      end_datetime = :end_datetime, 
                      location = :location, 
                      max_attendees = :max_attendees, 
                      status = :status, 
                      image_path = :image_path 
                      WHERE id = :id";
        } else {
            // Add new event
            $query = "INSERT INTO events 
                      (title, description, start_datetime, end_datetime, location, max_attendees, status, image_path, created_by) 
                      VALUES 
                      (:title, :description, :start_datetime, :end_datetime, :location, :max_attendees, :status, :image_path, :created_by)";
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
        
        if ($editId) {
            $stmt->bindParam(':id', $editId);
        } else {
            $stmt->bindParam(':created_by', $_SESSION['user_id']);
        }

        if ($stmt->execute()) {
            $_SESSION['message'] = $editId ? 'Event updated successfully' : 'Event added successfully';
            redirect('events.php');
        } else {
            $error = 'Database error: ' . $stmt->errorInfo()[2];
        }
    } else {
        $error = implode('<br>', $errors);
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Events - IEEE MUST Student Branch</title>
    <link rel="stylesheet" href="assets/css/styles.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
    <div class="container">
        <?php include 'includes/header.php'; ?>
        <?php include 'includes/sidebar.php'; ?>

        <main class="main-content">
            <section id="events-section" class="content-section">
                <h1>Events Management</h1>
                
                <?php if (isset($_SESSION['message'])): ?>
                    <div class="alert alert-success"><?= $_SESSION['message']; unset($_SESSION['message']); ?></div>
                <?php endif; ?>
                
                <?php if (isset($error)): ?>
                    <div class="alert alert-danger"><?= $error; ?></div>
                <?php endif; ?>

                <div class="section-header">
                    <h2>All Events</h2>
                    <div class="section-actions">
                        <button class="action-btn" id="add-event-btn">
                            <i class="fas fa-plus"></i> <?= $editId ? 'Update Event' : 'Add Event' ?>
                        </button>
                        <form method="get" class="filter-form">
                            <input type="hidden" name="csrf_token" value="<?= $csrfToken ?>">
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

                <div class="events-grid">
                    <?php foreach ($events as $event): ?>
                    <div class="event-card">
                        <?php if ($event['image_path']): ?>
                        <div class="event-image">
                            <img src="<?= htmlspecialchars($event['image_path']) ?>" alt="<?= htmlspecialchars($event['title']) ?>">
                        </div>
                        <?php endif; ?>
                        <div class="event-card-header">
                            <h3><?= htmlspecialchars($event['title']) ?></h3>
                            <div class="event-actions">
                                <i class="fas fa-ellipsis-v"></i>
                                <div class="actions-menu">
                                    <a href="events.php?edit=<?= $event['id'] ?>">Edit</a>
                                    <a href="events.php?delete=<?= $event['id'] ?>&csrf_token=<?= $csrfToken ?>" 
                                       onclick="return confirm('Are you sure?')">Delete</a>
                                </div>
                            </div>
                        </div>
                        <div class="event-card-body">
                            <p class="event-date">
                                <i class="fas fa-calendar-alt"></i> 
                                <?= date('M j, Y g:i A', strtotime($event['start_datetime'])) ?> - 
                                <?= date('M j, Y g:i A', strtotime($event['end_datetime'])) ?>
                            </p>
                            <p class="event-location">
                                <i class="fas fa-map-marker-alt"></i> <?= htmlspecialchars($event['location']) ?>
                            </p>
                            <div class="event-status <?= strtolower($event['status']) ?>">
                                <?= ucfirst($event['status']) ?>
                            </div>
                            <div class="event-description">
                                <?= nl2br(htmlspecialchars($event['description'])) ?>
                            </div>
                            <div class="event-creator">
                                <small>Created by: <?= htmlspecialchars($event['creator_first'] . ' ' . $event['creator_last']) ?></small>
                            </div>
                        </div>
                        <div class="event-card-footer">
                            <a href="event_details.php?id=<?= $event['id'] ?>" class="btn-details">View Details</a>
                        </div>
                    </div>
                    <?php endforeach; ?>
                </div>

                <!-- Add/Edit Event Modal -->
                <div class="modal" id="event-modal" style="display: <?= $editId ? 'flex' : 'none' ?>">
                    <div class="modal-content">
                        <span class="close-modal">&times;</span>
                        <h2><?= $editId ? 'Edit Event' : 'Add New Event' ?></h2>
                        
                        <form method="POST" enctype="multipart/form-data">
                            <input type="hidden" name="csrf_token" value="<?= $csrfToken ?>">
                            <?php if ($editId): ?>
                                <input type="hidden" name="edit_id" value="<?= $editId ?>">
                            <?php endif; ?>
                            
                            <div class="form-group">
                                <label for="title">Event Title *</label>
                                <input type="text" id="title" name="title" 
                                       value="<?= htmlspecialchars($eventData['title']) ?>" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="description">Description *</label>
                                <textarea id="description" name="description" rows="4" required><?= 
                                    htmlspecialchars($eventData['description']) ?></textarea>
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="start_datetime">Start Date & Time *</label>
                                    <input type="datetime-local" id="start_datetime" name="start_datetime" 
                                           value="<?= htmlspecialchars($eventData['start_datetime']) ?>" required>
                                </div>
                                <div class="form-group">
                                    <label for="end_datetime">End Date & Time *</label>
                                    <input type="datetime-local" id="end_datetime" name="end_datetime" 
                                           value="<?= htmlspecialchars($eventData['end_datetime']) ?>" required>
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label for="location">Location *</label>
                                <input type="text" id="location" name="location" 
                                       value="<?= htmlspecialchars($eventData['location']) ?>" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="max_attendees">Max Attendees</label>
                                <input type="number" id="max_attendees" name="max_attendees" 
                                       value="<?= htmlspecialchars($eventData['max_attendees']) ?>">
                            </div>
                            
                            <div class="form-group">
                                <label for="status">Status *</label>
                                <select id="status" name="status" required>
                                    <option value="planning" <?= $eventData['status'] === 'planning' ? 'selected' : '' ?>>Planning</option>
                                    <option value="upcoming" <?= $eventData['status'] === 'upcoming' ? 'selected' : '' ?>>Upcoming</option>
                                    <option value="ongoing" <?= $eventData['status'] === 'ongoing' ? 'selected' : '' ?>>Ongoing</option>
                                    <option value="completed" <?= $eventData['status'] === 'completed' ? 'selected' : '' ?>>Completed</option>
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label for="image">Event Image</label>
                                <?php if ($editId && $eventData['image_path']): ?>
                                <div class="current-image">
                                    <img src="<?= htmlspecialchars($eventData['image_path']) ?>" 
                                         alt="Current Event Image" style="max-width: 200px; margin-bottom: 10px;">
                                    <label>
                                        <input type="checkbox" name="remove_image" value="1"> Remove current image
                                    </label>
                                </div>
                                <?php endif; ?>
                                <input type="file" id="image" name="image" accept="image/*">
                            </div>
                            
                            <div class="form-actions">
                                <button type="submit" name="save_event" class="btn-save">
                                    <?= $editId ? 'Update Event' : 'Add Event' ?>
                                </button>
                                <button type="button" class="btn-cancel close-modal-btn">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </main>
    </div>

    <script src="assets/js/script.js"></script>
    <script>
        // Event modal handling
        document.getElementById('add-event-btn').addEventListener('click', function() {
            document.getElementById('event-modal').style.display = 'flex';
        });
        
        document.querySelectorAll('.close-modal, .close-modal-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                document.getElementById('event-modal').style.display = 'none';
                window.location.href = 'events.php';
            });
        });

        // Event action dropdowns
        document.querySelectorAll('.event-actions').forEach(actions => {
            actions.addEventListener('click', function(e) {
                e.stopPropagation();
                const menu = this.querySelector('.actions-menu');
                document.querySelectorAll('.actions-menu').forEach(m => {
                    if (m !== menu) m.style.display = 'none';
                });
                menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
            });
        });
        
        // Close dropdowns when clicking outside
        document.addEventListener('click', function() {
            document.querySelectorAll('.actions-menu').forEach(menu => {
                menu.style.display = 'none';
            });
        });
    </script>
</body>
</html>