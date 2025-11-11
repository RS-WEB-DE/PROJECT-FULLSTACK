import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export default function Chat() {
  const [socket, setSocket] = useState(null);
  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const s = io('http://localhost:3000', { auth: { token } }); // oder io(API_BASE)
    setSocket(s);

    s.on('chat-message', m => setMsgs(prev => [...prev, m]));
    return () => s.disconnect();
  }, []);

  const send = () => {
    if (!socket) return;
    socket.emit('chat-message', { token: localStorage.getItem('token'), message: text, from: 'Client' });
    setText('');
  };

  return (
    <div>
      <h2>Chat</h2>
      <div style={{height:300, overflow:'auto', border:'1px solid #ddd', padding:8}}>
        {msgs.map((m,i) => <div key={i}><b>{m.from}:</b> {m.message}</div>)}
      </div>
      <input value={text} onChange={e=>setText(e.target.value)} />
      <button onClick={send}>Senden</button>
    </div>
  );
}
