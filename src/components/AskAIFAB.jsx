import React from 'react';
import { Link } from 'react-router-dom';

const AskAIFAB = () => {
  return (
    <Link to="/ai-assistant" className="ask-ai-fab" aria-label="Ask AI Assistant">
      <i className="fa-solid fa-robot"></i>
    </Link>
  );
};

export default AskAIFAB;
