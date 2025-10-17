// src/TermsAndConditions.tsx

import React from 'react';
import './TerminosCondiciones.css'; // Importa el archivo CSS para los estilos
// 1. Definición de Props: Necesita una función para volver al Login
interface TermsProps {
    onBack: () => void; // Función para manejar el evento de regreso
}

// Nota: Se utiliza "TerminosCondiciones" para mantener la consistencia con el import del componente LoginScreen.
const TerminosCondiciones: React.FC<TermsProps> = ({ onBack }) => {

    // Se eliminan todas las variables de estilo en línea (containerStyle, headerStyle, buttonStyle)

    return (
        // Se usa la clase "terms-container"
        <div className="terms-container">
            
            {/* Se usa la clase "login-title" para el encabezado principal. Se eliminan los estilos en línea de color, borde y padding. */}
            <h1 className="login-title">
                Términos y Condiciones de Servicio de TokTok
            </h1>

            {/* Párrafo de fecha. Se usa "terms-paragraph" para el margen inferior. */}
            <p className="terms-paragraph">
                Última actualización: 16 de Octubre de 2025
            </p>

            {/* Se envuelve el contenido largo dentro de "terms-content-box" para asegurar el scroll y el estilo de borde/fondo. */}
            <div className="terms-content-box">
                {/* --- Contenido Simplificado --- */}
                
                {/* h3s usan "login-title" para un estilo de encabezado en negrita y se elimina el estilo en línea. */}
                <h3 className="login-title">1. Aceptación de los Términos</h3>
                <p className="terms-paragraph">
                    Al crear una cuenta en TokTok o al usar cualquiera de nuestros servicios, usted acepta estos Términos y Condiciones y nuestra Política de Privacidad. Si no está de acuerdo con alguna parte de los términos, no debe utilizar el servicio.
                </p>

                <h3 className="login-title">2. Uso del Servicio</h3>
                <p className="terms-paragraph">
                    TokTok es una plataforma de contenido de video corto. Usted debe tener al menos 13 años para usar el servicio. El contenido que publique debe respetar los derechos de autor, no promover actividades ilegales ni incitar al odio.
                </p>
                <ul>
                    <li className="terms-paragraph">**Cuentas de Usuario:** Usted es responsable de mantener la confidencialidad de su contraseña.</li>
                    <li className="terms-paragraph">**Contenido:** Retenemos el derecho de remover o restringir el acceso a cualquier contenido que viole estas normas.</li>
                </ul>

                <h3 className="login-title">3. Derechos de Propiedad Intelectual</h3>
                <p className="terms-paragraph">
                    Usted mantiene todos los derechos sobre el contenido que publica. Sin embargo, al publicarlo, usted otorga a TokTok una licencia mundial, libre de regalías, para usar, modificar, exhibir y distribuir su contenido en relación con el servicio.
                </p>

                <h3 className="login-title">4. Exclusión de Garantías y Limitación de Responsabilidad</h3>
                <p className="terms-paragraph">
                    El servicio se proporciona "tal cual". TokTok no garantiza que el servicio esté libre de errores o sea ininterrumpido. No seremos responsables por daños indirectos derivados del uso de la plataforma.
                </p>

                <h3 className="login-title">5. Modificaciones a los Términos</h3>
                <p className="terms-paragraph">
                    TokTok se reserva el derecho de modificar estos Términos en cualquier momento. Le notificaremos cualquier cambio sustancial publicando los términos revisados en la plataforma. Su uso continuado después de las modificaciones constituye su aceptación de los nuevos términos.
                </p>
                
                <h3 className="login-title">6. Contacto</h3>
                <p className="terms-paragraph">
                    Si tiene preguntas sobre estos Términos, contáctenos a través de nuestro soporte en línea.
                </p>
            </div>

            {/*Botón de Regreso*/}
            {/* Se usa la clase "terms-back-button" */}
            <button 
                onClick={onBack} 
                className="terms-back-button"
            >
                Regresar al Login
            </button>
            
        </div>
    );
};




export default TerminosCondiciones;