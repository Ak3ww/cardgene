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
        
        {/* Dynamic Card Routes - handles any egcard ID */}
        <Route path="/egcard/:cardId" element={<DynamicCard />} />
        
        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
