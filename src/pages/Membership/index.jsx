import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import api from '../../api/public';
import { normalizeUrl } from '../../utils/url';
import './Membership.css';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay },
});

// "Opens Google Forms" reads better than a bare "opens in a new tab" when we can tell.
const formHostLabel = (link) => {
  try {
    const { hostname } = new URL(link);
    if (hostname === 'forms.gle' || hostname.endsWith('docs.google.com')) return 'Opens Google Forms';
  } catch { /* fall through */ }
  return 'Opens in a new tab';
};

const ArrowIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const RecruitmentOpen = ({ message, formLink }) => (
  <motion.div className={`recruit-card${formLink ? '' : ' recruit-card--no-qr'}`} {...fadeUp(0.05)}>
    <div className="recruit-info">
      <span className="live-pill">
        <span className="live-dot" aria-hidden="true" />
        Recruitment is live
      </span>

      <h1 className="recruit-title">
        Join <span className="recruit-title-accent">IEEE MUST</span>
      </h1>

      <p className="recruit-message">
        {message || 'Applications are open! Fill in the form to join our committees, meet the team, and start building with us.'}
      </p>

      {formLink ? (
        <div className="recruit-cta">
          <a className="apply-btn" href={formLink} target="_blank" rel="noopener noreferrer">
            Apply now <ArrowIcon />
          </a>
          <span className="recruit-cta-hint">{formHostLabel(formLink)}</span>
        </div>
      ) : (
        <p className="recruit-cta-hint">Follow our social media for the application link.</p>
      )}
    </div>

    {formLink && (
      <div className="recruit-qr">
        <div className="qr-frame">
          <span className="qr-corner qr-corner--tl" aria-hidden="true" />
          <span className="qr-corner qr-corner--tr" aria-hidden="true" />
          <span className="qr-corner qr-corner--bl" aria-hidden="true" />
          <span className="qr-corner qr-corner--br" aria-hidden="true" />
          <div className="qr-code">
            <QRCodeSVG
              value={formLink}
              size={220}
              level="H"
              marginSize={0}
              fgColor="#054377"
              bgColor="#ffffff"
              title="QR code for the IEEE MUST application form"
              imageSettings={{
                src: '/images/IEEE-MUST.webp',
                height: 48,
                width: 48,
                excavate: true,
              }}
            />
            <span className="qr-scanline" aria-hidden="true" />
          </div>
        </div>
        <p className="qr-caption">
          <span className="qr-caption--desktop">Scan with your phone camera to apply</span>
          <span className="qr-caption--mobile">Share this code with a friend</span>
        </p>
      </div>
    )}
  </motion.div>
);

const Membership = () => {
  const [status, setStatus] = useState({ isOpen: false, message: '', formLink: '' });
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [notifyState, setNotifyState] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [notifyMsg, setNotifyMsg] = useState('');

  useEffect(() => {
    api.get('/recruitment')
      .then(({ data }) => {
        if (data && data.data) {
          setStatus(data.data);
        }
      })
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

  // Skeleton until we know which state to show — otherwise the "closed" icon
  // flashes before the open card replaces it.
  if (loading) {
    return (
      <div className="membership-page" aria-busy="true">
        <div className="membership-skeleton">
          <div className="skel-line skel-line--wide" />
          <div className="skel-line" style={{ width: '90%' }} />
          <div className="skel-line skel-line--narrow" />
          <div className="skel-line skel-line--medium" />
        </div>
      </div>
    );
  }

  if (status.isOpen) {
    return (
      <div className="membership-page membership-page--open">
        <RecruitmentOpen message={status.message} formLink={normalizeUrl(status.formLink)} />
      </div>
    );
  }

  return (
    <div className="membership-page">
      <div className="membership-content">
        <motion.img
          src="/images/˙◠˙.svg"
          alt="Recruitment Status"
          className="membership-icon"
          {...fadeUp()}
          width="120"
          height="120"
          style={{ objectFit: 'contain', minHeight: '120px' }}
        />

        <>
          <motion.h2 className="membership-status" {...fadeUp(0.1)}>
            Recruitment is currently closed.
          </motion.h2>

          <motion.p className="membership-message" {...fadeUp(0.2)}>
            {status.message || "We're not accepting new members right now. Recruitment happens online and on campus — we announce everything on our social media."}
          </motion.p>

          <motion.h1 className="stay-tuned" {...fadeUp(0.3)}>
            Stay Tuned!
          </motion.h1>

          <motion.div className="notify-form-wrapper" {...fadeUp(0.4)}>
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
        </>
      </div>
    </div>
  );
};

export default Membership;
