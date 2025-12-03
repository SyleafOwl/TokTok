import React, { useEffect, useState } from 'react'
import './Metricas.css'
import { 
  getUserMetrics, 
  getAllMetrics, 
  startSession, 
  stopSession, 
  formatDuration, 
  UserMetrics 
} from './metricasStore'

type Rol = 'viewer' | 'streamer'
type Props = { usuario?: string; rol?: Rol }

const MetricasPage: React.FC<Props> = ({ usuario = '', rol = 'viewer' }) => {
  const [mine, setMine] = useState<UserMetrics | null>(null)
  const [others, setOthers] = useState<UserMetrics[]>([])
  
  const [tiempoVisual, setTiempoVisual] = useState(0)
  const [busy, setBusy] = useState(false)

  const canUse = rol === 'streamer' && !!usuario

  const refresh = () => {
    if (usuario) {
      const datosUsuario = getUserMetrics(usuario)
      setMine(datosUsuario)
      
      if (!datosUsuario.activeSessionId) {
        setTiempoVisual(datosUsuario.totalMs)
      }
    }
    setOthers(getAllMetrics().filter(m => m.user !== usuario))
  }

  useEffect(() => { refresh() }, [usuario])

  useEffect(() => {
    const id = setInterval(refresh, 5000)
    return () => clearInterval(id)
  }, [usuario])

  useEffect(() => {
    let intervalo: any = null

    if (mine && mine.activeSessionId) {
      const sesionActual = mine.sessions.find(s => s.id === mine.activeSessionId)
      
      if (sesionActual) {
        intervalo = setInterval(() => {
          const ahora = Date.now()
          const tiempoTranscurridoEnEstaSesion = ahora - sesionActual.start
          
          setTiempoVisual(mine.totalMs + tiempoTranscurridoEnEstaSesion)
        }, 1000)
      }
    } else if (mine) {
      setTiempoVisual(mine.totalMs)
    }

    return () => clearInterval(intervalo)
  }, [mine])

  useEffect(() => {
    const handleBeforeUnload = () => {
      try {
        if (canUse && mine?.activeSessionId) {
          stopSession(usuario!)
        }
      } catch {}
    }
    const handleVisibility = () => {
      if (!document.hidden) refresh()
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    document.addEventListener('visibilitychange', handleVisibility)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [usuario, canUse, mine?.activeSessionId])

  const onStart = async() => { 
    if (!canUse || busy) return
    setBusy(true)
    try {
      await startSession(usuario!)
      refresh()
    } catch (err) {
      console.error('startSession failed', err)
    } finally {
      setBusy(false)
    }
  }

  const onStop = async() => { 
    if (!canUse || busy) return
    setBusy(true)
    try {
      await stopSession(usuario!)
      refresh()
    } catch (err) {
      console.error('stopSession failed', err)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="metricas-page">
      <div className="metricas-header">
        <div className="metricas-title">Métricas de LIVE</div>
        
        {canUse && (
          <div className="metricas-actions">
            {!mine?.activeSessionId ? (
              <button
                className="metricas-btn"
                onClick={onStart}
                disabled={busy}
                style={{ borderColor: '#4caf50', color: '#4caf50' }}
              >
                {busy ? 'Iniciando...' : 'Iniciar Transmisión'}
              </button>
            ) : (
              <button
                className="metricas-btn"
                onClick={onStop}
                disabled={busy}
                style={{ borderColor: '#FE2C55', color: '#FE2C55' }}
              >
                {busy ? 'Finalizando...' : 'Finalizar Transmisión'}
              </button>
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
          <section className="metricas-card">
            <h4>Tus métricas (Req. 29)</h4>
            <div className="metricas-list">
              
              <div className="metricas-row">
                <span>Total acumulado</span>
                <strong style={{ fontSize: '1.2em', color: mine?.activeSessionId ? '#4caf50' : 'inherit' }}>
                  {formatDuration(tiempoVisual)}
                </strong>
              </div>

              <div className="metricas-row">
                <span>Estado</span>
                <span className="metricas-sub">
                  {mine?.activeSessionId ? '🔴 EN VIVO' : '⚪ OFFLINE'}
                </span>
              </div>

              <div className="metricas-row">
                <span>Sesiones</span>
                <span className="metricas-sub">{mine?.sessions.length ?? 0}</span>
              </div>
              
              {mine?.sessions.slice().reverse().slice(0, 8).map(s => (
                <div key={s.id} className="metricas-row">
                  <span>{new Date(s.start).toLocaleString()}</span>
                  <span className="metricas-sub">
                    {s.end ? formatDuration(s.end - s.start) : 'EN CURSO'}
                  </span>
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
    </div>
  )
}

export default MetricasPage 