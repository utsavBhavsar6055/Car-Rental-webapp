import React, { useEffect, useRef, useState } from 'react';
import { Bot, MessageCircle, Send, X } from 'lucide-react';
import { api } from '../api/client';

const welcomeMessage = {
  id: 'welcome',
  role: 'assistant',
  text: 'Hi! I’m the RideFlow assistant. How can I help with your rental today?',
};

export default function Chatbot({ dateFrom, dateTo }) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([welcomeMessage]);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmedMessage = message.trim();
    if (!trimmedMessage || isSending) return;

    const userMessage = { id: crypto.randomUUID(), role: 'user', text: trimmedMessage };
    setMessages((current) => [...current, userMessage]);
    setMessage('');
    setIsSending(true);

    try {
      const data = await api.sendChatMessage(trimmedMessage, { dateFrom, dateTo });
      setMessages((current) => [
        ...current,
        { id: crypto.randomUUID(), role: 'assistant', text: data.response },
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          isError: true,
          text: error.message || 'I could not reach the assistant. Please try again shortly.',
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <aside className="chatbot" aria-label="RideFlow chat assistant">
      {isOpen && (
        <section id="chatbot-panel" className="chatbot-panel" aria-live="polite">
          <header className="chatbot-header">
            <span className="chatbot-avatar"><Bot size={19} /></span>
            <div>
              <strong>RideFlow Assistant</strong>
              <span>Here to help with your rental</span>
            </div>
            <button
              className="chatbot-close"
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat assistant"
            >
              <X size={18} />
            </button>
          </header>

          <div className="chatbot-messages">
            {messages.map((chatMessage) => (
              <p
                className={`chatbot-message chatbot-message-${chatMessage.role}${chatMessage.isError ? ' is-error' : ''}`}
                key={chatMessage.id}
              >
                {chatMessage.text}
              </p>
            ))}
            {isSending && <p className="chatbot-typing">Assistant is thinking<span>...</span></p>}
            <div ref={messagesEndRef} />
          </div>

          <form className="chatbot-form" onSubmit={handleSubmit}>
            <label className="sr-only" htmlFor="chatbot-message">Message the assistant</label>
            <input
              id="chatbot-message"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Ask about rentals..."
              disabled={isSending}
              autoComplete="off"
            />
            <button type="submit" disabled={!message.trim() || isSending} aria-label="Send message">
              <Send size={17} />
            </button>
          </form>
        </section>
      )}

      <button
        className="chatbot-toggle"
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-controls="chatbot-panel"
      >
        {isOpen ? <X size={22} /> : <MessageCircle size={22} />}
        <span>{isOpen ? 'Close chat' : 'Need help?'}</span>
      </button>
    </aside>
  );
}
