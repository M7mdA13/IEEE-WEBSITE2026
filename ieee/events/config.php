<?php
// Start session with secure settings
session_start([
    'cookie_httponly' => true,
    'cookie_secure' => true, // Enable in production with HTTPS
    'cookie_samesite' => 'Strict'
]);

// Error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Constants
/* define('BASE_URL', 'http://localhost/ieee-must');
 */define('UPLOAD_PATH', __DIR__ . '/uploads/');
/* define('MAX_UPLOAD_SIZE', 2 * 1024 * 1024); // 2MB/*  */
 define('ALLOWED_FILE_TYPES', ['image/jpeg', 'image/png', 'image/gif']);

// Create upload directory if it doesn't exist
if (!file_exists(UPLOAD_PATH)) {
    mkdir(UPLOAD_PATH, 0777, true);
}

// Include database connection
require_once 'db.php';
$database = new Database();
$db = $database->connect();

// Helper functions
function redirect($url, $statusCode = 303) {
    header("Location: $url", true, $statusCode);
    exit();
}

function isLoggedIn() {
    return isset($_SESSION['user_id']);
}

function isAdmin() {
    return isset($_SESSION['user_role']) && $_SESSION['user_role'] === 'admin';
}

function hasPermission($requiredRole) {
    $userRole = $_SESSION['user_role'] ?? 'guest';
    $rolesHierarchy = [
        'admin' => ['admin', 'moderator', 'viewer'],
        'moderator' => ['moderator', 'viewer'],
        'viewer' => ['viewer']
    ];
    
    return in_array($userRole, $rolesHierarchy[$requiredRole] ?? []);
}

function sanitizeInput($data) {
    if (is_array($data)) {
        return array_map('sanitizeInput', $data);
    }
    return htmlspecialchars(strip_tags(trim($data ?? '')));
}

function validateEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

function hashPassword($password) {
    return password_hash($password, PASSWORD_BCRYPT);
}

function verifyPassword($password, $hash) {
    return password_verify($password, $hash);
}

function generateCsrfToken() {
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

function validateCsrfToken($token) {
    return isset($_SESSION['csrf_token']) && hash_equals($_SESSION['csrf_token'], $token);
}

function checkUploadedFile($file) {
    if ($file['error'] !== UPLOAD_ERR_OK) {
        return ['success' => false, 'error' => 'File upload error'];
    }
    
   /*  if ($file['size'] > MAX_UPLOAD_SIZE) {
        return ['success' => false, 'error' => 'File too large'];
    } */
    
    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mime = $finfo->file($file['tmp_name']);
    
    if (!in_array($mime, ALLOWED_FILE_TYPES)) {
        return ['success' => false, 'error' => 'Invalid file type'];
    }
    
    return ['success' => true];
}
?>