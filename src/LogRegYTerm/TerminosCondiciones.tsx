// src/LogRegYTerm/TerminosCondiciones.tsx

import React from 'react';

interface TermsProps {
  onBack: () => void;
}

const TermsAndConditions: React.FC<TermsProps> = ({ onBack }) => {
  const containerStyle: React.CSSProperties = {
    maxWidth: '600px', margin: '50px auto', padding: '30px', backgroundColor: 'white', borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', textAlign: 'left', fontFamily: 'sans-serif', color: '#000',
  };

  const headerStyle: React.CSSProperties = {
    textAlign: 'center', color: '#fe2c55', marginBottom: '20px', borderBottom: '2px solid #f0f0f0', paddingBottom: '10px',
  };

  const buttonStyle: React.CSSProperties = {
    width: '100%', padding: '12px', border: 'none', borderRadius: '4px', backgroundColor: '#fe2c55', color: 'white', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop: '30px',
  };

  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>Términos y Condiciones de Servicio de TokTok</h1>
      <p style={{ fontWeight: 'bold', marginBottom: '15px' }}>Última actualización: 16 de Octubre de 2025</p>
      <h3 style={{ marginTop: '20px', color: '#333' }}>1. Aceptación de los Términos</h3>
      <p>Al crear una cuenta en TokTok o al usar cualquiera de nuestros servicios, usted acepta estos Términos y Condiciones y nuestra Política de Privacidad. Si no está de acuerdo con alguna parte de los términos, no debe utilizar el servicio.</p>
      <h3 style={{ marginTop: '20px', color: '#333' }}>2. Uso del Servicio</h3>
      <p>TokTok es una plataforma de contenido de video corto. Usted debe tener al menos 13 años para usar el servicio. El contenido que publique debe respetar los derechos de autor, no promover actividades ilegales ni incitar al odio.</p>
      <ul>
        <li>**Cuentas de Usuario:** Usted es responsable de mantener la confidencialidad de su contraseña.</li>
        <li>**Contenido:** Retenemos el derecho de remover o restringir el acceso a cualquier contenido que viole estas normas.</li>
      </ul>
      <h3 style={{ marginTop: '20px', color: '#333' }}>3. Derechos de Propiedad Intelectual</h3>
      <p>Usted mantiene todos los derechos sobre el contenido que publica. Sin embargo, al publicarlo, usted otorga a TokTok una licencia mundial, libre de regalías, para usar, modificar, exhibir y distribuir su contenido en relación con el servicio.</p>
      <h3 style={{ marginTop: '20px', color: '#333' }}>4. Exclusión de Garantías y Limitación de Responsabilidad</h3>
      <p>El servicio se proporciona "tal cual". TokTok no garantiza que el servicio esté libre de errores o sea ininterrumpido. No seremos responsables por daños indirectos derivados del uso de la plataforma.</p>
      <h3 style={{ marginTop: '20px', color: '#333' }}>5. Modificaciones a los Términos</h3>
      <p>TokTok se reserva el derecho de modificar estos Términos en cualquier momento. Le notificaremos cualquier cambio sustancial publicando los términos revisados en la plataforma. Su uso continuado después de las modificaciones constituye su aceptación de los nuevos términos.</p>
      <h3 style={{ marginTop: '20px', color: '#333' }}>6. Contacto</h3>
      <p>Si tiene preguntas sobre estos Términos, contáctenos a través de nuestro soporte en línea.</p>
      <button onClick={onBack} style={buttonStyle}>Regresar</button>
    </div>
  );
};

export default TermsAndConditions;
