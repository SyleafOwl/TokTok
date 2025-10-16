// src/Settings.tsx
import React from 'react';
import './Settings.css';

interface SettingsProps {
  onBack: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onBack }) => {
  return (
    <div className="settings-container">
      <header className="settings-header">
        <button onClick={onBack} className="back-button">&larr; Volver</button>
        <h1>Settings y privacidad</h1>
      </header>
      <div className="settings-content">
        <div className="settings-section">
          <h2>Apariencia</h2>
          <p>Personaliza cómo se ve la aplicación.</p>
          <div className="theme-options">
            <div className="theme-option active">Modo Oscuro</div>
            <div className="theme-option">Modo Claro</div>
          </div>
        </div>
        <div className="settings-section">
          <h2>Privacidad</h2>
          <div className="settings-item"><span>Cuenta privada</span><span>&gt;</span></div>
          <div className="settings-item"><span>Sugerir tu cuenta a otros</span><span>&gt;</span></div>
        </div>
        <div className="settings-section">
          <h2>Notificaciones</h2>
          <div className="settings-item"><span>Notificaciones</span><span>&gt;</span></div>
          <div className="settings-item"><span>Notificaciones en la aplicación</span><span>&gt;</span></div>
        </div>
      </div>
    </div>
  );
};

export default Settings;