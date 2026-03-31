import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import MembershipPage from './components/MembershipPage';
import Footer from './components/Footer';
import AskAIFAB from './components/AskAIFAB';

// Use same css as before
import './index.css';

const App = () => {
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });
  const [currentPage, setCurrentPage] = useState('home'); // 'home' or 'membership' or 'ai'
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

  const handleHomeClick = () => {
    setCurrentPage('home');
    setShowAiPage(false);
  };

  const handleMembershipClick = () => {
    setCurrentPage('membership');
    setShowAiPage(false);
  };

  const toggleAiPage = () => {
    setShowAiPage((prev) => !prev);
  };

  return (
    <>
      <Navbar 
        isDark={isDark} 
        toggleTheme={toggleTheme} 
        onHomeClick={handleHomeClick} 
        onMembershipClick={handleMembershipClick} 
      />
      
      {showAiPage ? (
        <AiAssistantPage />
      ) : currentPage === 'membership' ? (
        <MembershipPage />
      ) : (
        <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>
          <div>
            <h1>Welcome to IEEE MUST SB</h1>
            <p style={{ marginTop: '1rem', color: isDark ? '#ccc' : '#555' }}>
              Select a page from the navbar or click the robot for help!
            </p>
          </div>
        </div>
      )}

      <AskAIFAB onClick={toggleAiPage} />
      <Footer />
    </>
  );
};

export default App;
