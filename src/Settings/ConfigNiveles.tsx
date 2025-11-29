import React, { useState, useEffect } from 'react';
import './Settings.css'; // Usamos los mismos estilos de Settings

type LevelRule = { level: number; points: number };

type Props = {
    onBack: () => void;
    usuario: string; // Nombre del streamer
};

const ConfigNiveles: React.FC<Props> = ({ onBack, usuario }) => {
    const [rules, setRules] = useState<LevelRule[]>([]);
    const [loading, setLoading] = useState(false);

    // Cargar reglas actuales (Simulado o desde Backend)
    useEffect(() => {
        // Aquí iría el fetch a tu backend: fetch(`/api/config/levels/${usuario}`)
        // Por ahora simulamos datos iniciales:
        setRules([
            { level: 1, points: 100 },
            { level: 2, points: 250 },
            { level: 3, points: 500 },
            { level: 4, points: 1000 },
            { level: 5, points: 2000 },
        ]);
    }, [usuario]);

    const handleChange = (index: number, val: string) => {
        const newRules = [...rules];
        newRules[index].points = parseInt(val) || 0;
        setRules(newRules);
    };

    const handleSave = () => {
        setLoading(true);
        // Simulación de guardado
        setTimeout(() => {
            console.log("Guardando reglas para", usuario, rules);
            // Aquí iría el POST al backend
            alert("¡Configuración de progresión guardada exitosamente!");
            setLoading(false);
            onBack();
        }, 1000);
    };

    return (
        <div className="settings-container">
            <header className="settings-header">
                <button onClick={onBack} className="back-button">&larr; Volver</button>
                <h1>Configuración de Progresión</h1>
            </header>

            <div className="settings-content">
                <div className="settings-section">
                    <h2>Niveles de Espectadores</h2>
                    <p>Define cuántos puntos de experiencia (XP) necesitan tus espectadores para subir de nivel en tu canal.</p>
                    
                    <div className="levels-editor" style={{ marginTop: '20px' }}>
                        {rules.map((rule, idx) => (
                            <div key={rule.level} style={{ display: 'flex', alignItems: 'center', marginBottom: '15px', background: '#333', padding: '10px', borderRadius: '8px' }}>
                                <div style={{ width: '80px', fontWeight: 'bold', color: '#fe2c55' }}>Nivel {rule.level}</div>
                                <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                                    <span style={{ marginRight: '10px', color: '#ccc' }}>Requiere:</span>
                                    <input 
                                        type="number" 
                                        value={rule.points} 
                                        onChange={(e) => handleChange(idx, e.target.value)}
                                        style={{ 
                                            padding: '8px', 
                                            borderRadius: '4px', 
                                            border: '1px solid #555', 
                                            background: '#222', 
                                            color: 'white',
                                            width: '100px',
                                            textAlign: 'center'
                                        }}
                                    />
                                    <span style={{ marginLeft: '10px', fontWeight: 'bold' }}>Puntos</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button 
                        className="crear-btn primary" 
                        onClick={handleSave} 
                        disabled={loading}
                        style={{ marginTop: '20px', width: '100%', padding: '15px', fontSize: '16px' }}
                    >
                        {loading ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfigNiveles;