import React from 'react';
import '../MembershipPage.css';

const MembershipPage = () => {
  return (
    <div className="membership-page">
      <div className="membership-content">
        <img src="/images/˙◠˙.svg" alt="Recruitment Status" className="membership-icon" />
        
        <h2 className="membership-status">Recruitment is currently closed.</h2>
        
        <p className="membership-message">
          We're not accepting new members right now.<br />
          Recruitment happens online and on campus, and we announce everything on our social media.
        </p>

        <h1 className="stay-tuned">Stay Tuned!</h1>

        <form className="notify-form" onSubmit={(e) => e.preventDefault()}>
          <input 
            type="email" 
            placeholder="Please enter your email address" 
            className="notify-input"
            required
          />
          <button type="submit" className="notify-button">
            Notify me
          </button>
        </form>
      </div>
    </div>
  );
};

export default MembershipPage;
