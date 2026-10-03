import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api, { TOKEN_KEY } from '../api/index'

function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({ email: '', password: '', remember: false })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showForgot, setShowForgot] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await api.post('/admin/auth/login', {
        email: formData.email,
        password: formData.password,
      })
      // The server also sets an httpOnly cookie, but phones block it as
      // third-party — keep the token so requests can send it as a header
      if (data.token) localStorage.setItem(TOKEN_KEY, data.token)
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('user', JSON.stringify(data.user))
      // Drop any legacy standalone pfp cache — avatar now lives on the user object
      localStorage.removeItem('profileImage')
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  return (
    <body className="auth-body">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <img src="/images/ieeebluelogo.png" alt="IEEE MUST Logo" className="auth-logo" />
            <h1>IEEE MUST</h1>
            <p>Admin Dashboard Login</p>
          </div>

          {error && (
            <div style={{ background: 'var(--danger-color, #e74c3c)', color: '#fff', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.9rem' }}>
              {error}
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email"><i className="fas fa-envelope"></i> Email</label>
              <input type="email" id="email" name="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label htmlFor="password"><i className="fas fa-lock"></i> Password</label>
              <input type={showPassword ? 'text' : 'password'} id="password" name="password" placeholder="Enter your password" value={formData.password} onChange={handleChange} required />
              <span className="password-toggle" onClick={() => setShowPassword(p => !p)}>
                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </span>
            </div>

            <div className="form-options">
              <div className="remember-me">
                <input type="checkbox" id="remember" name="remember" checked={formData.remember} onChange={handleChange} />
                <label htmlFor="remember">Remember me</label>
              </div>
              <button type="button" className="forgot-password" onClick={() => setShowForgot(v => !v)} aria-expanded={showForgot}>
                Forgot Password?
              </button>
            </div>

            {showForgot && (
              <div className="forgot-note" role="note">
                <i className="fas fa-user-shield"></i>
                <p>Ask a <strong>superadmin</strong> to reset it from the <strong>Users</strong> page. They'll give you a temporary password — change it afterwards in <strong>Settings → Security</strong>.</p>
              </div>
            )}

            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="auth-footer">
            <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
          </div>
        </div>
      </div>
    </body>
  )
}

export default Login
