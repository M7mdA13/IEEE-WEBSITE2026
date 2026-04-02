import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Signup() {
  const [showPassword, setShowPassword] = useState({ password: false, confirm: false })
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    role: '',
    password: '',
    confirmPassword: '',
    terms: false
  })
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    navigate('/login')
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const togglePassword = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  return (
    <body className="auth-body">
      <div className="auth-container">
        <div className="auth-card signup-card">
          <div className="auth-header">
            <img src="/images/ieeebluelogo.png" alt="IEEE MUST Logo" className="auth-logo" />
            <h1>IEEE MUST</h1>
            <p>Create Admin Account</p>
          </div>
          
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstname"><i className="fas fa-user"></i> First Name</label>
                <input 
                  type="text" 
                  id="firstname" 
                  name="firstname" 
                  placeholder="Enter first name"
                  value={formData.firstname}
                  onChange={handleChange}
                  required 
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="lastname"><i className="fas fa-user"></i> Last Name</label>
                <input 
                  type="text" 
                  id="lastname" 
                  name="lastname" 
                  placeholder="Enter last name"
                  value={formData.lastname}
                  onChange={handleChange}
                  required 
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="email"><i className="fas fa-envelope"></i> Email</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="role"><i className="fas fa-user-tag"></i> Role</label>
              <select 
                id="role" 
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="" disabled>Select your role</option>
                <option value="admin">Admin</option>
                <option value="moderator">Moderator</option>
                <option value="viewer">Viewer</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="password"><i className="fas fa-lock"></i> Password</label>
              <input 
                type={showPassword.password ? "text" : "password"} 
                id="password" 
                name="password" 
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required 
              />
              <span className="password-toggle" onClick={() => togglePassword('password')}>
                <i className={`fas ${showPassword.password ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </span>
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword"><i className="fas fa-lock"></i> Confirm Password</label>
              <input 
                type={showPassword.confirm ? "text" : "password"} 
                id="confirmPassword" 
                name="confirmPassword" 
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required 
              />
              <span className="password-toggle" onClick={() => togglePassword('confirm')}>
                <i className={`fas ${showPassword.confirm ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </span>
            </div>
            
            <div className="form-options">
              <div className="terms">
                <input 
                  type="checkbox" 
                  id="terms" 
                  name="terms"
                  checked={formData.terms}
                  onChange={handleChange}
                  required 
                />
                <label htmlFor="terms">I agree to the <a href="#">Terms & Conditions</a></label>
              </div>
            </div>
            
            <button type="submit" className="auth-button">Create Account</button>
          </form>
          
          <div className="auth-footer">
            <p>Already have an account? <Link to="/login">Login</Link></p>
          </div>
        </div>
      </div>
    </body>
  )
}

export default Signup
