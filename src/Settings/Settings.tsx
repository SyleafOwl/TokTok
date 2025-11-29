// src/Settings.tsx
import React, { useEffect, useState } from 'react';
import './Settings.css';
import { getUserProfile, UserProfile } from '../Perfil/userStore';
import ConfigNiveles from './ConfigNiveles';

interface SettingsProps {
  onBack: () => void;
  onLogout: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onBack, onLogout }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [subPage, setSubPage] = useState<'main' | 'niveles'>('main');

  useEffect(() => { setProfile(getUserProfile()) }, [])
// SI ESTAMOS EN LA SUB-PÁGINA DE NIVELES, MOSTRAMOS ESE COMPONENTE
  if (subPage === 'niveles') {
      return <ConfigNiveles onBack={() => setSubPage('main')} usuario={profile?.username || ''} />;
  }

  return (
    <div className="settings-container">
      <header className="settings-header">
        <button onClick={onBack} className="back-button">&larr; Volver</button>
        <h1>Ajustes y Privacidad</h1>
      </header>

      <div className="settings-content">
        <div className="settings-section">
          <h2>Tu información</h2>
          <div className="settings-item"><span>Perfil</span><span>{profile?.username || '—'}</span></div>
          <div className="settings-item"><span>Usuario</span><span>{profile?.username || '—'}</span></div>
          <div className="settings-item"><span>Correo/Teléfono</span><span>{profile?.contact || '—'}</span></div>
          <div className="settings-item"><span>Tipo de usuario</span><span>{profile?.role === 'streamer' ? 'Streamer' : profile?.role === 'viewer' ? 'Viewer' : '—'}</span></div>
        </div>

        {/* --- NUEVA SECCIÓN: COMUNIDAD (Solo para Streamers) --- */}
        {profile?.role === 'streamer' && (
            <div className="settings-section">
                <h2>Comunidad y Gamificación</h2>
                <div className="settings-item" onClick={() => setSubPage('niveles')} style={{ cursor: 'pointer' }}>
                    <span>Configurar Puntos por Nivel</span>
                    <span>&gt;</span>
                </div>
            </div>
        )}
    
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
          <div className="settings-item"><span>Notificaciones </span><span>&gt;</span></div>
          <div className="settings-item"><span>Notificaciones en la aplicación</span><span>&gt;</span></div>
        </div>
        
        
        <div className="settings-section">
            <h2>Cuenta</h2>
            <button className="logout-button" onClick={onLogout}>
                Cerrar Sesión
            </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;