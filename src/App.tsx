import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { EasterCard } from './components/EasterCard';
import { AdminDashboard } from './components/AdminDashboard';
import { DynamicCard } from './components/DynamicCard';

function App() {
  return (
    <Router>
      <Routes>
        {/* Default route - Easter Card */}
        <Route path="/" element={<EasterCard />} />
        
        {/* Admin Dashboard */}
        <Route path="/admin" element={<AdminDashboard />} />
        
        {/* Dynamic Card Routes */}
        <Route path="/egcard1" element={<DynamicCard cardId="egcard1" />} />
        <Route path="/egcard2" element={<DynamicCard cardId="egcard2" />} />
        <Route path="/egcard3" element={<DynamicCard cardId="egcard3" />} />
        <Route path="/egcard4" element={<DynamicCard cardId="egcard4" />} />
        <Route path="/egcard5" element={<DynamicCard cardId="egcard5" />} />
        
        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
