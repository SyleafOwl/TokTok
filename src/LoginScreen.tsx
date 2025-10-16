import React, { useState } from 'react';

// --- Tipos de datos (Añadimos el tipo de usuario) ---
type LoginOption = 'phoneEmail' | 'qrCode' | 'social';
type UserType = 'Streamer' | 'Viewer' | ''; // Agregamos el estado vacío para 'tipo de usuario?'

// 2. Componente de Botón Social (para reutilización)
interface SocialButtonProps {
  icon: string;
  label: string;
  onClick: () => void;
}

const SocialButton: React.FC<SocialButtonProps> = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      padding: '12px',
      margin: '10px 0',
      border: '1px solid #e0e0e0',
      borderRadius: '4px',
      cursor: 'pointer',
      backgroundColor: 'white',
      fontSize: '16px',
      color: '#000', // Asegura que el texto sea negro
      fontWeight: 'bold', // Asegura que el texto esté en negrita
    }}
  >
    <span style={{ marginRight: '10px', fontSize: '20px' }}>{icon}</span>
    {label}
  </button>
);

// 3. Componente Principal de la Pantalla de Login
const LoginScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('signup'); // Iniciamos en 'signup' para ver el selector
  const [selectedOption, setSelectedOption] = useState<LoginOption>('phoneEmail');
  
  // Estado para el formulario
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  // 🎯 NUEVO ESTADO: Tipo de usuario
  const [userType, setUserType] = useState<UserType>('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 🎯 VALIDACIÓN: Si está en registro y no elige tipo de usuario
    if (activeTab === 'signup' && !userType) {
        alert("Por favor, selecciona un Tipo de Usuario: Streamer o Viewer.");
        return;
    }

    console.log(`Intentando ${activeTab} con: ${username}, Contraseña: ${password}, Tipo: ${userType || 'N/A'}`);
  };

  const socialLogin = (provider: string) => {
    console.log(`Iniciando sesión con ${provider}`);
  };

  // Estilo minimalista del contenedor (simulando un modal centrado)
  const containerStyle: React.CSSProperties = {
    maxWidth: '400px',
    margin: '50px auto',
    padding: '30px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', // Añadimos una sombra sutil
    textAlign: 'center',
    fontFamily: 'sans-serif'
  };

  return (
    <div style={containerStyle}>
      <h2 style={{ color: '#000', marginBottom: '10px' }}>
        {activeTab === 'login' ? 'Iniciar sesión en TokTok' : 'Registrarse en TokTok'}
      </h2>
      <p style={{ color: '#333', marginBottom: '25px', fontSize: '14px', fontWeight: 'bold' }}>
        Administra tu cuenta, consulta las notificaciones, los comentarios en los videos y mucho más.
      </p>

      {/* Selector de Opciones */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <button 
          onClick={() => setSelectedOption('phoneEmail')}
          style={{ 
            color: '#000',
            padding: '10px 15px', 
            marginRight: '10px', 
            border: 'none', 
            backgroundColor: selectedOption === 'phoneEmail' ? '#f0f0f0' : 'transparent',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          Teléfono / Correo
        </button>
        <button 
          onClick={() => setSelectedOption('qrCode')}
          style={{ 
            color: '#000',
            padding: '10px 15px', 
            border: 'none', 
            backgroundColor: selectedOption === 'qrCode' ? '#f0f0f0' : 'transparent',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          Código QR
        </button>
      </div>

      {/* Opciones de Inicio de Sesión */}
      {selectedOption === 'phoneEmail' && (
        <>
          <form onSubmit={handleLoginSubmit}>
            {/* Inputs */}
            <input
              type="text"
              placeholder="Teléfono o correo electrónico"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{ width: 'calc(100% - 24px)', padding: '12px', margin: '10px 0', border: '1px solid #e0e0e0', borderRadius: '4px', fontSize: '16px' }}
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: 'calc(100% - 24px)', padding: '12px', margin: '10px 0 20px 0', border: '1px solid #e0e0e0', borderRadius: '4px', fontSize: '16px' }}
            />
            
            {/* 🎯 CAMBIO 1: Selector de Tipo de Usuario */}
            {activeTab === 'signup' && (
                <div 
                    style={{ 
                        marginBottom: '20px', 
                        textAlign: 'left', 
                        padding: '12px',
                        border: `1px solid ${userType === '' ? '#fe2c55' : '#e0e0e0'}`, // Borde rojo si no se selecciona
                        borderRadius: '4px' 
                    }}
                >
                    <p style={{ margin: '0 0 10px 0', color: userType === '' ? '#fe2c55' : '#000', fontWeight: 'bold' }}>
                        {userType === '' ? 'Tipo de usuario?' : 'Selecciona tu rol:'}
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                        {['Streamer', 'Viewer'].map((type) => (
                            <button
                                key={type}
                                type="button"
                                onClick={() => setUserType(type as UserType)}
                                style={{
                                    padding: '8px 15px',
                                    border: `1px solid ${userType === type ? '#fe2c55' : '#ccc'}`,
                                    borderRadius: '20px',
                                    backgroundColor: userType === type ? '#fe2c55' : 'white',
                                    color: userType === type ? 'white' : '#000',
                                    cursor: 'pointer',
                                    fontWeight: 'bold',
                                    transition: 'background-color 0.2s'
                                }}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>
            )}
            
            {/* Botón Principal */}
            <button
              type="submit"
              style={{
                width: '100%', padding: '12px', border: 'none', borderRadius: '4px',
                backgroundColor: '#fe2c55', color: 'white', fontSize: '16px',
                fontWeight: 'bold', cursor: 'pointer',
              }}
            >
              {activeTab === 'login' ? 'Iniciar sesión' : 'Registrarse'}
            </button>
          </form>

          {/* Opciones Sociales */}
          <div style={{ color: '#000', marginTop: '20px' }}>
            <p style={{ color: '#333', margin: '15px 0', fontWeight: 'bold' }}>— o continuar con —</p>
            <SocialButton icon="📱" label="Continuar con Google" onClick={() => socialLogin('Google')} />
            <SocialButton icon="👤" label="Continuar con Twitter" onClick={() => socialLogin('Twitter')} />
            <SocialButton icon="🔵" label="Continuar con Facebook" onClick={() => socialLogin('Facebook')} />
          </div>
        </>
      )}

      {selectedOption === 'qrCode' && (
        <div style={{ padding: '40px 0' }}>
          {/* Espacio para la imagen del Código QR */}
          
          <p style={{ color: '#000', marginTop: '15px' }}>Usa la app de TokTok para escanear el código y continuar.</p>
        </div>
      )}

      {/* 🎯 CAMBIO 2: Descubre más sobre nosotros */}
      <div style={{ color: '#000', marginTop: '30px', fontSize: '14px', textAlign: 'center' }}>
          Descubre más sobre 
          <span 
              onClick={() => console.log('Navegando a Sobre Nosotros')}
              style={{ color: '#fe2c55', cursor: 'pointer', fontWeight: 'bold' }}
          >
              {" "}nosotros
          </span>
      </div>
      
      {/* Footer para cambiar entre Login y Registro */}
      <div style={{ color: '#000', marginTop: '10px', fontSize: '14px', borderTop: '1px solid #f0f0f0', paddingTop: '20px', fontWeight: 'bold' }}>
        <p>
          {activeTab === 'login' ? '¿No tienes una cuenta?' : '¿Ya tienes una cuenta?'}
          {' '}
          <span
            onClick={() => {
                setActiveTab(activeTab === 'login' ? 'signup' : 'login');
                setUserType(''); // Resetear el tipo de usuario al cambiar de pestaña
            }}
            style={{ color: '#fe2c55', cursor: 'pointer', fontWeight: 'bold' }}
          >
            {activeTab === 'login' ? 'Regístrate' : 'Inicia sesión'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;