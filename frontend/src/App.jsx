import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Parts from './pages/Parts';
import Cart from './pages/Cart';
import Admin from './pages/Admin';
import Forum from './pages/Forum';
import Chat from './pages/Chat';
import LoginForm from './components/LoginForm';
import PartsList from './components/PartsList';
import ChatWidget from './components/ChatWidget';
import Header from './components/Header';
import Footer from './components/Footer';
export default function App() {
    return (
        <BrowserRouter>
            <Header />
            <main style={{ padding: '1rem' }}>
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/login' element={<LoginForm />} />
                    <Route path='/parts' element={<Parts />} />
                    <Route path='/cart' element={<Cart />} />
                    <Route path='/admin' element={<Admin />} />
                    <Route path='/forum' element={<Forum />} />
                    <Route path='/chat' element={<Chat />} />
                </Routes>
            </main>
            <Footer />
        </BrowserRouter>
    );
}