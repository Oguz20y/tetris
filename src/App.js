import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AnaSayfa from './bilesenler/AnaSayfa';
import Tetris from './bilesenler/Tetris';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AnaSayfa />} />
        <Route path="/Tetris" element={<Tetris />} />
      </Routes>
    </Router>
  );
};

export default App;