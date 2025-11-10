// PartsList.jsx
import React, { useEffect, useState } from 'react';

export default function PartsList() {
  const [parts, setParts] = useState([]);

  useEffect(() => {
    fetch('/api/parts')
      .then(r => r.json())
      .then(setParts);
  }, []);

  const addToCart = (part) => {
    // Für eingeloggte: POST /api/cart
    // Für Gäste: localStorage
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (!cart.find(p => p.id === part.id)) {
      cart.push(part);
      localStorage.setItem('cart', JSON.stringify(cart));
      alert(`${part.name} hinzugefügt`);
    } else alert('Schon im Warenkorb');
  };

  return (
    <div className="grid">
      {parts.map(p => (
        <div key={p.id} className="card">
          <img src={p.img} alt={p.name} />
          <h3>{p.name}</h3>
          <p>{p.price} €</p>
          <button onClick={() => addToCart(p)}>Hinzufügen</button>
        </div>
      ))}
    </div>
  );
}
