import React from 'react';
import '../AiAssistantPage.css';

const AiAssistantPage = () => {
  const suggestions = [
    "Benefits of joining?",
    "How to join?",
    "What is IEEE MUST SB?",
    "What is EMBS?",
    "IEEE MUST SB activities & events"
  ];

  return (
    <div className="ai-assistant-page">
      <div className="ai-content-wrapper">
        <img 
          src="/images/robot-assistant.svg" 
          alt="Robot Assistant" 
          className="robot-icon"
        />
        <h1 className="greeting-text">Hello! How can I help?</h1>
        
        <div className="search-container">
          <input 
            type="text" 
            placeholder="Ask anything..." 
            className="search-input"
          />
          <button className="send-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>

        <div className="suggestions-container">
          {suggestions.map((text, idx) => (
            <button key={idx} className="suggestion-pill">
              {text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AiAssistantPage;
