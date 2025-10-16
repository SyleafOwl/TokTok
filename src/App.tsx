// src/App.tsx
import React, { useState } from 'react';
import TokTokHome from './Home';
import Settings from './Settings';
import Nosotros from './pages/Nosotros'; 

const App: React.FC = () => {
  
  const [currentPage, setCurrentPage] = useState('home');

 
  const navigateToSettings = () => {
    setCurrentPage('settings');
  };
  const navigateToHome = () => {
    setCurrentPage('home');
  };
  const navigateToNosotros = () => { 
    setCurrentPage('nosotros');
  };
  
  const handleLogout = () => {
    console.log("Cerrando sesión...");
    setCurrentPage('home');
  };

 
  if (currentPage === 'home') {
    return <TokTokHome onNavigateToSettings={navigateToSettings} onNavigateToNosotros={navigateToNosotros} />;
  } 
  
  if (currentPage === 'settings') {
    return <Settings onBack={navigateToHome} onLogout={handleLogout} />;
  } 
  
  if (currentPage === 'nosotros') {
    return <Nosotros onBack={navigateToHome} />;
  }


  return <div>Página no encontrada</div>;
};

export default App;

