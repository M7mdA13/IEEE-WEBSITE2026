import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const AskAIFAB = () => {
  const { pathname } = useLocation();
  if (pathname === '/ai-assistant') return null;
  return (
    <Link to="/ai-assistant" className="ask-ai-fab" aria-label="Ask AI Assistant">
      <i className="fa-solid fa-robot"></i>
    </Link>
  );
};

export default AskAIFAB;
