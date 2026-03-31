import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import AiAssistantPage from './components/AiAssistantPage';
import Footer from './components/Footer';
import AskAIFAB from './components/AskAIFAB';

// Use same css as before
import './index.css';

const App = () => {
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });
  const [showAiPage, setShowAiPage] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  return (
    <>
      {/* SVG Filters for Glass Surface Effect */}
      <svg className="w-full h-full pointer-events-none absolute inset-0 opacity-0 -z-50" xmlns="http://www.w3.org/2000/svg" style={{ position: 'fixed', width: 0, height: 0 }}>
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

      <Navbar isDark={isDark} toggleTheme={toggleTheme} onHomeClick={() => setShowAiPage(false)} />
      
      {showAiPage ? (
        <AiAssistantPage />
      ) : (
        <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>
          <div>
            <h1>Welcome to IEEE MUST SB</h1>
            <p style={{ marginTop: '1rem', color: isDark ? '#ccc' : '#555' }}>
              Click the floating robot button in the bottom right to talk to our AI Assistant!
            </p>
          </div>
        </div>
      )}

      <AskAIFAB onClick={() => setShowAiPage((prev) => !prev)} />
      <Footer />
    </>
  );
};

export default App;
