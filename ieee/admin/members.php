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
$members = [];
$memberData = [
    'id' => null,
    'first_name' => '',
    'last_name' => '',
    'email' => '',
    'phone' => '',
    'department' => '',
    'student_id' => '',
    'membership_type' => 'student'
];
$editId = null;

// Generate CSRF token
$csrfToken = generateCsrfToken();

try {
    // Handle member deletion
    if (isset($_GET['delete']) && isAdmin()) {
        if (!validateCsrfToken($_GET['csrf_token'] ?? '')) {
            die('CSRF token validation failed');
        }
        $id = (int)$_GET['delete'];
        $stmt = $db->prepare("DELETE FROM members WHERE id = :id");
        $stmt->bindParam(':id', $id);
        if ($stmt->execute()) {
            $_SESSION['message'] = 'Member deleted successfully';
            redirect('members.php');
        } else {
            $error = 'Failed to delete member';
        }
    }

    // If edit mode
    if (isset($_GET['edit'])) {
        $editId = (int)$_GET['edit'];
        $stmt = $db->prepare("SELECT * FROM members WHERE id = :id LIMIT 1");
        $stmt->bindParam(':id', $editId);
        $stmt->execute();
        $memberData = $stmt->fetch(PDO::FETCH_ASSOC) ?: $memberData;
    }

    // Handle form submission
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        if (!validateCsrfToken($_POST['csrf_token'] ?? '')) {
            die('CSRF token validation failed');
        }

        // Sanitize inputs
        $firstName = sanitizeInput($_POST['first_name'] ?? '');
        $lastName = sanitizeInput($_POST['last_name'] ?? '');
        $email = sanitizeInput($_POST['email'] ?? '');
        $phone = sanitizeInput($_POST['phone'] ?? '');
        $department = sanitizeInput($_POST['department'] ?? '');
        $studentId = sanitizeInput($_POST['student_id'] ?? '');
        $membershipType = sanitizeInput($_POST['membership_type'] ?? 'student');

        // Validate inputs
        $errors = [];
        if (empty($firstName)) $errors[] = 'First name is required';
        if (empty($lastName)) $errors[] = 'Last name is required';
        if (empty($email)) {
            $errors[] = 'Email is required';
        } elseif (!validateEmail($email)) {
            $errors[] = 'Invalid email format';
        }

        if (empty($errors)) {
            if (!empty($_POST['edit_id'])) {
                // Update existing member
                $editId = (int)$_POST['edit_id'];
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
                // Insert new member
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

            if (!empty($_POST['edit_id'])) {
                $stmt->bindParam(':id', $editId);
            }

            if ($stmt->execute()) {
                $_SESSION['message'] = !empty($_POST['edit_id']) ? 'Member updated successfully' : 'Member added successfully';
                redirect('members.php');
            } else {
                $error = 'Database error: ' . implode(' ', $stmt->errorInfo());
            }
        } else {
            $error = implode('<br>', $errors);
            // Preserve form data
            $memberData = [
                'id' => $_POST['edit_id'] ?? null,
                'first_name' => $firstName,
                'last_name' => $lastName,
                'email' => $email,
                'phone' => $phone,
                'department' => $department,
                'student_id' => $studentId,
                'membership_type' => $membershipType
            ];
        }
    }

    // Get all members
    $stmt = $db->query("SELECT * FROM members ORDER BY last_name, first_name");
    $members = $stmt->fetchAll(PDO::FETCH_ASSOC);

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
    <title>Members Management - IEEE MUST</title>
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
        select {
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
        select:focus {
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
            <li><a href="events.php"><i class="fas fa-calendar-alt"></i> Events</a></li>
            <li class="active"><a href="members.php"><i class="fas fa-users"></i> Members</a></li>
            <li><a href="partners.php"><i class="fas fa-handshake"></i> Partners</a></li>
            <li><a href="analytics.php"><i class="fas fa-chart-bar"></i> Analytics</a></li>
            <li><a href="settings.php"><i class="fas fa-cog"></i> Settings</a></li>
        </ul>
    </aside>

    <!-- Main Content -->
    <main class="main-content">
        <!-- Navbar -->
        <nav class="navbar">
            <h3>Members Management</h3>
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
        <section id="member-form-section">
            <h2><i class="fas fa-user-edit"></i> <?= $editId ? 'Edit Member' : 'Add New Member' ?></h2>
            <form method="POST" action="members.php">
                <input type="hidden" name="csrf_token" value="<?= htmlspecialchars($csrfToken) ?>">
                <?php if ($editId): ?>
                    <input type="hidden" name="edit_id" value="<?= $editId ?>">
                <?php endif; ?>

                <div class="form-row">
                    <div class="form-group">
                        <label>First Name *</label>
                        <input type="text" name="first_name" value="<?= htmlspecialchars($memberData['first_name'] ?? '') ?>" required>
                    </div>
                    <div class="form-group">
                        <label>Last Name *</label>
                        <input type="text" name="last_name" value="<?= htmlspecialchars($memberData['last_name'] ?? '') ?>" required>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Email *</label>
                        <input type="email" name="email" value="<?= htmlspecialchars($memberData['email'] ?? '') ?>" required>
                    </div>
                    <div class="form-group">
                        <label>Phone</label>
                        <input type="text" name="phone" value="<?= htmlspecialchars($memberData['phone'] ?? '') ?>">
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Department</label>
                        <input type="text" name="department" value="<?= htmlspecialchars($memberData['department'] ?? '') ?>">
                    </div>
                    <div class="form-group">
                        <label>Student ID</label>
                        <input type="text" name="student_id" value="<?= htmlspecialchars($memberData['student_id'] ?? '') ?>">
                    </div>
                </div>

                <div class="form-group">
                    <label>Membership Type *</label>
                    <select name="membership_type" required>
                        <option value="student" <?= ($memberData['membership_type'] ?? 'student') === 'student' ? 'selected' : '' ?>>Student</option>
                        <option value="faculty" <?= ($memberData['membership_type'] ?? 'student') === 'faculty' ? 'selected' : '' ?>>Faculty</option>
                        <option value="professional" <?= ($memberData['membership_type'] ?? 'student') === 'professional' ? 'selected' : '' ?>>Professional</option>
                    </select>
                </div>

                <div class="text-right">
                    <button type="submit" class="btn">
                        <i class="fas fa-save"></i> <?= $editId ? 'Update' : 'Add' ?> Member
                    </button>
                    <?php if ($editId): ?>
                        <a href="members.php" class="btn btn-secondary">Cancel</a>
                    <?php endif; ?>
                </div>
            </form>
        </section>

        <!-- Members List Section -->
        <section id="members-list-section">
            <div class="mb-4" style="display: flex; justify-content: space-between; align-items: center;">
                <h2><i class="fas fa-users"></i> All Members</h2>
                <a href="members.php" class="btn"><i class="fas fa-plus"></i> Add Member</a>
            </div>

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
                                <a href="members.php?edit=<?= $member['id'] ?>"><i class="fas fa-edit"></i> Edit</a>
                                <a href="members.php?delete=<?= $member['id'] ?>&csrf_token=<?= htmlspecialchars($csrfToken) ?>" 
                                   onclick="return confirm('Are you sure you want to delete this member?')" class="delete">
                                   <i class="fas fa-trash-alt"></i> Delete
                                </a>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                    <?php if (empty($members)): ?>
                        <tr><td colspan="5" style="text-align: center;">No members found</td></tr>
                    <?php endif; ?>
                </tbody>
            </table>
        </section>
    </main>
</div>

</body>
</html>