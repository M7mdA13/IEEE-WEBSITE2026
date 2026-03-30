<?php
require_once 'config.php';

if (!isLoggedIn()) {
    redirect('login.php');
}

$userId = $_SESSION['user_id'];

// Get current user data
$query = "SELECT * FROM users WHERE id = :id LIMIT 1";
$stmt = $db->prepare($query);
$stmt->bindParam(':id', $userId);
$stmt->execute();
$user = $stmt->fetch(PDO::FETCH_ASSOC);

// Handle profile update
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['update_profile'])) {
    $firstName = sanitizeInput($_POST['first_name']);
    $lastName = sanitizeInput($_POST['last_name']);
    $email = sanitizeInput($_POST['email']);
    
    // Handle profile image upload
    $profileImage = $user['profile_image'];
    if (isset($_FILES['profile_image']) && $_FILES['profile_image']['error'] === UPLOAD_ERR_OK) {
        $file = $_FILES['profile_image'];
        $fileName = uniqid() . '_' . $file['name'];
        $targetPath = UPLOAD_PATH . $fileName;
        
        if (move_uploaded_file($file['tmp_name'], $targetPath)) {
            // Delete old image if exists
            if ($profileImage && file_exists(UPLOAD_PATH . basename($profileImage))) {
                unlink(UPLOAD_PATH . basename($profileImage));
            }
            $profileImage = 'uploads/' . $fileName;
        }
    }
    
    $query = "UPDATE users SET first_name = :first_name, last_name = :last_name, email = :email, profile_image = :profile_image WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':first_name', $firstName);
    $stmt->bindParam(':last_name', $lastName);
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':profile_image', $profileImage);
    $stmt->bindParam(':id', $userId);
    
    if ($stmt->execute()) {
        $_SESSION['user_name'] = $firstName . ' ' . $lastName;
        $_SESSION['user_email'] = $email;
        $_SESSION['message'] = 'Profile updated successfully';
        redirect('settings.php');
    } else {
        $error = 'Failed to update profile';
    }
}

// Handle password change
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['change_password'])) {
    $currentPassword = $_POST['current_password'];
    $newPassword = $_POST['new_password'];
    $confirmPassword = $_POST['confirm_password'];
    
    if (!verifyPassword($currentPassword, $user['password'])) {
        $error = 'Current password is incorrect';
    } elseif ($newPassword !== $confirmPassword) {
        $error = 'New passwords do not match';
    } elseif (strlen($newPassword) < 8) {
        $error = 'Password must be at least 8 characters';
    } else {
        $hashedPassword = hashPassword($newPassword);
        $query = "UPDATE users SET password = :password WHERE id = :id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':password', $hashedPassword);
        $stmt->bindParam(':id', $userId);
        
        if ($stmt->execute()) {
            $_SESSION['message'] = 'Password changed successfully';
            redirect('settings.php');
        } else {
            $error = 'Failed to change password';
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Settings - IEEE MUST Student Branch</title>
    <link rel="stylesheet" href="styles.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
    <div class="container">
        <!-- Include sidebar and navbar from index.php -->
        
        <main class="main-content">
            <!-- Settings Section -->
            <section id="settings-section" class="content-section">
                <h1>Settings</h1>
                
                <?php if (isset($_SESSION['message'])): ?>
                    <div class="alert alert-success"><?php echo $_SESSION['message']; unset($_SESSION['message']); ?></div>
                <?php endif; ?>
                
                <?php if (isset($error)): ?>
                    <div class="alert alert-danger"><?php echo $error; ?></div>
                <?php endif; ?>
                
                <div class="settings-container">
                    <aside class="settings-sidebar">
                        <ul class="settings-menu">
                            <li class="active" data-target="profile-settings">Profile Settings</li>
                            <li data-target="security-settings">Security</li>
                        </ul>
                    </aside>
                    <div class="settings-content">
                        <!-- Profile Settings -->
                        <div id="profile-settings" class="settings-panel active">
                            <h2>Profile Settings</h2>
                            <form class="settings-form" method="POST" enctype="multipart/form-data">
                                <div class="profile-upload">
                                    <div>
                                        <?php if ($user['profile_image']): ?>
                                        <img src="<?php echo htmlspecialchars($user['profile_image']); ?>" alt="Profile Image">
                                        <?php else: ?>
                                        <img src="https://ui-avatars.com/api/?name=<?php echo urlencode($user['first_name'] . '+' . $user['last_name']); ?>&size=100" alt="Profile Image">
                                        <?php endif; ?>
                                    </div>
                                    <div>
                                        <label for="profile_image" class="upload-btn">
                                            <i class="fas fa-camera"></i> Change Photo
                                        </label>
                                        <input type="file" id="profile_image" name="profile_image" accept="image/*" style="display: none;">
                                    </div>
                                </div>
                                
                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="first_name">First Name</label>
                                        <input type="text" id="first_name" name="first_name" value="<?php echo htmlspecialchars($user['first_name']); ?>" required>
                                    </div>
                                    <div class="form-group">
                                        <label for="last_name">Last Name</label>
                                        <input type="text" id="last_name" name="last_name" value="<?php echo htmlspecialchars($user['last_name']); ?>" required>
                                    </div>
                                </div>
                                
                                <div class="form-group">
                                    <label for="email">Email</label>
                                    <input type="email" id="email" name="email" value="<?php echo htmlspecialchars($user['email']); ?>" required>
                                </div>
                                
                                <div class="form-actions">
                                    <button type="submit" name="update_profile" class="btn-save">Save Changes</button>
                                </div>
                            </form>
                        </div>
                        
                        <!-- Security Settings -->
                        <div id="security-settings" class="settings-panel">
                            <h2>Security Settings</h2>
                            <form class="settings-form" method="POST">
                                <div class="form-group">
                                    <label for="current_password">Current Password</label>
                                    <input type="password" id="current_password" name="current_password" required>
                                </div>
                                
                                <div class="form-group">
                                    <label for="new_password">New Password</label>
                                    <input type="password" id="new_password" name="new_password" required>
                                </div>
                                
                                <div class="form-group">
                                    <label for="confirm_password">Confirm New Password</label>
                                    <input type="password" id="confirm_password" name="confirm_password" required>
                                </div>
                                
                                <div class="form-actions">
                                    <button type="submit" name="change_password" class="btn-save">Change Password</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    </div>

    <script src="script.js"></script>
    <script>
        // Settings tab navigation
        document.querySelectorAll('.settings-menu li').forEach(tab => {
            tab.addEventListener('click', function() {
                const targetId = this.getAttribute('data-target');
                
                document.querySelectorAll('.settings-menu li').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.settings-panel').forEach(p => p.classList.remove('active'));
                
                this.classList.add('active');
                document.getElementById(targetId).classList.add('active');
            });
        });
    </script>
</body>
</html>