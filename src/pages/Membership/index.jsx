import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../api/public';
import './Membership.css';

const Membership = () => {
  const [status, setStatus] = useState({ isOpen: false, message: 'Recruitment is currently closed.' });
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [notifyState, setNotifyState] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [notifyMsg, setNotifyMsg] = useState('');

  useEffect(() => {
    api.get('/recruitment')
      .then(({ data }) => setStatus(data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleNotify = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setNotifyState('loading');
    try {
      const { data } = await api.post('/mailing-list', { email: email.trim() });
      setNotifyMsg(data.message);
      setNotifyState('success');
      setEmail('');
    } catch (err) {
      setNotifyMsg(err.response?.data?.message || 'Something went wrong. Try again.');
      setNotifyState('error');
    }
  };

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

        {!loading && (
          <>
            <motion.h2
              className="membership-status"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {status.isOpen ? 'Recruitment is now open!' : 'Recruitment is currently closed.'}
            </motion.h2>

            <motion.p
              className="membership-message"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {status.message || (status.isOpen
                ? 'Apply now and join our community!'
                : "We're not accepting new members right now.\nRecruitment happens online and on campus, and we announce everything on our social media."
              )}
            </motion.p>

            <motion.h1
              className="stay-tuned"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {status.isOpen ? 'Apply Now!' : 'Stay Tuned!'}
            </motion.h1>

            {!status.isOpen && (
              <motion.div
                className="notify-form-wrapper"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <p className="notify-label">Get notified when recruitment opens</p>
                {notifyState === 'success' ? (
                  <p className="notify-success">{notifyMsg}</p>
                ) : (
                  <form className="notify-form" onSubmit={handleNotify}>
                    <input
                      type="email"
                      className="notify-input"
                      placeholder="your@email.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                    />
                    <button type="submit" className="notify-button" disabled={notifyState === 'loading'}>
                      {notifyState === 'loading' ? '...' : 'Notify me'}
                    </button>
                  </form>
                )}
                {notifyState === 'error' && <p className="notify-error">{notifyMsg}</p>}
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Membership;
