import React, { useState } from 'react';
// Asume que el CSS limpio está en este archivo
import './LoginScreen.css'; 
import TerminosCondiciones from './TerminosCondiciones.tsx'; 

// --- Tipos de datos ---
type LoginOption = 'phoneEmail' | 'qrCode';
type UserType = 'Streamer' | 'Viewer' | ''; 

//Componente de Botón Social (para reutilización)
interface SocialButtonProps {
    icon: string;
    label: string;
    onClick: () => void;
}

// Implementación con clases CSS
const SocialButton: React.FC<SocialButtonProps> = ({ icon, label, onClick }) => (
    <button
        onClick={onClick}
        className="social-button"
    >
        <span className="social-icon">{icon}</span>
        {label}
    </button>
);

//Componente Principal de la Pantalla de Login
const LoginScreen: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'login' | 'signup'>('signup');
    const [selectedOption, setSelectedOption] = useState<LoginOption>('phoneEmail');
    
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const [userType, setUserType] = useState<UserType>('');
    const [acceptedTerms, setAcceptedTerms] = useState<boolean>(false);
    
    // Estado CLAVE: Controla la vista actual
    const [view, setView] = useState<'login' | 'terms'>('login'); 

    // Uso de un simple "alert" para simular validación (se debe reemplazar por una modal en producción)
    const handleLoginSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (activeTab === 'signup') {
            if (!userType) {
                // IMPORTANT: Reemplazar 'alert' con un componente modal en un entorno real.
                console.error("Por favor, selecciona un Tipo de Usuario: Streamer o Viewer.");
                return;
            }
            if (!acceptedTerms) {
                // IMPORTANT: Reemplazar 'alert' con un componente modal en un entorno real.
                console.error("Debes aceptar los Términos y Condiciones para registrarte.");
                return;
            }
        }

        console.log(`Intentando ${activeTab} con: ${username}, Tipo: ${userType || 'N/A'}`);
    };

    const socialLogin = (provider: string) => {
        console.log(`Iniciando sesión con ${provider}`);
    };

    //Determinar las clases dinámicas para el selector de tipo de usuario
    //Usa 'error-border' y 'error-text' cuando userType está vacío y está en modo registro
    const isUserTypeError = activeTab === 'signup' && userType === '';
    const userTypeBoxBorderClass = isUserTypeError ? 'user-type-box error-border' : 'user-type-box default-border';
    const userTypeTitleTextClass = isUserTypeError ? 'user-type-title error-text' : 'user-type-title default-text';
    
    //Lógica de renderizado condicional: si view es 'terms', muestra los términos.
    if (view === 'terms') {
        // Usa el componente TerminosCondiciones refactorizado previamente
        return <TerminosCondiciones onBack={() => setView('login')} />;
    }

    //Si view es 'login' (la vista por defecto), se renderiza todo el formulario:
    return (
        <div className="app-container">
            <div className="login-container">
                <h2 className="login-title">
                    {activeTab === 'login' ? 'Iniciar sesión en TokTok' : 'Registrarse en TokTok'}
                </h2>
                <p className="login-subtitle">
                    Administra tu cuenta, consulta las notificaciones, los comentarios en los videos y mucho más.
                </p>

                {/*Selector de Opciones (Tabs) */}
                <div className="tab-selector">
                    <button 
                        onClick={() => setSelectedOption('phoneEmail')}
                        //Clase dinámica para el estado activo/inactivo
                        className={`tab-button ${selectedOption === 'phoneEmail' ? 'active' : ''}`}
                    >
                        Teléfono / Correo
                    </button>
                    <button 
                        onClick={() => setSelectedOption('qrCode')}
                        //Clase dinámica para el estado activo/inactivo
                        className={`tab-button ${selectedOption === 'qrCode' ? 'active' : ''}`}
                    >
                        Código QR
                    </button>
                </div>

                {/*Opciones de Inicio de Sesión */}
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
                                className="input-field"
                            />
                            <input
                                type="password"
                                placeholder="Contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="input-field last" // Usa 'last' para el margen inferior
                            />
                            
                            {/* Selector de Tipo de Usuario (Solo en Registro) */}
                            {activeTab === 'signup' && (
                                <div className={userTypeBoxBorderClass}>
                                    <p className={userTypeTitleTextClass}>
                                        {isUserTypeError ? 'Tipo de usuario?' : 'Selecciona tu rol:'}
                                    </p>

                                    <div className="user-type-options">
                                        {['Streamer', 'Viewer'].map((type) => (
                                            <button
                                                key={type}
                                                type="button"
                                                onClick={() => setUserType(type as UserType)}
                                                // Clases dinámicas para estado activo/inactivo
                                                className={`type-button ${userType === type ? 'active' : 'inactive'}`}
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Checkbox de Términos y Condiciones (Solo en Registro) */}
                            {activeTab === 'signup' && (
                                <div className="terms-checkbox-container">
                                    <label className="terms-label">
                                        <input
                                            type="checkbox"
                                            checked={acceptedTerms}
                                            onChange={(e) => setAcceptedTerms(e.target.checked)}
                                            required
                                            className="terms-input"
                                        />
                                        Acepto los 
                                        <span 
                                            onClick={(e) => { 
                                                e.preventDefault(); 
                                                setView('terms'); 
                                            }}
                                            className="terms-link"
                                        >
                                            Términos y Condiciones
                                        </span>
                                    </label>
                                </div>
                            )}
                            
                            {/* Botón Principal de Submit */}
                            <button
                                type="submit"
                                className="submit-button"
                            >
                                {activeTab === 'login' ? 'Iniciar sesión' : 'Registrarse'}
                            </button>
                        </form>

                        {/* Opciones Sociales */}
                        <div className="social-options">
                            <p className="social-divider">— o continuar con —</p>
                            <SocialButton icon="📱" label="Continuar con Google" onClick={() => socialLogin('Google')} />
                            <SocialButton icon="👤" label="Continuar con Twitter" onClick={() => socialLogin('Twitter')} />
                            <SocialButton icon="🔵" label="Continuar con Facebook" onClick={() => socialLogin('Facebook')} />
                        </div>
                    </>
                )}

                {selectedOption === 'qrCode' && (
                    <div className="qr-section">
                        {/* Espacio para la imagen del Código QR */}
                        <div className="qr-code-box">
                            QR
                        </div>
                        <p className="qr-code-text">Usa la app de TokTok para escanear el código y continuar.</p>
                    </div>
                )}

                {/* Descubre más sobre nosotros */}
                <div className="discover-more">
                    Descubre más sobre 
                    <span 
                        onClick={() => console.log('Navegando a Sobre Nosotros')}
                        className="discover-link"
                    >
                        nosotros
                    </span>
                </div>
                
                {/* Footer para cambiar entre Login y Registro */}
                <div className="footer-content">
                    <p>
                        {activeTab === 'login' ? '¿No tienes una cuenta?' : '¿Ya tienes una cuenta?'}
                        {' '}
                        <span
                            onClick={() => {
                                setActiveTab(activeTab === 'login' ? 'signup' : 'login');
                                setUserType('');
                                setAcceptedTerms(false);
                            }}
                            className="footer-action-link"
                        >
                            {activeTab === 'login' ? 'Regístrate' : 'Inicia sesión'}
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginScreen;
