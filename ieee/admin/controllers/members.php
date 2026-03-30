<?php
require_once 'config.php';

if (!isLoggedIn()) {
    redirect('login.php');
}

// CSRF Protection
$csrfToken = generateCsrfToken();

// Get all members with optional filtering
$filter = isset($_GET['filter']) ? sanitizeInput($_GET['filter']) : 'all';
$query = "SELECT * FROM members";
if ($filter !== 'all') {
    $query .= " WHERE membership_type = :filter";
}
$query .= " ORDER BY last_name, first_name";

$stmt = $db->prepare($query);
if ($filter !== 'all') {
    $stmt->bindParam(':filter', $filter);
}
$stmt->execute();
$members = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Handle member deletion
if (isset($_GET['delete']) && isAdmin()) {
    if (!validateCsrfToken($_GET['csrf_token'])) {
        die('CSRF token validation failed');
    }

    $id = (int)$_GET['delete'];
    $query = "DELETE FROM members WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $id);
    
    if ($stmt->execute()) {
        $_SESSION['message'] = 'Member deleted successfully';
        redirect('members.php');
    } else {
        $error = 'Failed to delete member';
    }
}

// Handle member addition/editing
$editId = null;
$memberData = [
    'first_name' => '',
    'last_name' => '',
    'email' => '',
    'phone' => '',
    'department' => '',
    'student_id' => '',
    'membership_type' => 'student'
];

if (isset($_GET['edit'])) {
    $editId = (int)$_GET['edit'];
    $query = "SELECT * FROM members WHERE id = :id LIMIT 1";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $editId);
    $stmt->execute();
    $memberData = $stmt->fetch(PDO::FETCH_ASSOC);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!validateCsrfToken($_POST['csrf_token'])) {
        die('CSRF token validation failed');
    }

    $firstName = sanitizeInput($_POST['first_name']);
    $lastName = sanitizeInput($_POST['last_name']);
    $email = sanitizeInput($_POST['email']);
    $phone = sanitizeInput($_POST['phone']);
    $department = sanitizeInput($_POST['department']);
    $studentId = sanitizeInput($_POST['student_id']);
    $membershipType = sanitizeInput($_POST['membership_type']);

    // Validate inputs
    $errors = [];
    if (empty($firstName) || empty($lastName) || empty($email)) {
        $errors[] = 'Name and email are required';
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = 'Invalid email format';
    }

    if (empty($errors)) {
        if ($editId) {
            // Update existing member
            $query = "UPDATE members SET 
                      first_name = :first_name, 
                      last_name = :last_name, 
                      email = :email, 
                      phone = :phone, 
                      department = :department, 
                      student_id = :student_id, 
                      membership_type = :membership_type 
                      WHERE id = :id";
        } else {
            // Add new member
            $query = "INSERT INTO members 
                      (first_name, last_name, email, phone, department, student_id, membership_type) 
                      VALUES 
                      (:first_name, :last_name, :email, :phone, :department, :student_id, :membership_type)";
        }

        $stmt = $db->prepare($query);
        $stmt->bindParam(':first_name', $firstName);
        $stmt->bindParam(':last_name', $lastName);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':phone', $phone);
        $stmt->bindParam(':department', $department);
        $stmt->bindParam(':student_id', $studentId);
        $stmt->bindParam(':membership_type', $membershipType);
        
        if ($editId) {
            $stmt->bindParam(':id', $editId);
        }

        if ($stmt->execute()) {
            $_SESSION['message'] = $editId ? 'Member updated successfully' : 'Member added successfully';
            redirect('members.php');
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
    <title>Members - IEEE MUST Student Branch</title>
    <link rel="stylesheet" href="assets/css/styles.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
    <div class="container">
        <?php include 'includes/header.php'; ?>
        <?php include 'includes/sidebar.php'; ?>

        <main class="main-content">
            <section id="members-section" class="content-section">
                <h1>Members Management</h1>
                
                <?php if (isset($_SESSION['message'])): ?>
                    <div class="alert alert-success"><?= $_SESSION['message']; unset($_SESSION['message']); ?></div>
                <?php endif; ?>
                
                <?php if (isset($error)): ?>
                    <div class="alert alert-danger"><?= $error; ?></div>
                <?php endif; ?>

                <div class="section-header">
                    <h2>All Members</h2>
                    <div class="section-actions">
                        <button class="action-btn" id="add-member-btn">
                            <i class="fas fa-plus"></i> <?= $editId ? 'Update Member' : 'Add Member' ?>
                        </button>
                        <form method="get" class="filter-form">
                            <input type="hidden" name="csrf_token" value="<?= $csrfToken ?>">
                            <select name="filter" class="filter-select" onchange="this.form.submit()">
                                <option value="all" <?= $filter === 'all' ? 'selected' : '' ?>>All Members</option>
                                <option value="student" <?= $filter === 'student' ? 'selected' : '' ?>>Students</option>
                                <option value="faculty" <?= $filter === 'faculty' ? 'selected' : '' ?>>Faculty</option>
                                <option value="professional" <?= $filter === 'professional' ? 'selected' : '' ?>>Professionals</option>
                            </select>
                        </form>
                    </div>
                </div>

                <div class="table-responsive">
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Department</th>
                                <th>Type</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($members as $member): ?>
                            <tr>
                                <td><?= htmlspecialchars($member['first_name'] . ' ' . $member['last_name']) ?></td>
                                <td><?= htmlspecialchars($member['email']) ?></td>
                                <td><?= htmlspecialchars($member['department']) ?></td>
                                <td><?= ucfirst($member['membership_type']) ?></td>
                                <td class="actions">
                                    <a href="members.php?edit=<?= $member['id'] ?>" class="btn-edit">
                                        <i class="fas fa-edit"></i>
                                    </a>
                                    <a href="members.php?delete=<?= $member['id'] ?>&csrf_token=<?= $csrfToken ?>" 
                                       class="btn-delete" onclick="return confirm('Are you sure?')">
                                        <i class="fas fa-trash"></i>
                                    </a>
                                </td>
                            </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>

                <!-- Add/Edit Member Modal -->
                <div class="modal" id="member-modal" style="display: <?= $editId ? 'flex' : 'none' ?>">
                    <div class="modal-content">
                        <span class="close-modal">&times;</span>
                        <h2><?= $editId ? 'Edit Member' : 'Add New Member' ?></h2>
                        
                        <form method="POST" enctype="multipart/form-data">
                            <input type="hidden" name="csrf_token" value="<?= $csrfToken ?>">
                            <?php if ($editId): ?>
                                <input type="hidden" name="edit_id" value="<?= $editId ?>">
                            <?php endif; ?>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="first_name">First Name *</label>
                                    <input type="text" id="first_name" name="first_name" 
                                           value="<?= htmlspecialchars($memberData['first_name']) ?>" required>
                                </div>
                                <div class="form-group">
                                    <label for="last_name">Last Name *</label>
                                    <input type="text" id="last_name" name="last_name" 
                                           value="<?= htmlspecialchars($memberData['last_name']) ?>" required>
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label for="email">Email *</label>
                                <input type="email" id="email" name="email" 
                                       value="<?= htmlspecialchars($memberData['email']) ?>" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="phone">Phone</label>
                                <input type="tel" id="phone" name="phone" 
                                       value="<?= htmlspecialchars($memberData['phone']) ?>">
                            </div>
                            
                            <div class="form-group">
                                <label for="department">Department</label>
                                <input type="text" id="department" name="department" 
                                       value="<?= htmlspecialchars($memberData['department']) ?>">
                            </div>
                            
                            <div class="form-group">
                                <label for="student_id">Student ID</label>
                                <input type="text" id="student_id" name="student_id" 
                                       value="<?= htmlspecialchars($memberData['student_id']) ?>">
                            </div>
                            
                            <div class="form-group">
                                <label for="membership_type">Membership Type *</label>
                                <select id="membership_type" name="membership_type" required>
                                    <option value="student" <?= $memberData['membership_type'] === 'student' ? 'selected' : '' ?>>Student</option>
                                    <option value="faculty" <?= $memberData['membership_type'] === 'faculty' ? 'selected' : '' ?>>Faculty</option>
                                    <option value="professional" <?= $memberData['membership_type'] === 'professional' ? 'selected' : '' ?>>Professional</option>
                                </select>
                            </div>
                            
                            <div class="form-actions">
                                <button type="submit" name="save_member" class="btn-save">
                                    <?= $editId ? 'Update Member' : 'Add Member' ?>
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
        // Member modal handling
        document.getElementById('add-member-btn').addEventListener('click', function() {
            document.getElementById('member-modal').style.display = 'flex';
        });
        
        document.querySelectorAll('.close-modal, .close-modal-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                document.getElementById('member-modal').style.display = 'none';
                window.location.href = 'members.php';
            });
        });
    </script>
</body>
</html>