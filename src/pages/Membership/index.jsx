import React from 'react';
import { motion } from 'framer-motion';
import './Membership.css';

const Membership = () => {
  return (
    <div className="membership-page">
      <div className="membership-content">
        <motion.img
          src="/images/˙◠˙.svg"
          alt="Recruitment Status"
          className="membership-icon"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        />

        <motion.h2
          className="membership-status"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Recruitment is currently closed.
        </motion.h2>

        <motion.p
          className="membership-message"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          We're not accepting new members right now.<br />
          Recruitment happens online and on campus, and we announce everything on our social media.
        </motion.p>

        <motion.h1
          className="stay-tuned"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Stay Tuned!
        </motion.h1>

        <motion.form
          className="notify-form"
          onSubmit={(e) => e.preventDefault()}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <input
            type="email"
            placeholder="Please enter your email address"
            className="notify-input"
            required
          />
          <button type="submit" className="notify-button">
            Notify me
          </button>
        </motion.form>
      </div>
    </div>
  );
};

export default Membership;
