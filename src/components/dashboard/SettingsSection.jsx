import { useState, useRef } from 'react'

const settingsTabs = [
  { id: 'profile-settings', label: 'Profile Settings' },
  { id: 'notification-settings', label: 'Notifications' },
  { id: 'security-settings', label: 'Security' }
]

function SettingsSection() {
  const [activeTab, setActiveTab] = useState('profile-settings')
  const [profileImage, setProfileImage] = useState(() => {
    return localStorage.getItem('profileImage') || "https://randomuser.me/api/portraits/men/1.jpg"
  })
  const fileInputRef = useRef(null)

  const handleImageUpload = () => {
    fileInputRef.current.click()
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result
        setProfileImage(base64String)
        localStorage.setItem('profileImage', base64String)
        // Dispatch custom event for real-time Navbar update
        window.dispatchEvent(new CustomEvent('profileImageUpdate', { detail: base64String }))
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <section className="content-section active">
      <h1>Settings</h1>
      <div className="settings-container">
        <aside className="settings-sidebar">
          <ul className="settings-menu">
            {settingsTabs.map(tab => (
              <li 
                key={tab.id}
                className={activeTab === tab.id ? 'active' : ''}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </li>
            ))}
          </ul>
        </aside>
        <div className="settings-content">
          <div id="profile-settings" className={`settings-panel ${activeTab === 'profile-settings' ? 'active' : ''}`}>
            <h2>Profile Settings</h2>
            <form className="settings-form" onSubmit={(e) => e.preventDefault()}>
              <div className="profile-upload">
                <img src={profileImage} alt="Profile" />
                <button type="button" className="upload-btn" onClick={handleImageUpload}>
                  Upload New Photo
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageChange} 
                  accept="image/*" 
                  style={{ display: 'none' }} 
                />
              </div>
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" defaultValue="Admin User" />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" defaultValue="admin@ieee-must.edu" />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-save">Save Changes</button>
                <button type="button" className="btn-cancel">Cancel</button>
              </div>
            </form>
          </div>
          <div id="notification-settings" className={`settings-panel ${activeTab === 'notification-settings' ? 'active' : ''}`}>
            <h2>Notification Settings</h2>
            <p style={{ color: 'var(--text-light)' }}>Notification preferences will be available here.</p>
          </div>
          <div id="security-settings" className={`settings-panel ${activeTab === 'security-settings' ? 'active' : ''}`}>
            <h2>Security Settings</h2>
            <p style={{ color: 'var(--text-light)' }}>Security options will be available here.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SettingsSection
