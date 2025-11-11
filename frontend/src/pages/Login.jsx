import React, { useState } from 'react';
import { fetchJson } from '../api';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetchJson('/auth/login', { method: 'POST', body: { username, password } });
      localStorage.setItem('token', res.token);
      onLogin(res.user);
    } catch (err) {
      setMsg('Login fehlgeschlagen: ' + err.message);
    }
  };

  return (
    <form onSubmit={submit}>
      <input value={username} onChange={e=>setUsername(e.target.value)} placeholder="Benutzer" />
      <input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="Passwort" />
      <button>Login</button>
      <div>{msg}</div>
    </form>
  );
}
