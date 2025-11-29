import React, { useEffect } from 'react';
import './Metricas.css'; // Usamos estilos existentes o crea uno nuevo

type Props = {
    level: number;
    onClose: () => void;
}

const LevelUpModal: React.FC<Props> = ({ level, onClose }) => {
    // Efecto de sonido opcional o temporizador de cierre automático
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 5000); // Se cierra solo a los 5 segundos
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="levelup-overlay">
            <div className="levelup-card">
                <div className="levelup-icon">🎉</div>
                <h2>¡FELICIDADES!</h2>
                <p>Has alcanzado el <strong>Nivel de Streamer {level}</strong></p>
                <div className="levelup-badge">
                    <span className="star">⭐</span> {level}
                </div>
                <p className="levelup-sub">¡Cuéntaselo a tu audiencia!</p>
                <button onClick={onClose} className="metricas-btn primary">¡Genial!</button>
            </div>
        </div>
    );
};

export default LevelUpModal;