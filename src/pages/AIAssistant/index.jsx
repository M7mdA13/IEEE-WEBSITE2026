import React, { useState, useRef, useEffect } from 'react';
import api from '../../api/public';
import './AIAssistant.css';

const suggestions = [
  "Benefits of joining?",
  "How to join?",
  "What is IEEE MUST SB?",
  "What is EMBS?",
  "IEEE MUST SB activities & events"
];

const AIAssistant = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Hello! I'm the IEEE MUST digital assistant. How can I help you today?" }
  ]);
  const [inputStr, setInputStr] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (text) => {
    if (!text.trim()) return;
    
    const userMsg = { role: 'user', text: text.trim() };
    const newHistory = [...messages, userMsg];
    
    setMessages(newHistory);
    setInputStr('');
    setIsLoading(true);

    try {
      const response = await api.post('/ai/chat', {
        message: text.trim(),
        history: messages // Pass the old messages so the AI remembers context
      });
      
      const { data } = response;
      if (data.success) {
        setMessages([...newHistory, { role: 'assistant', text: data.reply }]);
      } else {
        setMessages([...newHistory, { role: 'assistant', text: data.message || "I'm having trouble connecting right now." }]);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "I'm having trouble thinking right now. Please check my AI circuits!";
      setMessages([...newHistory, { role: 'assistant', text: errorMsg }]);
    } finally {
      setIsLoading(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSend(inputStr);
    }
  };

  // Convert URLs or simple markdown bold in the bot output (optional tiny parser)
  const formatText = (text) => {
    return text.split('\n').map((line, i) => (
      <React.Fragment key={i}>
        {line}
        <br />
      </React.Fragment>
    ));
  };

  return (
    <div className="ai-assistant-page">
      <div className="ai-content-wrapper">
        <div className="ai-header">
          <img
            src="/images/robot-assistant.svg"
            alt="Robot Assistant"
            className="robot-icon"
            width="80"
            height="80"
            style={{ objectFit: 'contain', minHeight: '80px' }}
          />
          <h1 className="greeting-text">IEEE MUST AI</h1>
        </div>

        <div className="chat-container">
          <div className="chat-log">
            {messages.map((msg, idx) => (
              <div key={idx} className={`chat-bubble-wrapper ${msg.role}`}>
                <div className="chat-bubble">
                  {formatText(msg.text)}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="chat-bubble-wrapper assistant">
                <div className="chat-bubble typing">
                  <div className="dot"></div>
                  <div className="dot"></div>
                  <div className="dot"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {messages.length === 1 && (
            <div className="suggestions-container">
              {suggestions.map((text, idx) => (
                <button 
                  key={idx} 
                  className="suggestion-pill"
                  onClick={() => handleSend(text)}
                  disabled={isLoading}
                >
                  {text}
                </button>
              ))}
            </div>
          )}

          <div className="search-container">
            <input
              type="text"
              placeholder="Ask anything..."
              className="search-input"
              value={inputStr}
              onChange={(e) => setInputStr(e.target.value)}
              onKeyDown={onKeyDown}
              disabled={isLoading}
            />
            <button 
              className="send-btn" 
              onClick={() => handleSend(inputStr)}
              disabled={isLoading}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
