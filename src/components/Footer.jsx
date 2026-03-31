import React from 'react';

const Footer = () => {
  return (
    <footer className="must-footer">
      <div className="footer-top">
        <div className="footer-col footer-logo">
          <img src="/images/ieeebluelogo.png" alt="IEEE Logo" className="footer-logo-img" />
          <div className="footer-logo-text">
            <span className="footer-logo-title">IEEE</span><br />
            <span className="footer-logo-branch">Misr University for Science and Technology<br />Student Branch</span>
          </div>
        </div>
        <div className="footer-col footer-links">
          <div className="footer-link-group">
            <a href="/">Home</a>
            <a href="#">About Us</a>
            <a href="#">Membership</a>
          </div>
          <div className="footer-link-group">
            <a href="#">Events</a>
            <a href="#">Committees</a>
          </div>
        </div>
        <div className="footer-col footer-contact">
          <div className="footer-contact-item"><i className="fa-solid fa-envelope"></i> must@ieee.org.eg</div>
          <div className="footer-contact-item"><i className="fa-solid fa-phone"></i> +20 120 654 7195</div>
          <div className="footer-social">
            <a href="#" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
            <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
            <a href="#" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
            <a href="#" aria-label="TikTok"><i className="fab fa-tiktok"></i></a>
          </div>
        </div>
      </div>
      <hr className="footer-divider" />
      <div className="footer-bottom">
        <span>© 2025 IEEE MUST SB. All rights reserved.</span>
      </div>
    </footer>
  );
};

export default Footer;
