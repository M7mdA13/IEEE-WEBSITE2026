<?php
require_once 'config.php';

// Check authentication and permissions
if (!isLoggedIn()) {
    redirect('login.php');
}
if (!hasPermission('admin')) {
    die('You do not have permission to access this page');
}

$csrfToken = generateCsrfToken();

// Initialize variables
$error = '';
$members = [];
$memberData = [
    'first_name' => '',
    'last_name' => '',
    'email' => '',
    'phone' => '',
    'department' => '',
    'student_id' => '',
    'membership_type' => 'student'
];
$editId = null;

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

        $firstName = sanitizeInput($_POST['first_name'] ?? '');
        $lastName = sanitizeInput($_POST['last_name'] ?? '');
        $email = sanitizeInput($_POST['email'] ?? '');
        $phone = sanitizeInput($_POST['phone'] ?? '');
        $department = sanitizeInput($_POST['department'] ?? '');
        $studentId = sanitizeInput($_POST['student_id'] ?? '');
        $membershipType = sanitizeInput($_POST['membership_type'] ?? 'student');

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
                // Update
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
                // Insert
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
            $memberData = [
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
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Members Management</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    

<div class="container">

    <?php include 'sidebar.php'; ?>
    <?php include 'navbar.php'; ?>

    <h1>Members Management</h1>

    <?php if (isset($_SESSION['message'])): ?>
        <div class="alert alert-success"><?= htmlspecialchars($_SESSION['message']); unset($_SESSION['message']); ?></div>
    <?php endif; ?>

    <?php if ($error): ?>
        <div class="alert alert-danger"><?= htmlspecialchars($error); ?></div>
    <?php endif; ?>

    <!-- Add/Edit Form -->
    <section id="member-form-section">
        <h2><?= $editId ? 'Edit Member' : 'Add New Member' ?></h2>
        <form method="POST" action="members.php">
            <input type="hidden" name="csrf_token" value="<?= htmlspecialchars($csrfToken) ?>">
            <?php if ($editId): ?>
                <input type="hidden" name="edit_id" value="<?= $editId ?>">
            <?php endif; ?>

            <label>First Name *</label>
            <input type="text" name="first_name" value="<?= htmlspecialchars($memberData['first_name']) ?>" required>

            <label>Last Name *</label>
            <input type="text" name="last_name" value="<?= htmlspecialchars($memberData['last_name']) ?>" required>

            <label>Email *</label>
            <input type="email" name="email" value="<?= htmlspecialchars($memberData['email']) ?>" required>

            <label>Phone</label>
            <input type="text" name="phone" value="<?= htmlspecialchars($memberData['phone']) ?>">

            <label>Department</label>
            <input type="text" name="department" value="<?= htmlspecialchars($memberData['department']) ?>">

            <label>Student ID</label>
            <input type="text" name="student_id" value="<?= htmlspecialchars($memberData['student_id']) ?>">

            <label>Membership Type *</label>
            <select name="membership_type" required>
                <option value="student" <?= $memberData['membership_type'] === 'student' ? 'selected' : '' ?>>Student</option>
                <option value="faculty" <?= $memberData['membership_type'] === 'faculty' ? 'selected' : '' ?>>Faculty</option>
                <option value="professional" <?= $memberData['membership_type'] === 'professional' ? 'selected' : '' ?>>Professional</option>
            </select>

            <button type="submit"><?= $editId ? 'Update' : 'Add' ?> Member</button>
        </form>
    </section>

    <!-- Members List -->
    <section id="members-list-section">
        <h2>All Members</h2>

        <a href="members.php" class="btn">+ Add Member</a>

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
                        <td>
                            <a href="members.php?edit=<?= $member['id'] ?>">Edit</a>
                            <a href="members.php?delete=<?= $member['id'] ?>&csrf_token=<?= htmlspecialchars($csrfToken) ?>" 
                               onclick="return confirm('Are you sure you want to delete this member?')">
                               Delete
                            </a>
                        </td>
                    </tr>
                <?php endforeach; ?>
                <?php if (empty($members)): ?>
                    <tr><td colspan="5">No members found</td></tr>
                <?php endif; ?>
            </tbody>
        </table>
    </section>

</div>

</body>
</html>
