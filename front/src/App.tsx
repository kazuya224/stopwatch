import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home.js';
import Register from './pages/Register.js';
import Login from './pages/Login.js';
import './App.css';

function App() {
  return (
    <Router>
      {/* <nav className="navbar">
        <Link to="/" className="nav-link">共有ボード</Link>
        <Link to="/register" className="nav-link">新規登録</Link>
        <Link to="/login" className="nav-link">ログイン</Link>
      </nav> */}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;