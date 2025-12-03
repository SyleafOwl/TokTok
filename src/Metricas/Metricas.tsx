import React, { useEffect, useState } from 'react'
import './Metricas.css'
import { 
  getUserMetrics, 
  getAllMetrics, 
  startSession, 
  stopSession,
  pauseSession,  
  resumeSession,
  UserMetrics 
} from './metricasStore'

type Rol = 'viewer' | 'streamer'
type Props = { usuario?: string; rol?: Rol }

function formatDuration(ms: number | undefined | null) {
  const m = Math.max(0, Math.floor((ms || 0) / 1000))
  const h = Math.floor(m / 3600)
  const min = Math.floor((m % 3600) / 60)
  const s = m % 60
  return `${h.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

const MetricasPage: React.FC<Props> = ({ usuario = '', rol = 'viewer' }) => {
  const [mine, setMine] = useState<UserMetrics | null>(null)
  const [others, setOthers] = useState<UserMetrics[]>([])
  const [tiempoVisual, setTiempoVisual] = useState(0)
  const [busy, setBusy] = useState(false)

  const canUse = rol === 'streamer' && !!usuario

  const refresh = () => {
    if (!usuario) {
      setMine(null)
      setOthers(getAllMetrics())
      setTiempoVisual(0)
      return
    }
    const datosUsuario = getUserMetrics(usuario)
    setMine(datosUsuario)
    setOthers(getAllMetrics().filter(m => m.user !== usuario))
    // totalMs provided by store should already exclude paused time
    setTiempoVisual(datosUsuario.totalMs || 0)
  }

  useEffect(() => { refresh() }, [usuario])

  // periodic reconcile (every 5s)
  useEffect(() => {
    const id = setInterval(refresh, 5000)
    return () => clearInterval(id)
  }, [usuario])

  // live visual counter: re-fetch metrics each second while active to avoid double-count
  useEffect(() => {
    if (!usuario) return
    let tickId: number | null = null

    const updateTick = () => {
      const datos = getUserMetrics(usuario)
      setMine(datos)
      setTiempoVisual(datos.totalMs || 0)
    }

    if (mine && mine.activeSessionId) {
      // start 1s tick to keep UI in sync with store (store knows pauses)
      updateTick()
      tickId = window.setInterval(updateTick, 1000)
    }

    return () => {
      if (tickId) clearInterval(tickId)
    }
  }, [usuario, mine?.activeSessionId])

  useEffect(() => {
    const handleBeforeUnload = () => {
      try {
        if (canUse && mine?.activeSessionId) {
          // best-effort stop (non-await)
          try { stopSession(usuario!) } catch {}
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

  const onTogglePause = async () => {
    if (!canUse || busy || !mine?.activeSessionId) return
    setBusy(true)
    try {
      const active = mine.sessions.find(s => s.id === mine.activeSessionId)
      if (!active) return
      if (active.paused) {
        await resumeSession(usuario!)
      } else {
        await pauseSession(usuario!)
      }
      refresh()
    } catch (err) {
      console.error('togglePause failed', err)
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
                className="metricas-btn btn-iniciar"
                onClick={onStart}
                disabled={busy}
              >
                {busy ? 'Iniciando...' : 'Iniciar Transmisión'}
              </button>
            ) : (
              <div className='metricas-actions-inline'>
                <button
                  className="metricas-btn btn-pausa"
                  onClick={onTogglePause}
                  disabled={busy}
                >
                  {mine.sessions.find(s => s.id === mine.activeSessionId)?.paused ? 'Reanudar transmisión' : 'Pausar transmisión'}
                </button>

                <button
                  className="metricas-btn btn-finalizar"
                  onClick={onStop}
                  disabled={busy}
                >
                  {busy ? 'Finalizando...' : 'Finalizar Transmisión'}
                </button>
              </div>
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
            <h4>Tus métricas</h4>
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
                    {s.end ? formatDuration(s.end - s.start - (s.pausedAccumMs || 0)) : (s.paused ? 'PAUSADA' : 'EN CURSO')}
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