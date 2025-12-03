import React, { useEffect, useMemo, useState } from 'react'
import './Metricas.css'
import { getUserMetrics, getAllMetrics, startSession, stopSession, formatDuration, type UserMetrics } from './metricasStore'
import StreamerProgress from './StreamerProgress';

type Rol = 'viewer' | 'streamer'

type Props = { usuario?: string; rol?: Rol }

const MetricasPage: React.FC<Props> = ({ usuario = '', rol = 'viewer' }) => {
  const [mine, setMine] = useState<UserMetrics | null>(null)
  const [others, setOthers] = useState<UserMetrics[]>([])

  const canUse = rol === 'streamer' && !!usuario
  

  const refresh = () => {
    if (usuario) setMine(getUserMetrics(usuario))
    setOthers(getAllMetrics().filter(m => m.user !== usuario))
  }

  useEffect(() => { refresh() }, [usuario])

  const active = !!mine?.activeSessionId

  const onStart = () => { if (!canUse) return; startSession(usuario!); refresh() }
  const onStop  = () => { if (!canUse) return; stopSession(usuario!); refresh() }

  return (
    <div className="metricas-page">
      <div className="metricas-header">
        <div className="metricas-title">Métricas de LIVE</div>
        
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
    </div>
  )
}

export default MetricasPage
