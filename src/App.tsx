import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Loader2, Sparkles, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import './index.css';

import { generateAssistantResponse } from './services/geminiService';
import { gatherUserContext } from './utils/contextEngine';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I am Nova, your Intelligent Workstream Assistant. I have loaded your current workspace context. How can I help you today?"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Gather Real-time context right before sending
      const context = gatherUserContext();
      
      const response = await generateAssistantResponse(userMessage.content, context);
      
      const assistantMessage: Message = { 
        id: (Date.now() + 1).toString(), 
        role: 'assistant', 
        content: response 
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm sorry, I am having trouble connecting to my cognitive engine right now."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container" style={{ display: 'flex', height: '100vh', padding: '1rem', gap: '1rem', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* Sidebar - Context Dashboard */}
      <motion.aside 
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="glass-panel" 
        style={{ width: '300px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ background: 'var(--accent-gradient)', padding: '0.5rem', borderRadius: '8px' }}>
            <Sparkles size={24} color="white" />
          </div>
          <h2 className="text-gradient">Nova</h2>
        </div>

        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
            <LayoutDashboard size={18} />
            <h3 style={{ fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Live Context</h3>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Status</span>
              <span style={{ color: 'var(--success)' }}>● Online</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Active Project</span>
              <span>Prompt Wars</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Local Time</span>
              <span>{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Main Chat Interface */}
      <motion.main 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-panel" 
        style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}
      >
        {/* Chat History */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div 
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ 
                  display: 'flex', 
                  gap: '1rem',
                  flexDirection: msg.role === 'user' ? 'row-reverse' : 'row'
                }}
              >
                <div style={{ 
                  width: '40px', height: '40px', borderRadius: '50%', 
                  background: msg.role === 'user' ? 'rgba(255,255,255,0.1)' : 'var(--accent-gradient)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                </div>
                
                <div style={{ 
                  background: msg.role === 'user' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.2)',
                  padding: '1rem 1.5rem',
                  borderRadius: '16px',
                  borderTopRightRadius: msg.role === 'user' ? '0' : '16px',
                  borderTopLeftRadius: msg.role === 'assistant' ? '0' : '16px',
                  maxWidth: '80%',
                  border: '1px solid var(--glass-border)'
                }}>
                  {msg.role === 'assistant' ? (
                    <div className="markdown-body" style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <p style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>{msg.content}</p>
                  )}
                </div>
              </motion.div>
            ))}
            {isLoading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', gap: '1rem' }}>
                 <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Bot size={20} />
                </div>
                <div style={{ padding: '1rem', display: 'flex', alignItems: 'center' }}>
                  <Loader2 size={20} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
                  <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div style={{ padding: '1.5rem', borderTop: '1px solid var(--glass-border)', background: 'rgba(15, 23, 42, 0.4)' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '1rem', position: 'relative' }}>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Nova to analyze context, schedule a task, or help with code..."
              className="input-glass"
              style={{ flex: 1, paddingRight: '4rem' }}
              disabled={isLoading}
            />
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isLoading || !input.trim()}
              style={{ position: 'absolute', right: '0.5rem', top: '0.5rem', bottom: '0.5rem', padding: '0 1.25rem' }}
            >
              <Send size={18} />
            </button>
          </form>
          <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.75rem' }}>
            Nova uses Gemini 1.5 and local context to provide intelligent responses.
          </p>
        </div>
      </motion.main>
    </div>
  );
}

export default App;
