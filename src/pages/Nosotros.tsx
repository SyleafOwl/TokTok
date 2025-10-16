// src/pages/Nosotros.tsx
import React from 'react';
import './NosotrosPage.css';

// --- Props que el componente recibirá (solo una función para volver) ---
interface NosotrosProps {
  onBack: () => void;
}

// --- Lista de los 5 miembros de tu equipo ---
const teamMembers = [
  { nombre: 'Jericko', fotoUrl: 'https://via.placeholder.com/150/771796/FFFFFF?Text=Jericko' }, 
  { nombre: 'Nombre Miembro 2', fotoUrl: 'https://via.placeholder.com/150/c70039/FFFFFF?Text=Miembro+2' }, 
  { nombre: 'Nombre Miembro 3', fotoUrl: 'https://via.placeholder.com/150/FFC300/000000?Text=Miembro+3' }, 
  { nombre: 'Nombre Miembro 4', fotoUrl: 'https://via.placeholder.com/150/17a2b8/FFFFFF?Text=Miembro+4' }, 
  { nombre: 'Nombre Miembro 5', fotoUrl: 'https://via.placeholder.com/150/28a745/FFFFFF?Text=Miembro+5' }
];

// --- El componente de tu página ---
const Nosotros: React.FC<NosotrosProps> = ({ onBack }) => {
  return (
    <div className="nosotros-container">
      <h1 className="nosotros-title">Nuestro Equipo</h1>
      
      {/* Botón para regresar a la página de inicio */}
      <button onClick={onBack} style={{ marginBottom: '2rem', padding: '10px 20px', cursor: 'pointer' }}>
        &larr; Volver al Inicio
      </button>

      <p className="nosotros-subtitle">Conoce a las personas que hacen posible esta plataforma.</p>
      
      <div className="members-grid">
        {teamMembers.map((member) => (
          <div key={member.nombre} className="member-card">
            <img src={member.fotoUrl} alt={`Foto de ${member.nombre}`} className="member-photo" />
            <h3 className="member-name">{member.nombre}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Nosotros;