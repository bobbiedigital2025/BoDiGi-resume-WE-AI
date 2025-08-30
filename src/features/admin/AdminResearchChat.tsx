import React, { useState } from 'react';

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

const AdminResearchChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');

  // Placeholder for AI response logic
  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: Message = { sender: 'user', text: input };
    setMessages([...messages, userMsg]);
    setInput('');
    // Simulate AI response
    setTimeout(() => {
      const aiMsg: Message = {
        sender: 'ai',
        text: 'Researching your query: ' + userMsg.text,
      };
      setMessages(msgs => [...msgs, aiMsg]);
    }, 1000);
  };

  return (
    <div className="admin-research-chat" style={{ maxWidth: 500, margin: '0 auto', border: '1px solid #ccc', borderRadius: 8, padding: 16 }}>
      <h2>Admin Research Chat</h2>
      <div style={{ height: 300, overflowY: 'auto', marginBottom: 16, background: '#f9f9f9', padding: 8, borderRadius: 4 }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ textAlign: msg.sender === 'user' ? 'right' : 'left', margin: '8px 0' }}>
            <span style={{ background: msg.sender === 'user' ? '#d1e7dd' : '#e2e3e5', padding: '6px 12px', borderRadius: 16, display: 'inline-block' }}>
              {msg.text}
            </span>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask about new tech..."
          style={{ flex: 1, padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
        />
        <button onClick={handleSend} style={{ padding: '8px 16px', borderRadius: 4, background: '#0d6efd', color: '#fff', border: 'none' }}>
          Send
        </button>
      </div>
    </div>
  );
};

export default AdminResearchChat;
