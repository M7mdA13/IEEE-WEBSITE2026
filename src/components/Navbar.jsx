import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const SunIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/>
    <line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/>
    <line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);

const MoonIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);

const Navbar = ({ isDark, toggleTheme }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <nav className={`main-head ${isScrolled ? 'slidedown' : ''}`}>
      <div className="nav-island">
        <div className="logo">
          <Link to="/" onClick={(e) => {
            if (location.pathname === '/') {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}>
            <img className="logo-img" src="/images/IEEE-MUST.png" alt="IEEE MUST Student Branch" fetchpriority="high" width="175" height="175" />
          </Link>
        </div>

        {/* Main Links Container */}
        <div className={`nav-container ${isMobileMenuOpen ? 'active' : ''}`}>
          <div className="nav-links">
            <Link to="/" className={isActive('/') ? 'active' : ''} onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
            <Link to="/committees" className={isActive('/committees') ? 'active' : ''} onClick={() => setIsMobileMenuOpen(false)}>Committees</Link>
            <Link to="/events" className={isActive('/events') ? 'active' : ''} onClick={() => setIsMobileMenuOpen(false)}>Events</Link>
            <Link to="/membership" className={isActive('/membership') ? 'active' : ''} onClick={() => setIsMobileMenuOpen(false)}>Membership</Link>
            <Link to="/about" className={isActive('/about') ? 'active' : ''} onClick={() => setIsMobileMenuOpen(false)}>About us</Link>
            
            {/* Dark Mode (Mobile Menu Only) */}
            <button
              className="theme-toggle-mobile-btn"
              aria-label="Toggle dark mode"
              onClick={toggleTheme}
            >
              {isDark ? <MoonIcon /> : <SunIcon />}
              <span>Switch to {isDark ? 'light' : 'dark'} mode</span>
            </button>
          </div>
        </div>

        {/* Right-aligned actions (Desktop Theme Toggle) */}
        <div className="nav-actions">
          <div className="theme-toggle">
            <button
              className="theme-toggle-btn"
              aria-label="Toggle dark mode"
              onClick={toggleTheme}
            >
              {isDark ? <MoonIcon /> : <SunIcon />}
            </button>
          </div>
        </div>

      </div>

      <div className="mobile-nav standalone-hamburger">
        <button
          className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`}
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          aria-label="Menu"
        >
          <span className="hamburger-bar top"></span>
          <span className="hamburger-bar middle"></span>
          <span className="hamburger-bar bottom"></span>
        </button>
      </div>

    </nav>
  );
};

export default Navbar;
