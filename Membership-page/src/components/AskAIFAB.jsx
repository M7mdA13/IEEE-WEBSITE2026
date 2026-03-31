import React from 'react';

const AskAIFAB = ({ onClick }) => {
  return (
    <button onClick={onClick} className="ask-ai-fab" aria-label="Ask AI Assistant">
      <i className="fa-solid fa-robot"></i>
    </button>
  );
};

export default AskAIFAB;
