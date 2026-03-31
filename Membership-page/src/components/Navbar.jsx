import React, { useState, useEffect } from 'react';

const Navbar = ({ isDark, toggleTheme, onHomeClick, onMembershipClick }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Sticky navbar on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className={`main-head ${isScrolled ? 'slidedown' : ''}`}>
      <div className="white-line"></div>
      <div className="logo" onClick={onHomeClick} style={{ cursor: 'pointer' }}>
        <svg className="logo2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
          <path d="m100,0H0v100C0,44.77,44.77,0,100,0Z" fill="#F9F8F6"></path>
        </svg>
        <img className="logo-img" src="/images/ieeebluelogo.png" alt="Logo" />
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
          <path d="m100,0H0v100C0,44.77,44.77,0,100,0Z" fill="#F9F8F6"></path>
        </svg>
      </div>
      <div className={`nav-container ${isMobileMenuOpen ? 'active' : ''}`}>
        <div className="nav-links">
          <a href="#" className="active" onClick={(e) => { e.preventDefault(); closeMobileMenu(); onHomeClick && onHomeClick(); }}>Home</a>
          <a href="#" onClick={(e) => { e.preventDefault(); closeMobileMenu(); }}>Committees</a>
          <a href="#" onClick={(e) => { e.preventDefault(); closeMobileMenu(); }}>Events</a>
          <a href="#" onClick={(e) => { e.preventDefault(); closeMobileMenu(); onMembershipClick && onMembershipClick(); }}>Membership</a>
          <a href="#" onClick={(e) => { e.preventDefault(); closeMobileMenu(); }}>About us</a>
          <div className="theme-toggle-mobile">
            <button
              className="theme-toggle-btn mobile"
              aria-label="Toggle dark mode"
              onClick={toggleTheme}
            >
              {isDark ? (
                <i className="fas fa-moon dark-icon"></i>
              ) : (
                <i className="fas fa-sun light-icon"></i>
              )}
            </button>
            <span>Switch to {isDark ? 'light' : 'dark'} mode</span>
          </div>
        </div>
      </div>
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
      <div className="mobile-nav">
        <button
          className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`}
          onClick={toggleMobileMenu}
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
