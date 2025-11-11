import React from 'react';
import { Link } from 'react-router-dom';
export default function Header() {
return (
<header style={{ display:'flex', justifyContent:'space-around', padding:'1rem', borderBottom:'1px solid #ccc' }}>
<Link to='/'>Home</Link>
<Link to='/parts'>Teile</Link>
<Link to='/cart'>Warenkorb</Link>
<Link to='/forum'>Forum</Link>
<Link to='/chat'>Chat</Link>
<Link to='/admin'>Admin</Link>
<Link to='/login'>Login</Link>
</header>
);
}

