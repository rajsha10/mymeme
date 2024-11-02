import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import ImageUpload from './pages/ImageUpload';
import FeedPage from './pages/FeedPage';
import './App.css';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<FeedPage />} />
        <Route path="/upload" element={<ImageUpload />} />
      </Routes>
    </Router>
  );
}

export default App;
