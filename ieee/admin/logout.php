<?php
require_once 'config.php';
require_once 'auth.php';

$auth = new Auth($db);

// Perform logout
$auth->logout();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Logout - IEEE MUST Student Branch</title>
    <link rel="stylesheet" href="styles.css">
    <link rel="stylesheet" href="auth.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</head>
<body class="auth-body">
    <div class="auth-container">
        <div class="auth-card">
            <div class="auth-header">
                <img src="images/ieeelogoblue.png" alt="IEEE MUST Logo" class="auth-logo">
                <h1>IEEE MUST</h1>
                <p>You have been logged out</p>
            </div>
            <div class="auth-form">
                <p>You have successfully logged out. You will be redirected to the login page in a few seconds.</p>
                <a href="login.php" class="auth-button">Go to Login</a>
            </div>
        </div>
    </div>
    <script>
        // Auto-redirect after 3 seconds
        setTimeout(() => {
            window.location.href = 'login.php';
        }, 3000);
    </script>
</body>
</html>