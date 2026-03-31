import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

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

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`main-head ${isScrolled ? 'slidedown' : ''}`}>
      <div className="nav-island">
        {/* Logo */}
        <div className="logo">
          <Link to="/">
            <img className="logo-img" src="/images/ieeebluelogo.png" alt="Logo" />
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
              {isDark ? (
                <i className="fas fa-moon dark-icon"></i>
              ) : (
                <i className="fas fa-sun light-icon"></i>
              )}
              <span>Switch to {isDark ? 'light' : 'dark'} mode</span>
            </button>
          </div>
        </div>

        {/* Right-aligned actions (Desktop Theme Toggle + Mobile Hamburger) */}
        <div className="nav-actions">
          <div className="theme-toggle">
            <button
              className="theme-toggle-btn"
              aria-label="Toggle dark mode"
              onClick={toggleTheme}
            >
              {isDark ? (
                <i className="fas fa-moon dark-icon"></i>
              ) : (
                <i className="fas fa-sun light-icon"></i>
              )}
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
