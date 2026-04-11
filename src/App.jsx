import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AskAIFAB from './components/AskAIFAB';
import MeshBackground from './components/MeshBackground';
import Home from './pages/Home';
import Events from './pages/Events';
import Membership from './pages/Membership';
import About from './pages/About';
import Committees from './pages/Committees';
import Committee from './pages/Committee';
import AIAssistant from './pages/AIAssistant';
import NotFound from './pages/NotFound';
import './index.css';

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
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

// Disable browser scroll restoration so it never pre-scrolls on reload
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

const ScrollToTop = () => {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  return null;
};

const AnimatedRoutes = ({ isDark }) => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><Home isDark={isDark} /></PageWrapper>} />
        <Route path="/events" element={<PageWrapper><Events /></PageWrapper>} />
        <Route path="/membership" element={<PageWrapper><Membership /></PageWrapper>} />
        <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />
        <Route path="/committees" element={<PageWrapper><Committees /></PageWrapper>} />
        <Route path="/committees/:slug" element={<PageWrapper><Committee /></PageWrapper>} />
        <Route path="/ai-assistant" element={<PageWrapper><AIAssistant /></PageWrapper>} />
        <Route path="*" element={<PageWrapper><NotFound /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (isDark) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  return (
    <BrowserRouter>
      {/* SVG Filters for Glass Surface Effect */}
      <svg xmlns="http://www.w3.org/2000/svg" style={{ position: 'fixed', width: 0, height: 0, overflow: 'hidden' }}>
        <defs>
          <filter id="glass-filter-btn" colorInterpolationFilters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
            <feImage id="glass-map-btn" x="0" y="0" width="100%" height="100%" preserveAspectRatio="none" result="map" />
            <feDisplacementMap in="SourceGraphic" in2="map" id="btn-disp-red" scale="-180" xChannelSelector="R" yChannelSelector="G" result="dispRed" />
            <feColorMatrix in="dispRed" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="red" />
            <feDisplacementMap in="SourceGraphic" in2="map" id="btn-disp-green" scale="-170" xChannelSelector="R" yChannelSelector="G" result="dispGreen" />
            <feColorMatrix in="dispGreen" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="green" />
            <feDisplacementMap in="SourceGraphic" in2="map" id="btn-disp-blue" scale="-160" xChannelSelector="R" yChannelSelector="G" result="dispBlue" />
            <feColorMatrix in="dispBlue" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="blue" />
            <feBlend in="red" in2="green" mode="screen" result="rg" />
            <feBlend in="rg" in2="blue" mode="screen" result="output" />
            <feGaussianBlur id="glass-blur-btn" in="output" stdDeviation="0.7" />
          </filter>
        </defs>
      </svg>

      <MeshBackground />
      <ScrollToTop />
      <Navbar isDark={isDark} toggleTheme={toggleTheme} />

      <AnimatedRoutes isDark={isDark} />

      <AskAIFAB />
      <Footer />
    </BrowserRouter>
  );
};

export default App;
