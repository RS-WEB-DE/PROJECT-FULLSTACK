// Chat.jsx
import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    socket.on('chat-message', (msg) => {
      setMessages(prev => [...prev, msg]);
    });
  }, []);

  const send = () => {
    socket.emit('chat-message', { message: text, from: 'Benutzer' });
    setText('');
  };

  return (
    <div>
      <div className="messages">
        {messages.map((m,i) => <div key={i}>{m.from}: {m.message}</div>)}
      </div>
      <input value={text} onChange={e=>setText(e.target.value)} />
      <button onClick={send}>Senden</button>
    </div>
  );
}
