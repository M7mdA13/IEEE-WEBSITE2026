import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const menuItems = [
  { id: 'dashboard', icon: 'fa-tachometer-alt', label: 'Dashboard', path: '/dashboard' },
  { id: 'events', icon: 'fa-calendar-alt', label: 'Events', path: '/dashboard/events' },
  { id: 'members', icon: 'fa-users', label: 'Members', path: '/dashboard/members' },
  { id: 'partners', icon: 'fa-handshake', label: 'Partners', path: '/dashboard/partners' },
  { id: 'analytics', icon: 'fa-chart-line', label: 'Analytics', path: '/dashboard/analytics' },
  { id: 'settings', icon: 'fa-cog', label: 'Settings', path: '/dashboard/settings' }
]

function Sidebar({ isOpen, setIsOpen }) {
  const navigate = useNavigate()
  const location = useLocation()

  const handleNavigation = (path) => {
    navigate(path)
    if (window.innerWidth <= 768) {
      setIsOpen(false)
    }
  }

  const isActive = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard' || location.pathname === '/dashboard/'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <aside className={`sidebar ${isOpen ? 'active' : ''}`}>
      <div className="sidebar-header">
        <img src="/images/ieeebluelogo.png" alt="IEEE MUST Logo" className="logo" />
        <h2>IEEE MUST</h2>
      </div>
      <ul className="sidebar-menu">
        {menuItems.map(item => (
          <li 
            key={item.id} 
            className={isActive(item.path) ? 'active' : ''}
            onClick={() => handleNavigation(item.path)}
          >
            <a href="#" onClick={(e) => e.preventDefault()}>
              <i className={`fas ${item.icon}`}></i> 
              <span>{item.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </aside>
  )
}

export default Sidebar
