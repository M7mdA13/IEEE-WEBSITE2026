import React, { useState, useRef, useEffect } from 'react';
import api from '../../api/public';
import './AIAssistant.css';

const suggestions = [
  "What is IEEE MUST SB?",
  "How to join?",
  "What committees are available?",
  "Benefits of joining?",
  "Who leads the branch?",
];

const AIAssistant = () => {
  const initialMessages = [
    { role: 'assistant', text: "Hello! I'm the IEEE MUST digital assistant. How can I help you today?" },
    { role: 'assistant', text: "**Quick Links**:\n[Home](/) | [About](/about) | [Membership](/membership) | [Events](/events) | [Committees](/committees)\n\n**Socials**:\n[Facebook](https://www.facebook.com/IEEEMUST.egy) | [Instagram](https://www.instagram.com/ieeemust/) | [LinkedIn](https://www.linkedin.com/company/mustieeesb/) | [TikTok](https://www.tiktok.com/@ieee.must.sb)" }
  ];

  const [messages, setMessages] = useState(initialMessages);
  const [inputStr, setInputStr] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasStartedChat, setHasStartedChat] = useState(false);
  const chatLogRef = useRef(null);

  const scrollToBottom = () => {
    if (chatLogRef.current) {
      chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
    }
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
    setHasStartedChat(true);

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

  // Advanced Custom Regex Markdown Parser for **bold** and [links](urls)
  const formatText = (text) => {
    return text.split('\n').map((line, i) => {
      // Split by bold (**text**) or markdown links ([text](url))
      const parts = line.split(/(\*\*.*?\*\*|\[.*?\]\(.*?\))/g).map((part, j) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={j} style={{ color: '#0096ED' }}>{part.slice(2, -2)}</strong>;
        }
        
        const linkMatch = part.match(/\[(.*?)\]\((.*?)\)/);
        if (linkMatch) {
          return (
            <a 
              key={j} 
              href={linkMatch[2]} 
              target={linkMatch[2].startsWith('http') ? '_blank' : '_self'} 
              rel="noopener noreferrer" 
              style={{ color: '#24F0FF', textDecoration: 'underline', fontWeight: 'bold' }}
            >
              {linkMatch[1]}
            </a>
          );
        }
        
        return part;
      });

      return (
        <span key={i} style={{ display: 'block', minHeight: '1.2em' }}>
          {parts}
        </span>
      );
    });
  };

  const handleResetChat = () => {
    setMessages(initialMessages);
    setHasStartedChat(false);
  };

  return (
    <div className="ai-assistant-page">
      <div className="ai-content-wrapper">
        {!hasStartedChat ? (
          <>
            <img
              src="/images/robot-assistant.svg"
              alt="Robot Assistant"
              className="robot-icon"
              width="140"
              height="140"
              style={{ objectFit: 'contain', minHeight: '140px', marginBottom: '5px' }}
            />
            <h1 className="greeting-text">Hello! How can I help?</h1>

            <div className="search-container start-screen-search">
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

            <div className="suggestions-container-start">
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
          </>
        ) : (
          <>
            <div className="ai-header" style={{ position: 'relative', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <img
                src="/images/robot-assistant.svg"
                alt="Robot Assistant"
                className="robot-icon"
                width="80"
                height="80"
                style={{ objectFit: 'contain', minHeight: '80px' }}
              />
              <h1 className="greeting-text-small">IEEE MUST AI</h1>
              
              {/* Reset Chat Button */}
              <button 
                onClick={handleResetChat}
                style={{
                  position: 'absolute',
                  right: '0',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: '1px solid rgba(0, 152, 237, 0.4)',
                  color: '#90CAF9',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(0, 152, 237, 0.1)'; e.currentTarget.style.borderColor = '#0098ED'; }}
                onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(0, 152, 237, 0.4)'; }}
              >
                <i className="fas fa-undo"></i> Reset
              </button>
            </div>

            <div className="chat-container">
              <div className="chat-log" ref={chatLogRef}>
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
              </div>

              <div className="search-container chat-box-search">
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
          </>
        )}
      </div>
    </div>
  );
};

export default AIAssistant;
