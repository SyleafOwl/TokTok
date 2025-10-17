// src/LogRegYTerm/LoginScreen.tsx

import React, { useState } from 'react';
import TerminosCondiciones from './TerminosCondiciones.tsx';

type LoginOption = 'phoneEmail' | 'qrCode' | 'social';
type UserType = 'Streamer' | 'Viewer' | '';

// Icono de Google simple (SVG)
const GoogleIcon: React.FC<{ size?: number }> = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden>
    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.65 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.957 3.043l5.657-5.657C33.373 6.053 28.915 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.651-.389-3.917z"/>
    <path fill="#FF3D00" d="M6.306 14.691l6.571 4.816C14.654 15.108 19.001 12 24 12c3.059 0 5.842 1.154 7.957 3.043l5.657-5.657C33.373 6.053 28.915 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
    <path fill="#4CAF50" d="M24 44c4.867 0 9.269-1.86 12.6-4.899l-5.828-4.936C28.734 35.523 26.501 36.4 24 36.4c-5.183 0-9.594-3.317-11.235-7.946l-6.53 5.031C9.567 39.556 16.227 44 24 44z"/>
    <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.793 2.236-2.237 4.166-4.23 5.581l.003-.002 5.828 4.936C35.897 40.08 44 34 44 24c0-1.341-.138-2.651-.389-3.917z"/>
  </svg>
)

const GoogleButton: React.FC<{ onClick?: () => void }> = ({ onClick }) => (
  <button
    onClick={onClick}
    style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%',
      gap: 10, padding: '12px', margin: '10px 0',
      border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8,
      cursor: 'pointer', background: 'transparent', fontSize: 16,
      color: 'var(--text-primary)', fontWeight: 700,
    }}
  >
    <GoogleIcon />
    Continuar con Google
  </button>
)

interface LoginScreenProps {
  show?: boolean
  onSuccess: () => void
  onClose?: () => void
  // opcional: reportar usuario/rol al app
  onLoginCustom?: (username: string, role: 'viewer' | 'streamer') => void
}

const LoginScreen: React.FC<LoginScreenProps> = ({ show = true, onSuccess, onLoginCustom }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('signup');
  const [selectedOption, setSelectedOption] = useState<LoginOption>('phoneEmail');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [userType, setUserType] = useState<UserType>('');
  const [acceptedTerms, setAcceptedTerms] = useState<boolean>(false);
  const [view, setView] = useState<'login' | 'terms'>('login');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Viewer por defecto
    if (username === 'admin' && password === 'admin') {
      onLoginCustom && onLoginCustom('admin', 'viewer')
      onSuccess();
      return;
    }
    // Streamer 1
    if (username === 'Streamer1' && password === '1234') {
      onLoginCustom && onLoginCustom('Streamer1', 'streamer')
      onSuccess();
      return;
    }
    alert('Credenciales inválidas. Usa viewer: admin/admin o streamer: Streamer1/1234');
  };

  const overlayStyle: React.CSSProperties = {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000,
  };
  const containerStyle: React.CSSProperties = {
    maxWidth: '420px', margin: '50px auto', padding: '28px',
    background: 'var(--sidebar-bg)', color: 'var(--text-primary)',
    borderRadius: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.35)', textAlign: 'center', fontFamily: 'inherit'
  };

  if (!show) return null;
  if (view === 'terms') {
    return (
      <div style={overlayStyle}>
        <div style={{ ...containerStyle, width: 'min(560px, 92vw)', maxHeight: '90vh', overflowY: 'auto' }}>
          <TerminosCondiciones onBack={() => setView('login')} />
        </div>
      </div>
    );
  }

  return (
    <div style={overlayStyle}>
      <div style={containerStyle}>
        <h2 style={{ color: 'var(--text-primary)', marginBottom: 10 }}>
          {activeTab === 'login' ? 'Iniciar sesión en TokTok' : 'Registrarse en TokTok'}
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 20, fontSize: 14, fontWeight: 700 }}>
          Administra tu cuenta, consulta las notificaciones, los comentarios en los videos y mucho más.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16, gap: 8 }}>
          <button onClick={() => setSelectedOption('phoneEmail')} style={{ color: 'var(--text-primary)', padding: '10px 15px', border: 'none', background: selectedOption === 'phoneEmail' ? 'var(--hover-bg)' : 'transparent', borderRadius: 8, cursor: 'pointer', fontWeight: 700 }}>Teléfono / Correo</button>
          <button onClick={() => setSelectedOption('qrCode')} style={{ color: 'var(--text-primary)', padding: '10px 15px', border: 'none', background: selectedOption === 'qrCode' ? 'var(--hover-bg)' : 'transparent', borderRadius: 8, cursor: 'pointer', fontWeight: 700 }}>Código QR</button>
        </div>

        {selectedOption === 'phoneEmail' && (
          <>
            <form onSubmit={handleLoginSubmit}>
              <input type="text" placeholder="Teléfono o correo electrónico" value={username} onChange={(e) => setUsername(e.target.value)} required style={{ width: 'calc(100% - 24px)', padding: 12, margin: '10px 0', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, fontSize: 16, background: 'transparent', color: 'var(--text-primary)' }} />
              <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: 'calc(100% - 24px)', padding: 12, margin: '10px 0 20px 0', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, fontSize: 16, background: 'transparent', color: 'var(--text-primary)' }} />

              {activeTab === 'signup' && (
                <div style={{ marginBottom: 20, textAlign: 'left', padding: 12, border: `1px solid ${userType === '' ? 'var(--accent)' : 'rgba(255,255,255,0.12)'}`, borderRadius: 10 }}>
                  <p style={{ margin: '0 0 10px 0', color: userType === '' ? 'var(--accent)' : 'var(--text-primary)', fontWeight: 700 }}>
                    {userType === '' ? 'Tipo de usuario?' : 'Selecciona tu rol:'}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                    {['Streamer', 'Viewer'].map((type) => (
                      <button key={type} type="button" onClick={() => setUserType(type as UserType)} style={{ padding: '8px 15px', border: `1px solid ${userType === type ? 'var(--accent)' : 'rgba(255,255,255,0.2)'}`, borderRadius: 20, background: userType === type ? 'var(--accent)' : 'transparent', color: userType === type ? '#fff' : 'var(--text-primary)', cursor: 'pointer', transition: 'background-color 0.2s' }}>{type}</button>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'signup' && (
                <div style={{ margin: '15px 0 25px 0', textAlign: 'left', fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
                  <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                    <input type="checkbox" checked={acceptedTerms} onChange={(e) => setAcceptedTerms(e.target.checked)} required style={{ marginRight: 8, width: 16, height: 16 }} />
                    Acepto los
                    <span onClick={(e) => { e.preventDefault(); setView('terms'); }} style={{ color: 'var(--accent)', cursor: 'pointer', marginLeft: 4, textDecoration: 'underline' }}>Términos y Condiciones</span>
                  </label>
                </div>
              )}

              <button type="submit" style={{ width: '100%', padding: 12, border: '1px solid transparent', borderRadius: 10, background: 'var(--accent)', color: '#fff', fontSize: 16, fontWeight: 800, cursor: 'pointer' }}>
                {activeTab === 'login' ? 'Iniciar sesión' : 'Registrarse'}
              </button>
            </form>
            <div style={{ color: 'var(--text-primary)', marginTop: 16 }}>
              <p style={{ color: 'var(--text-secondary)', margin: '12px 0', fontWeight: 700 }}>— o continuar con —</p>
              <GoogleButton onClick={() => { /* por ahora sin funcionalidad */ }} />
            </div>
          </>
        )}

        {selectedOption === 'qrCode' && (
          <div style={{ padding: '40px 0' }}>
            <p style={{ color: 'var(--text-primary)', marginTop: 15 }}>Usa la app de TokTok para escanear el código y continuar.</p>
          </div>
        )}

        <div style={{ color: 'var(--text-primary)', marginTop: 24, fontSize: 14, textAlign: 'center' }}>
          Descubre más sobre <span onClick={() => {}} style={{ color: 'var(--accent)', cursor: 'pointer', fontWeight: 700 }}> nosotros</span>
        </div>

        <div style={{ color: 'var(--text-primary)', marginTop: 10, fontSize: 14, borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 20, fontWeight: 700 }}>
          <p>
            {activeTab === 'login' ? '¿No tienes una cuenta?' : '¿Ya tienes una cuenta?'}{' '}
            <span onClick={() => { setActiveTab(activeTab === 'login' ? 'signup' : 'login'); setUserType(''); setAcceptedTerms(false); }} style={{ color: 'var(--accent)', cursor: 'pointer', fontWeight: 700 }}>
              {activeTab === 'login' ? 'Regístrate' : 'Inicia sesión'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
