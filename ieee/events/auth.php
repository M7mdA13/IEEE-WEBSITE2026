<?php
require_once 'config.php';

class Auth {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    public function login($email, $password, $remember = false) {
        $query = "SELECT * FROM users WHERE email = :email LIMIT 1";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':email', $email);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if (verifyPassword($password, $user['password'])) {
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['user_email'] = $user['email'];
                $_SESSION['user_role'] = $user['role'];
                $_SESSION['user_name'] = $user['first_name'] . ' ' . $user['last_name'];
                
                if ($remember) {
                    $token = bin2hex(random_bytes(32));
                    $expiry = date('Y-m-d H:i:s', strtotime('+30 days'));
                    
                    $updateQuery = "UPDATE users SET remember_token = :token WHERE id = :id";
                    $updateStmt = $this->db->prepare($updateQuery);
                    $updateStmt->bindParam(':token', $token);
                    $updateStmt->bindParam(':id', $user['id']);
                    $updateStmt->execute();
                    
                    setcookie('remember_token', $token, time() + (30 * 24 * 60 * 60), '/');
                }
                
                // Update last login
                $this->updateLastLogin($user['id']);
                
                return true;
            }
        }
        
        return false;
    }

    public function register($firstName, $lastName, $email, $password, $role) {
        $query = "INSERT INTO users (first_name, last_name, email, password, role) 
                  VALUES (:first_name, :last_name, :email, :password, :role)";
        $stmt = $this->db->prepare($query);
        
        $stmt->bindParam(':first_name', $firstName);
        $stmt->bindParam(':last_name', $lastName);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':password', hashPassword($password));
        $stmt->bindParam(':role', $role);
        
        return $stmt->execute();
    }

    public function checkRememberToken() {
        if (isset($_COOKIE['remember_token']) && !isLoggedIn()) {
            $token = $_COOKIE['remember_token'];
            
            $query = "SELECT * FROM users WHERE remember_token = :token LIMIT 1";
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':token', $token);
            $stmt->execute();
            
            if ($stmt->rowCount() > 0) {
                $user = $stmt->fetch(PDO::FETCH_ASSOC);
                
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['user_email'] = $user['email'];
                $_SESSION['user_role'] = $user['role'];
                $_SESSION['user_name'] = $user['first_name'] . ' ' . $user['last_name'];
                
                // Update last login
                $this->updateLastLogin($user['id']);
                
                return true;
            }
        }
        
        return false;
    }

    private function updateLastLogin($userId) {
        $query = "UPDATE users SET last_login = NOW() WHERE id = :id";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':id', $userId);
        $stmt->execute();
    }

    public function logout() {
        // Clear remember token from database
        if (isset($_SESSION['user_id'])) {
            $query = "UPDATE users SET remember_token = NULL WHERE id = :id";
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':id', $_SESSION['user_id']);
            $stmt->execute();
        }
        
        // Clear session
        session_unset();
        session_destroy();
        
        // Clear remember cookie
        setcookie('remember_token', '', time() - 3600, '/');
    }
}
?>