<?php
require_once 'config.php';

if (!isLoggedIn()) {
    redirect('login.php');
}

if (!isset($_GET['id'])) {
    redirect('events.php');
}

$eventId = $_GET['id'];

// Get event data
$query = "SELECT * FROM events WHERE id = :id LIMIT 1";
$stmt = $db->prepare($query);
$stmt->bindParam(':id', $eventId);
$stmt->execute();
$event = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$event) {
    redirect('events.php');
}

// Handle event update
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['update_event'])) {
    $title = sanitizeInput($_POST['title']);
    $description = sanitizeInput($_POST['description']);
    $startDatetime = sanitizeInput($_POST['start_datetime']);
    $endDatetime = sanitizeInput($_POST['end_datetime']);
    $location = sanitizeInput($_POST['location']);
    $maxAttendees = sanitizeInput($_POST['max_attendees']);
    $status = sanitizeInput($_POST['status']);
    
    // Handle file upload
    $imagePath = $event['image_path'];
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $file = $_FILES['image'];
        $fileName = uniqid() . '_' . $file['name'];
        $targetPath = UPLOAD_PATH . $fileName;
        
        if (move_uploaded_file($file['tmp_name'], $targetPath)) {
            // Delete old image if exists
            if ($imagePath && file_exists(UPLOAD_PATH . basename($imagePath))) {
                unlink(UPLOAD_PATH . basename($imagePath));
            }
            $imagePath = 'uploads/' . $fileName;
        }
    }
    
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
    $stmt = $db->prepare($query);
    
    $stmt->bindParam(':title', $title);
    $stmt->bindParam(':description', $description);
    $stmt->bindParam(':start_datetime', $startDatetime);
    $stmt->bindParam(':end_datetime', $endDatetime);
    $stmt->bindParam(':location', $location);
    $stmt->bindParam(':max_attendees', $maxAttendees);
    $stmt->bindParam(':status', $status);
    $stmt->bindParam(':image_path', $imagePath);
    $stmt->bindParam(':id', $eventId);
    
    if ($stmt->execute()) {
        $_SESSION['message'] = 'Event updated successfully';
        redirect('events.php');
    } else {
        $error = 'Failed to update event';
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Edit Event - IEEE MUST Student Branch</title>
    <link rel="stylesheet" href="styles.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
    <div class="container">
        <!-- Include sidebar and navbar from index.php -->
        
        <main class="main-content">
            <section class="content-section">
                <h1>Edit Event</h1>
                
                <?php if (isset($error)): ?>
                    <div class="alert alert-danger"><?php echo $error; ?></div>
                <?php endif; ?>
                
                <form method="POST" enctype="multipart/form-data" class="event-form">
                    <div class="form-group">
                        <label for="title">Event Title</label>
                        <input type="text" id="title" name="title" value="<?php echo htmlspecialchars($event['title']); ?>" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="description">Description</label>
                        <textarea id="description" name="description" rows="4" required><?php echo htmlspecialchars($event['description']); ?></textarea>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="start_datetime">Start Date & Time</label>
                            <input type="datetime-local" id="start_datetime" name="start_datetime" 
                                   value="<?php echo date('Y-m-d\TH:i', strtotime($event['start_datetime'])); ?>" required>
                        </div>
                        <div class="form-group">
                            <label for="end_datetime">End Date & Time</label>
                            <input type="datetime-local" id="end_datetime" name="end_datetime" 
                                   value="<?php echo date('Y-m-d\TH:i', strtotime($event['end_datetime'])); ?>" required>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="location">Location</label>
                        <input type="text" id="location" name="location" value="<?php echo htmlspecialchars($event['location']); ?>" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="max_attendees">Max Attendees</label>
                        <input type="number" id="max_attendees" name="max_attendees" value="<?php echo htmlspecialchars($event['max_attendees']); ?>">
                    </div>
                    
                    <div class="form-group">
                        <label for="status">Status</label>
                        <select id="status" name="status" required>
                            <option value="planning" <?php echo $event['status'] === 'planning' ? 'selected' : ''; ?>>Planning</option>
                            <option value="upcoming" <?php echo $event['status'] === 'upcoming' ? 'selected' : ''; ?>>Upcoming</option>
                            <option value="ongoing" <?php echo $event['status'] === 'ongoing' ? 'selected' : ''; ?>>Ongoing</option>
                            <option value="completed" <?php echo $event['status'] === 'completed' ? 'selected' : ''; ?>>Completed</option>
                            <option value="cancelled" <?php echo $event['status'] === 'cancelled' ? 'selected' : ''; ?>>Cancelled</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="image">Event Image</label>
                        <?php if ($event['image_path']): ?>
                        <div class="current-image">
                            <img src="<?php echo htmlspecialchars($event['image_path']); ?>" alt="Current Event Image" style="max-width: 200px; display: block; margin-bottom: 10px;">
                            <label>
                                <input type="checkbox" name="remove_image" value="1"> Remove current image
                            </label>
                        </div>
                        <?php endif; ?>
                        <input type="file" id="image" name="image" accept="image/*">
                    </div>
                    
                    <div class="form-actions">
                        <button type="submit" name="update_event" class="btn-save">Update Event</button>
                        <a href="events.php" class="btn-cancel">Cancel</a>
                    </div>
                </form>
            </section>
        </main>
    </div>

    <script src="script.js"></script>
</body>
</html>