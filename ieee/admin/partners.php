<?php
require_once 'config.php';
require_once 'auth.php';

$auth = new Auth($db);
if (!isLoggedIn()) {
    redirect('login.php');
}
if (!hasPermission('admin')) {
    die('You do not have permission to access this page');
}

$error = '';
$successMessage = '';
$partners = [];
$partnerData = [
    'id' => null,
    'name' => '',
    'type' => 'industry',
    'contact_email' => '',
    'website' => '',
    'description' => '',
    'logo_path' => ''
];
$editId = null;

$csrfToken = generateCsrfToken();

try {
    // Handle partner deletion
    if (isset($_GET['delete']) && isAdmin()) {
        if (!validateCsrfToken($_GET['csrf_token'] ?? '')) {
            die('CSRF token validation failed');
        }
        $id = (int)$_GET['delete'];
        $query = "SELECT logo_path FROM partners WHERE id = :id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        $logoPath = $stmt->fetchColumn();

        $query = "DELETE FROM partners WHERE id = :id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':id', $id);

        if ($stmt->execute()) {
            if ($logoPath && file_exists(UPLOAD_PATH . basename($logoPath))) {
                unlink(UPLOAD_PATH . basename($logoPath));
            }
            $_SESSION['message'] = 'Partner deleted successfully';
            redirect('partners.php');
        } else {
            $error = 'Failed to delete partner';
        }
    }

    // If edit mode
    if (isset($_GET['edit'])) {
        $editId = (int)$_GET['edit'];
        $stmt = $db->prepare("SELECT * FROM partners WHERE id = :id LIMIT 1");
        $stmt->bindParam(':id', $editId);
        $stmt->execute();
        $partnerData = $stmt->fetch(PDO::FETCH_ASSOC) ?: $partnerData;
    }

    // Handle form submission
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        if (!validateCsrfToken($_POST['csrf_token'] ?? '')) {
            die('CSRF token validation failed');
        }

        $name = sanitizeInput($_POST['name'] ?? '');
        $type = sanitizeInput($_POST['type'] ?? 'industry');
        $contactEmail = sanitizeInput($_POST['contact_email'] ?? '');
        $website = sanitizeInput($_POST['website'] ?? '');
        $description = sanitizeInput($_POST['description'] ?? '');
        $removeLogo = isset($_POST['remove_logo']);

        $errors = [];
        if (empty($name)) $errors[] = 'Name is required';
        if (empty($contactEmail)) $errors[] = 'Contact email is required';
        if (!filter_var($contactEmail, FILTER_VALIDATE_EMAIL)) $errors[] = 'Invalid email format';
        if ($website && !filter_var($website, FILTER_VALIDATE_URL)) $errors[] = 'Invalid website URL';

        $logoPath = $editId ? ($partnerData['logo_path'] ?? '') : '';
        if (isset($_FILES['logo']) && $_FILES['logo']['error'] === UPLOAD_ERR_OK) {
            $file = $_FILES['logo'];
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
                    if ($editId && $logoPath && file_exists(UPLOAD_PATH . basename($logoPath))) {
                        unlink(UPLOAD_PATH . basename($logoPath));
                    }
                    $logoPath = 'uploads/' . $fileName;
                } else {
                    $errors[] = 'Failed to upload logo';
                }
            }
        } elseif ($removeLogo && $editId && $logoPath) {
            if (file_exists(UPLOAD_PATH . basename($logoPath))) {
                unlink(UPLOAD_PATH . basename($logoPath));
            }
            $logoPath = '';
        }

        if (empty($errors)) {
            if (!empty($_POST['edit_id'])) {
                $editId = (int)$_POST['edit_id'];
                $query = "UPDATE partners SET 
                          name = :name, 
                          type = :type, 
                          contact_email = :contact_email, 
                          website = :website, 
                          description = :description, 
                          logo_path = :logo_path 
                          WHERE id = :id";
            } else {
                $query = "INSERT INTO partners 
                          (name, type, contact_email, website, description, logo_path) 
                          VALUES 
                          (:name, :type, :contact_email, :website, :description, :logo_path)";
            }

            $stmt = $db->prepare($query);
            $stmt->bindParam(':name', $name);
            $stmt->bindParam(':type', $type);
            $stmt->bindParam(':contact_email', $contactEmail);
            $stmt->bindParam(':website', $website);
            $stmt->bindParam(':description', $description);
            $stmt->bindParam(':logo_path', $logoPath);

            if (!empty($_POST['edit_id'])) {
                $stmt->bindParam(':id', $editId);
            }

            if ($stmt->execute()) {
                $_SESSION['message'] = !empty($_POST['edit_id']) ? 'Partner updated successfully' : 'Partner added successfully';
                redirect('partners.php');
            } else {
                $error = 'Database error: ' . implode(' ', $stmt->errorInfo());
            }
        } else {
            $error = implode('<br>', $errors);
            $partnerData = [
                'id' => $_POST['edit_id'] ?? null,
                'name' => $name,
                'type' => $type,
                'contact_email' => $contactEmail,
                'website' => $website,
                'description' => $description,
                'logo_path' => $logoPath
            ];
        }
    }

    // Get all partners
    $filter = isset($_GET['filter']) ? sanitizeInput($_GET['filter']) : 'all';
    $query = "SELECT * FROM partners";
    if ($filter !== 'all') {
        $query .= " WHERE type = :filter";
    }
    $query .= " ORDER BY name";

    $stmt = $db->prepare($query);
    if ($filter !== 'all') {
        $stmt->bindParam(':filter', $filter);
    }
    $stmt->execute();
    $partners = $stmt->fetchAll(PDO::FETCH_ASSOC);

} catch (PDOException $e) {
    $error = 'Database error: ' . $e->getMessage();
    error_log($error);
}

if (isset($_SESSION['message'])) {
    $successMessage = $_SESSION['message'];
    unset($_SESSION['message']);
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Partners Management - IEEE MUST</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        :root {
            --primary-color: #00629B;
            --secondary-color: #FFA300;
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
        input[type="url"],
        select,
        textarea {
            width: 100%;
            padding: 10px;
            margin-bottom: 15px;
            border: 1px solid #ddd;
            border-radius: var(--border-radius);
            font-size: 1rem;
        }
        
        input[type="file"] {
            margin-bottom: 15px;
        }
        
        input[type="text"]:focus,
        input[type="email"]:focus,
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
        
        .current-image img {
            max-width: 200px;
            margin-bottom: 10px;
        }
        
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
            <li><a href="members.php"><i class="fas fa-users"></i> Members</a></li>
            <li class="active"><a href="partners.php"><i class="fas fa-handshake"></i> Partners</a></li>
            <li><a href="analytics.php"><i class="fas fa-chart-bar"></i> Analytics</a></li>
            <li><a href="settings.php"><i class="fas fa-cog"></i> Settings</a></li>
        </ul>
    </aside>

    <!-- Main Content -->
    <main class="main-content">
        <!-- Navbar -->
        <nav class="navbar">
            <h3>Partners Management</h3>
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
        <section id="partner-form-section">
            <h2><i class="fas fa-handshake"></i> <?= $editId ? 'Edit Partner' : 'Add New Partner' ?></h2>
            <form method="POST" enctype="multipart/form-data" action="partners.php">
                <input type="hidden" name="csrf_token" value="<?= htmlspecialchars($csrfToken) ?>">
                <?php if ($editId): ?>
                    <input type="hidden" name="edit_id" value="<?= $editId ?>">
                <?php endif; ?>

                <div class="form-row">
                    <div class="form-group">
                        <label>Name *</label>
                        <input type="text" name="name" value="<?= htmlspecialchars($partnerData['name'] ?? '') ?>" required>
                    </div>
                    <div class="form-group">
                        <label>Type *</label>
                        <select name="type" required>
                            <option value="industry" <?= ($partnerData['type'] ?? 'industry') === 'industry' ? 'selected' : '' ?>>Industry</option>
                            <option value="academic" <?= ($partnerData['type'] ?? 'industry') === 'academic' ? 'selected' : '' ?>>Academic</option>
                            <option value="community" <?= ($partnerData['type'] ?? 'industry') === 'community' ? 'selected' : '' ?>>Community</option>
                        </select>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Contact Email *</label>
                        <input type="email" name="contact_email" value="<?= htmlspecialchars($partnerData['contact_email'] ?? '') ?>" required>
                    </div>
                    <div class="form-group">
                        <label>Website</label>
                        <input type="url" name="website" value="<?= htmlspecialchars($partnerData['website'] ?? '') ?>">
                    </div>
                </div>

                <div class="form-group">
                    <label>Description</label>
                    <textarea name="description" rows="4"><?= htmlspecialchars($partnerData['description'] ?? '') ?></textarea>
                </div>

                <div class="form-group">
                    <label>Partner Logo</label>
                    <?php if ($editId && $partnerData['logo_path']): ?>
                        <div class="current-image">
                            <img src="<?= htmlspecialchars($partnerData['logo_path']) ?>" alt="Current Logo">
                            <label>
                                <input type="checkbox" name="remove_logo" value="1"> Remove current logo
                            </label>
                        </div>
                    <?php endif; ?>
                    <input type="file" name="logo" accept="image/jpeg,image/png,image/gif">
                </div>

                <div class="text-right">
                    <button type="submit" class="btn">
                        <i class="fas fa-save"></i> <?= $editId ? 'Update' : 'Add' ?> Partner
                    </button>
                    <?php if ($editId): ?>
                        <a href="partners.php" class="btn btn-secondary">Cancel</a>
                    <?php endif; ?>
                </div>
            </form>
        </section>

        <!-- Partners List Section -->
        <section id="partners-list-section">
            <div class="mb-4" style="display: flex; justify-content: space-between; align-items: center;">
                <h2><i class="fas fa-handshake"></i> All Partners</h2>
                <form method="get" class="filter-form">
                    <input type="hidden" name="csrf_token" value="<?= htmlspecialchars($csrfToken) ?>">
                    <select name="filter" class="filter-select" onchange="this.form.submit()">
                        <option value="all" <?= $filter === 'all' ? 'selected' : '' ?>>All Partners</option>
                        <option value="industry" <?= $filter === 'industry' ? 'selected' : '' ?>>Industry</option>
                        <option value="academic" <?= $filter === 'academic' ? 'selected' : '' ?>>Academic</option>
                        <option value="community" <?= $filter === 'community' ? 'selected' : '' ?>>Community</option>
                    </select>
                </form>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Email</th>
                        <th>Website</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($partners as $partner): ?>
                        <tr>
                            <td><?= htmlspecialchars($partner['name']) ?></td>
                            <td><?= ucfirst($partner['type']) ?></td>
                            <td><?= htmlspecialchars($partner['contact_email']) ?></td>
                            <td>
                                <?php if ($partner['website']): ?>
                                    <a href="<?= htmlspecialchars($partner['website']) ?>" target="_blank">Visit</a>
                                <?php else: ?>
                                    -
                                <?php endif; ?>
                            </td>
                            <td class="actions">
                                <a href="partners.php?edit=<?= $partner['id'] ?>"><i class="fas fa-edit"></i> Edit</a>
                                <a href="partners.php?delete=<?= $partner['id'] ?>&csrf_token=<?= htmlspecialchars($csrfToken) ?>" 
                                   onclick="return confirm('Are you sure you want to delete this partner?')" class="delete">
                                   <i class="fas fa-trash-alt"></i> Delete
                                </a>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                    <?php if (empty($partners)): ?>
                        <tr><td colspan="5" style="text-align: center;">No partners found</td></tr>
                    <?php endif; ?>
                </tbody>
            </table>
        </section>
    </main>
</div>

</body>
</html>