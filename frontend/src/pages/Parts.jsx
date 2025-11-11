import React, { useEffect, useState } from 'react';
import { fetchJson } from '../api';

export default function Parts() {
  const [parts, setParts] = useState([]);
  const [err, setErr] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchJson('/parts');
        setParts(data);
      } catch (e) {
        setErr(e.message);
      }
    })();
  }, []);

  const addToCart = (part) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (!cart.find(c=>c.id === part.id)) {
      cart.push({...part, qty:1});
      localStorage.setItem('cart', JSON.stringify(cart));
      alert(`${part.name} hinzugefügt`);
    } else {
      alert('Schon im Warenkorb');
    }
  };

  if (err) return <div>Error: {err}</div>;
  return (
    <div>
      <h2>Teile</h2>
      <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12}}>
        {parts.map(p => (
          <div key={p.id} style={{border:'1px solid #ccc', padding:8}}>
            <img src={p.img} alt={p.name} style={{width:'100%'}}/>
            <h3>{p.name}</h3>
            <p>{p.price} €</p>
            <button onClick={()=>addToCart(p)}>Hinzufügen</button>
          </div>
        ))}
      </div>
    </div>
  );
}
