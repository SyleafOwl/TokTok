import React, { useEffect, useState } from 'react'
import './Metricas.css'
import { getUserMetrics, getAllMetrics, startSession, stopSession, formatDuration, syncMetricsFromBackend, type UserMetrics } from './metricasStore'
import StreamerProgress from './StreamerProgress'
import ConfigNiveles from '../Settings/ConfigNiveles'
import LevelUpModal from './LevelUpModal'

type Rol = 'viewer' | 'streamer'

type Props = { usuario?: string; rol?: Rol }

const MetricasPage: React.FC<Props> = ({ usuario = '', rol = 'viewer' }) => {
  const [mine, setMine] = useState<UserMetrics | null>(null)
  const [others, setOthers] = useState<UserMetrics[]>([])
  
  // Estado para controlar la visibilidad del modal de configuración
  const [showConfig, setShowConfig] = useState(false)
  
  // NUEVO: Estado para saber el nivel anterior y mostrar modal
  const [prevLevel, setPrevLevel] = useState(0)
  const [showLevelUp, setShowLevelUp] = useState<number | null>(null)

  const canUse = rol === 'streamer' && !!usuario
  

  const refresh = () => {
    if (usuario) setMine(getUserMetrics(usuario))
    setOthers(getAllMetrics().filter(m => m.user !== usuario))
  }

  useEffect(() => {
    refresh()
    // Sincronizar con backend si está disponible
    if (usuario && canUse) {
      syncMetricsFromBackend(usuario).then(() => refresh())
    }
  }, [usuario, canUse])

  const active = !!mine?.activeSessionId

  const onStart = () => { if (!canUse) return; startSession(usuario!); refresh() }
  const onStop  = async () => {
    if (!canUse) return
    await stopSession(usuario!)
    refresh()
  }

  // CALCULAR NIVEL ACTUAL (Lógica copiada de StreamerProgress para tenerla aquí)
  const totalMs = mine?.totalMs ?? 0
  const totalHours = totalMs / (1000 * 60 * 60)
  const LEVELS = [0, 10, 50, 100, 250, 500, 1000]
  let currentLevel = 0
  for (let i = 0; i < LEVELS.length; i++) {
    if (totalHours >= LEVELS[i]) currentLevel = i + 1
  }

  // EFECTO: Detectar subida de nivel
  useEffect(() => {
    if (currentLevel > prevLevel && prevLevel !== 0) {
      setShowLevelUp(currentLevel) // Mostrar modal
    }
    setPrevLevel(currentLevel)
  }, [currentLevel, prevLevel])

  return (
    <div className="metricas-page">
      <div className="metricas-header">
        <div className="metricas-title">Panel de Streamer</div>
        
        {canUse && (
          <div className="metricas-actions">
            {!active ? (
              <button className="metricas-btn" onClick={onStart}>Iniciar Transmisión</button>
            ) : (
              <button className="metricas-btn" onClick={onStop}>Finalizar Transmisión</button>
            )}
          </div>
        )}
      </div>

      {!canUse && (
        <div className="metricas-card" style={{ maxWidth: 1100, margin: '0 auto' }}>
          Esta sección es exclusiva para Streamers.
        </div>
      )}

      {canUse && (
        <div className="metricas-grid">
          {/* --- AQUÍ INSERTAMOS LA NUEVA TARJETA DE PROGRESO --- */}
          <div style={{ gridColumn: '1 / -1' }}> {/* Que ocupe todo el ancho si usas grid */}
            <StreamerProgress totalMs={mine?.totalMs ?? 0} />
          </div>
          {/* 2. BOTÓN DE CONFIGURACIÓN DE NIVELES (NUEVO) */}
          <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', marginTop: '-10px', marginBottom: '10px' }}>
              <button 
                className="metricas-btn" 
                style={{ backgroundColor: '#333', border: '1px solid #555', fontSize: '0.9rem' }}
                onClick={() => setShowConfig(true)}>
                  ⚙️ Configurar Niveles de Audiencia
              </button>
          </div>

          <section className="metricas-card">
            <h4>Tus métricas</h4>
            <div className="metricas-list">
              <div className="metricas-row">
                <span>Total acumulado</span>
                <strong>{formatDuration(mine?.totalMs ?? 0)}</strong>
              </div>
              <div className="metricas-row">
                <span>Sesiones</span>
                <span className="metricas-sub">{mine?.sessions.length ?? 0}</span>
              </div>
              {mine?.sessions.slice().reverse().slice(0, 8).map(s => (
                <div key={s.id} className="metricas-row">
                  <span>{new Date(s.start).toLocaleString()}</span>
                  <span className="metricas-sub">{s.end ? formatDuration(s.end - s.start) : 'EN CURSO'}</span>
                </div>
              ))}
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

      {/* --- MODAL OVERLAY PARA CONFIGURACIÓN --- */}
      {showConfig && (
          <div style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 9999,
              display: 'flex', justifyContent: 'center', alignItems: 'center'
          }}>
              <div style={{ width: '100%', maxWidth: '500px' }}>
                  <ConfigNiveles 
                    usuario={usuario || ''} 
                    onBack={() => setShowConfig(false)} 
                  />
              </div>
          </div>
      )}

      {/* AGREGAR: EL MODAL DE LEVEL UP */}
      {showLevelUp && (
          <LevelUpModal 
             level={showLevelUp} 
             onClose={() => setShowLevelUp(null)} 
          />
      )}
    </div>
  )
}

export default MetricasPage
