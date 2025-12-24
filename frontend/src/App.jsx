import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Predictions from './pages/Predictions';
import Alerts from './pages/Alerts';
import Certifications from './pages/Certifications';
import Profile from './pages/Profile';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [farmer, setFarmer] = useState(null);

  useEffect(() => {
    // Check for existing auth token
    const token = localStorage.getItem('aura_token');
    const farmerData = localStorage.getItem('aura_farmer');
    
    if (token && farmerData) {
      setIsAuthenticated(true);
      setFarmer(JSON.parse(farmerData));
    }
  }, []);

  const handleLogin = (token, farmerData) => {
    localStorage.setItem('aura_token', token);
    localStorage.setItem('aura_farmer', JSON.stringify(farmerData));
    setIsAuthenticated(true);
    setFarmer(farmerData);
  };

  const handleLogout = () => {
    localStorage.removeItem('aura_token');
    localStorage.removeItem('aura_farmer');
    setIsAuthenticated(false);
    setFarmer(null);
  };

  return (
    <div className="app">
      <Routes>
        <Route 
          path="/login" 
          element={
            isAuthenticated ? 
            <Navigate to="/dashboard" /> : 
            <Login onLogin={handleLogin} />
          } 
        />
        <Route 
          path="/register" 
          element={
            isAuthenticated ? 
            <Navigate to="/dashboard" /> : 
            <Register onRegister={handleLogin} />
          } 
        />
        
        {/* Protected Routes */}
        <Route 
          path="/dashboard" 
          element={
            isAuthenticated ? 
            <Dashboard farmer={farmer} onLogout={handleLogout} /> : 
            <Navigate to="/login" />
          } 
        />
        <Route 
          path="/predictions" 
          element={
            isAuthenticated ? 
            <Predictions farmer={farmer} onLogout={handleLogout} /> : 
            <Navigate to="/login" />
          } 
        />
        <Route 
          path="/alerts" 
          element={
            isAuthenticated ? 
            <Alerts farmer={farmer} onLogout={handleLogout} /> : 
            <Navigate to="/login" />
          } 
        />
        <Route 
          path="/certifications" 
          element={
            isAuthenticated ? 
            <Certifications farmer={farmer} onLogout={handleLogout} /> : 
            <Navigate to="/login" />
          } 
        />
        <Route 
          path="/profile" 
          element={
            isAuthenticated ? 
            <Profile farmer={farmer} onLogout={handleLogout} /> : 
            <Navigate to="/login" />
          } 
        />
        
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </div>
  );
}

export default App;
