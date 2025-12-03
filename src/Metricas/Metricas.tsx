import React, { useEffect, useState } from 'react'
import './Metricas.css'
import { getUserMetrics, getAllMetrics, startSession, stopSession, formatDuration, type UserMetrics } from './metricasStore'
import StreamerProgress from './StreamerProgress'
import LevelUpModal from './LevelUpModal'

type Rol = 'viewer' | 'streamer'
type Props = { usuario?: string; rol?: Rol }

const MetricasPage: React.FC<Props> = ({ usuario = '', rol = 'viewer' }) => {
  // Datos locales
  const [mine, setMine] = useState<UserMetrics | null>(null)
  const [others, setOthers] = useState<UserMetrics[]>([])
  
  // Datos del Backend y Estado
  const [totalMs, setTotalMs] = useState(0)
  const [isLive, setIsLive] = useState(false)
  
  // Modales
  const [showLevelUp, setShowLevelUp] = useState<number | null>(null)

  // Control de nivel anterior
  const [prevLevel, setPrevLevel] = useState(0)

  const canUse = rol === 'streamer' && !!usuario

  // 1. Cargar datos
  useEffect(() => {
    if (!usuario) return;
    
    // Cargar métricas locales
    setMine(getUserMetrics(usuario))
    setOthers(getAllMetrics().filter(m => m.user !== usuario))

    // Cargar datos reales del backend
    fetch(`http://localhost:3001/api/user/${usuario}`)
      .then(res => res.json())
      .then(data => {
        if (data.streamerStats) {
          setTotalMs(data.streamerStats.totalMs);
          // Actualizar referencia de nivel inicial
          updateLevelReference(data.streamerStats.totalMs);
        }
      })
      .catch(err => console.log("Backend offline (usando local):", err));
  }, [usuario]);

  // Función corregida: LEVELS en mayúsculas
  const updateLevelReference = (ms: number) => {
    const hours = ms / (1000 * 60 * 60); 
    const LEVELS = [0, 10, 50, 100, 250, 500, 1000];
    let lvl = 0;
    // CORRECCIÓN AQUÍ: Usar LEVELS en lugar de levels
    for(let i = 0; i < LEVELS.length; i++) {
        if(hours >= LEVELS[i]) lvl = i + 1;
    }
    setPrevLevel(lvl);
  }

  // 2. Iniciar
  const onStart = () => {
    if (!canUse) return;
    setIsLive(true);
    startSession(usuario!); 
  }

  // 3. Finalizar
  const onStop = async () => {
    if (!canUse) return;
    setIsLive(false);
    
    const metricsLocal = stopSession(usuario!);
    const lastSession = metricsLocal.sessions[metricsLocal.sessions.length - 1];
    // Evitar error si no hay sesión
    const duration = lastSession && lastSession.end ? lastSession.end - lastSession.start : 0;

    // Enviar al backend
    try {
      const res = await fetch('http://localhost:3001/api/streamer/session/end', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: usuario, durationMs: duration })
      });
      const data = await res.json();
      
      if (data.success) {
        const newTotal = data.totalMs;
        setTotalMs(newTotal);

        // Calcular si subió de nivel
        const hours = newTotal / (1000 * 60 * 60);
        const LEVELS = [0, 10, 50, 100, 250, 500, 1000];
        let newLvl = 0;
        
        // CORRECCIÓN AQUÍ TAMBIÉN: Usar LEVELS
        for(let i = 0; i < LEVELS.length; i++) {
            if(hours >= LEVELS[i]) newLvl = i + 1;
        }

        if (newLvl > prevLevel) {
          setShowLevelUp(newLvl);
        }
        setPrevLevel(newLvl);
      }
    } catch (e) {
      console.error("Error guardando sesión:", e);
    }
  }

  return (
    <div className="metricas-page">
      <div className="metricas-header">
        <div className="metricas-title">Panel de Streamer</div>
        {canUse && (
          <div className="metricas-actions">
            {!isLive ? (
              <button className="metricas-btn confirm" onClick={onStart}>Iniciar Transmisión</button>
            ) : (
              <button className="metricas-btn danger" onClick={onStop}>Finalizar Transmisión</button>
            )}
          </div>
        )}
      </div>

      {!canUse && (
        <div className="metricas-card" style={{ maxWidth: 800, margin: '20px auto' }}>
          Esta sección es exclusiva para Streamers.
        </div>
      )}

      {canUse && (
        <div className="metricas-grid">
          
          {/* BARRA DE PROGRESO */}
          <div style={{ gridColumn: '1 / -1' }}>
             <StreamerProgress totalMs={totalMs} />
          </div>

          {/* TUS MÉTRICAS */}
          <section className="metricas-card">
            <h4>Tus métricas (Req. 29)</h4>
            <div className="metricas-list">
              <div className="metricas-row">
                <span>Total acumulado</span>
                <strong>{formatDuration(totalMs)}</strong>
              </div>
              
              <div className="metricas-row">
                <span>Estado</span>
                <span className={isLive ? "live-tag" : "offline-tag"}>
                    {isLive ? 'EN VIVO 🔴' : 'OFFLINE'}
                </span>
              </div>

              <div className="metricas-row">
                <span>Sesiones</span>
                <span className="metricas-sub">{mine?.sessions.length ?? 0}</span>
              </div>
            </div>
          </section>

          <section className="metricas-card">
            <h4>Otros streamers (ranking)</h4>
            <div className="metricas-list">
              {others.length === 0 && <div className="metricas-sub">Sin datos aún</div>}
              {others.map(o => (
                <div key={o.user} className="metricas-row">
                  <span>@{o.user}</span>
                  <strong>{formatDuration(o.totalMs)}</strong>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* MODAL LEVEL UP */}
      {showLevelUp && (
        <LevelUpModal level={showLevelUp} onClose={() => setShowLevelUp(null)} />
      )}
    </div>
  )
}

export default MetricasPage