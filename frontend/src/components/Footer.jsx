import React from 'react';
import { Link } from 'react-router-dom';
export default function Footer() {
return (
<footer style={{ borderTop:'1px solid #ccc', padding:'1rem', marginTop:'2rem', textAlign:'center' }}>
<Link to='/datenschutz'>Datenschutz</Link> | <Link to='/impressum'>Impressum</Link>
</footer>
);
}