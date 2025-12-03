import React, { useEffect, useState } from 'react';
import './Metricas.css';

type Props = {
    totalMs: number; // Tiempo total transmitido en milisegundos
};

const StreamerProgress: React.FC<Props> = ({ totalMs }) => {
    const totalHours = totalMs / (1000 * 60 * 60); // Convertir ms a horas
    
    // Niveles de Streamer (Ejemplo: Nivel 1 a las 0h, Nivel 2 a las 10h, Nivel 3 a las 50h)
    const STREAMER_LEVELS = [0, 10, 50, 100, 250, 500, 1000];

    // Calcular nivel actual
    let currentLevel = 0;
    let nextThreshold = 10;
    let prevThreshold = 0;

    for (let i = 0; i < STREAMER_LEVELS.length; i++) {
        if (totalHours >= STREAMER_LEVELS[i]) {
            currentLevel = i + 1;
            prevThreshold = STREAMER_LEVELS[i];
            nextThreshold = STREAMER_LEVELS[i+1] || (STREAMER_LEVELS[i] * 1.5);
        }
    }

    
    const progress = Math.min(100, ((totalHours - prevThreshold) / (nextThreshold - prevThreshold)) * 100);
    const hoursLeft = Math.max(0, nextThreshold - totalHours).toFixed(1);

    
    useEffect(() => {
        
        if (progress === 0 && totalHours > 0) {
            
        }
    }, [currentLevel]);

    return (
        <div className="metricas-card streamer-level-card" style={{ background: 'linear-gradient(90deg, #1a1a1a 0%, #2d2d2d 100%)', border: '1px solid #444' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <h4 style={{ margin: 0, color: '#fe2c55' }}>Mi Nivel de Streamer</h4>
                <span className="badge bg-warning text-dark">Nivel {currentLevel}</span>
            </div>
            
            <p style={{ fontSize: '14px', color: '#ccc', marginBottom: '5px' }}>
                {totalHours.toFixed(1)} / {nextThreshold} horas transmitidas
            </p>
            
            <div className="mascota-bar" style={{ height: '12px', background: '#444' }}>
                <span style={{ width: `${progress}%`, background: '#00f2ea' }} />
            </div>

            <p style={{ fontSize: '12px', marginTop: '8px', color: '#888' }}>
                🔥 Faltan <strong>{hoursLeft} horas</strong> para el siguiente nivel.
            </p>
        </div>
    );
};

export default StreamerProgress;