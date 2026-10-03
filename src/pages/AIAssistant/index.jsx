import React, { useState, useRef, useEffect, useCallback } from 'react';
import api from '../../api/public';
import './AIAssistant.css';

const suggestions = [
  "What is IEEE MUST SB?",
  "How to join?",
  "What committees are available?",
  "Benefits of joining?",
  "Who leads the branch?",
];

const TYPING_SPEED_MS = 12; // ms per character
const MAX_INPUT_CHARS = 1000; // must match MAX_MESSAGE_CHARS on the backend

/* ── Typewriter hook — reveals text character by character ── */
const useTypewriter = (fullText, active) => {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!active || !fullText) {
      setDisplayed(fullText || '');
      setDone(true);
      return;
    }

    setDisplayed('');
    setDone(false);
    let i = 0;
    const id = setInterval(() => {
      i++;
      setDisplayed(fullText.slice(0, i));
      if (i >= fullText.length) {
        clearInterval(id);
        setDone(true);
      }
    }, TYPING_SPEED_MS);

    return () => clearInterval(id);
  }, [fullText, active]);

  return { displayed, done };
};

/* ── Inline markdown: **bold** and [links](urls) ── */
const formatInline = (line) =>
  line.split(/(\*\*.*?\*\*|\[.*?\]\(.*?\))/g).map((part, j) => {
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

/* ── Block markdown — bullets get a real marker instead of a stray "- " ── */
const formatText = (text) => {
  return text.split('\n').map((line, i) => {
    const bullet = line.match(/^\s*[-*]\s+(.*)$/);

    if (bullet) {
      return (
        <span
          key={i}
          style={{ display: 'flex', gap: '8px', minHeight: '1.2em', paddingLeft: '4px' }}
        >
          <span style={{ color: '#0096ED', flexShrink: 0 }}>•</span>
          <span>{formatInline(bullet[1])}</span>
        </span>
      );
    }

    return (
      <span key={i} style={{ display: 'block', minHeight: '1.2em' }}>
        {formatInline(line)}
      </span>
    );
  });
};

/* ── Chat bubble with optional typewriter ── */
const ChatBubble = ({ msg, isLatestAssistant, onTypingProgress }) => {
  const shouldAnimate = msg.role === 'assistant' && isLatestAssistant && msg._animate;
  const { displayed, done } = useTypewriter(msg.text, shouldAnimate);
  const textToShow = shouldAnimate ? displayed : msg.text;

  useEffect(() => {
    if (shouldAnimate && onTypingProgress) {
      onTypingProgress();
    }
  }, [displayed, shouldAnimate, onTypingProgress]);

  return (
    <div className={`chat-bubble-wrapper ${msg.role}`}>
      <div className={`chat-bubble ${shouldAnimate && !done ? 'typing-active' : ''}`}>
        {formatText(textToShow)}
        {shouldAnimate && !done && <span className="typing-cursor" />}
      </div>
    </div>
  );
};

/* Scripted welcome bubbles — always the first entries in `messages`, and never
   sent to the model as conversation history. */
const initialMessages = [
  { role: 'assistant', text: "Hello! I'm the IEEE MUST digital assistant. How can I help you today?" },
  { role: 'assistant', text: "**Quick Links**:\n[Home](/) | [About](/about) | [Membership](/membership) | [Events](/events) | [Committees](/committees)\n\n**Socials**:\n[Facebook](https://www.facebook.com/IEEEMUST.egy) | [Instagram](https://www.instagram.com/ieeemust/) | [LinkedIn](https://www.linkedin.com/company/mustieeesb/) | [TikTok](https://www.tiktok.com/@ieee.must.sb)" }
];

const AIAssistant = () => {
  const [messages, setMessages] = useState(initialMessages);
  const [inputStr, setInputStr] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasStartedChat, setHasStartedChat] = useState(false);
  const chatLogRef = useRef(null);
  const abortRef = useRef(null);

  // Drop any in-flight request if the user navigates away mid-answer
  useEffect(() => () => abortRef.current?.abort(), []);

  const scrollToBottom = useCallback(() => {
    if (chatLogRef.current) {
      chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  const handleSend = async (text) => {
    const trimmed = text.trim().slice(0, MAX_INPUT_CHARS);
    if (!trimmed || isLoading) return; // ignore empty sends and double-fires

    const userMsg = { role: 'user', text: trimmed };
    const newHistory = [...messages, userMsg];

    setMessages(newHistory);
    setInputStr('');
    setIsLoading(true);
    setHasStartedChat(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const { data } = await api.post(
        '/ai/chat',
        {
          message: trimmed,
          // `messages` always opens with the scripted welcome bubbles. They
          // aren't real turns — the backend strips them too, but there's no
          // point paying to send them.
          history: messages.slice(initialMessages.length),
        },
        { signal: controller.signal }
      );

      const reply = data.success
        ? data.reply
        : data.message || "I'm having trouble connecting right now.";

      setMessages([...newHistory, { role: 'assistant', text: reply, _animate: true }]);
    } catch (err) {
      if (err.name === 'AbortError') return; // user reset or left the page
      const errorMsg =
        err.response?.data?.message ||
        "I'm having trouble thinking right now. Please check my AI circuits!";
      setMessages([...newHistory, { role: 'assistant', text: errorMsg, _animate: true }]);
    } finally {
      if (abortRef.current === controller) abortRef.current = null;
      setIsLoading(false);
    }
  };

  const onKeyDown = (e) => {
    // Shift+Enter inserts a newline; plain Enter sends
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(inputStr);
    }
  };

  const handleResetChat = () => {
    abortRef.current?.abort();
    abortRef.current = null;
    setIsLoading(false);
    setMessages(initialMessages);
    setHasStartedChat(false);
  };

  // Find the index of the last assistant message (for typewriter targeting)
  const lastAssistantIdx = (() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === 'assistant') return i;
    }
    return -1;
  })();

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
                maxLength={MAX_INPUT_CHARS}
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
                  <ChatBubble
                    key={idx}
                    msg={msg}
                    isLatestAssistant={idx === lastAssistantIdx}
                    onTypingProgress={scrollToBottom}
                  />
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
                  maxLength={MAX_INPUT_CHARS}
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
