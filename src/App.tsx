// src/App.tsx
import React, { useState } from 'react';
import TokTokHome from './Home';
import Settings from './Settings';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');

  const navigateToSettings = () => {
    setCurrentPage('settings');
  };

  const navigateToHome = () => {
    setCurrentPage('home');
  };

  return (
    <div>
      {currentPage === 'home' ? (
        <TokTokHome onNavigateToSettings={navigateToSettings} />
      ) : (
        <Settings onBack={navigateToHome} />
      )}
    </div>
  );
};

export default App;
