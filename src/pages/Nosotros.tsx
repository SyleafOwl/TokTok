
import React from 'react';
import './NosotrosPage.css';




interface NosotrosProps {
  onBack: () => void;
}

const fotoJericko = new URL("../assets/imagenes/Jericko.png", import.meta.url).href;
const fotoDavid = new URL("../assets/imagenes/David.png", import.meta.url).href;
const fotoLan = new URL("../assets/imagenes/Lan.png", import.meta.url).href;
const fotoChapman = new URL("../assets/imagenes/Chapman.png", import.meta.url).href;
const fotoKeitel = new URL("../assets/imagenes/Keitel.png", import.meta.url).href;
  

const teamMembers = [
  { nombre: 'Jericko Espejo ', fotoUrl: fotoJericko }, 
  { nombre: 'David Rengifo 2', fotoUrl: fotoDavid}, 
  { nombre: 'Ian Cavero', fotoUrl: fotoLan }, 
  { nombre: 'Sebastian Chapman', fotoUrl: fotoChapman }, 
  { nombre: 'Keitel Hernández', fotoUrl: fotoKeitel }
];


const Nosotros: React.FC<NosotrosProps> = ({ onBack }) => {
  return (
    <div className="nosotros-container">
      <h1 className="nosotros-title">Nuestro Equipo</h1>
      
      
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