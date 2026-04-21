import React, { lazy, Suspense, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AskAIFAB from './components/AskAIFAB';
import MeshBackground from './components/MeshBackground';
import './index.css';

/* ── Lazy-loaded routes — each page becomes its own JS chunk ── */
const Home        = lazy(() => import('./pages/Home'));
const Events      = lazy(() => import('./pages/Events'));
const Membership  = lazy(() => import('./pages/Membership'));
const About       = lazy(() => import('./pages/About'));
const Committees  = lazy(() => import('./pages/Committees'));
const Committee   = lazy(() => import('./pages/Committee'));
const AIAssistant = lazy(() => import('./pages/AIAssistant'));
const NotFound    = lazy(() => import('./pages/NotFound'));

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(err, info) {
    console.error('[ErrorBoundary]', err, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', padding: '2rem', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'Montserrat, sans-serif', color: '#054377' }}>Something went wrong.</h2>
          <button
            onClick={() => { this.setState({ hasError: false }); window.location.href = '/'; }}
            style={{ padding: '10px 24px', background: '#0096ED', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }}
          >
            Go Home
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -8 },
};
const pageTransition = { duration: 0.28, ease: 'easeInOut' };

const PageWrapper = ({ children }) => (
  <motion.div
    variants={pageVariants}
    initial="initial"
    animate="animate"
    exit="exit"
    transition={pageTransition}
  >
    {children}
  </motion.div>
);

if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

const ScrollToTop = () => {
  const location = useLocation();
  useEffect(() => {
    // Delay matches the exit animation duration (0.28s) so the scroll
    // happens while the new page is already fading in — never visible.
    const t = setTimeout(() => window.scrollTo(0, 0), 280);
    return () => clearTimeout(t);
  }, [location.pathname]);
  return null;
};

const AnimatedRoutes = ({ isDark }) => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/"                 element={<PageWrapper><Home isDark={isDark} /></PageWrapper>} />
        <Route path="/events"           element={<PageWrapper><Events /></PageWrapper>} />
        <Route path="/membership"       element={<PageWrapper><Membership /></PageWrapper>} />
        <Route path="/about"            element={<PageWrapper><About /></PageWrapper>} />
        <Route path="/committees"       element={<PageWrapper><Committees /></PageWrapper>} />
        <Route path="/committees/:slug" element={<PageWrapper><Committee /></PageWrapper>} />
        <Route path="/ai-assistant"     element={<PageWrapper><AIAssistant /></PageWrapper>} />
        <Route path="*"                 element={<PageWrapper><NotFound /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  const [isDark, setIsDark] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    if (isDark) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(prev => !prev);

  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        setIsDark(prev => !prev);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  return (
    <BrowserRouter>
      <MeshBackground />
      <ScrollToTop />
      <Navbar isDark={isDark} toggleTheme={toggleTheme} />

      <ErrorBoundary>
        <Suspense fallback={<div style={{ minHeight: '100vh' }} />}>
          <AnimatedRoutes isDark={isDark} />
        </Suspense>
      </ErrorBoundary>

      <AskAIFAB />
      <Footer />
    </BrowserRouter>
  );
};

export default App;
