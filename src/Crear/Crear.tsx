import React, { useEffect, useMemo, useRef, useState } from 'react'
import './Crear.css'
import { startSession, stopSession, getUserMetrics, formatDuration } from '../Metricas/metricasStore'

export type Rol = 'viewer' | 'streamer'

type Props = {
  usuario?: string
  rol?: Rol
  onGoRegalos?: () => void
}

const Crear: React.FC<Props> = ({ usuario = '', rol = 'viewer', onGoRegalos }) => {
  const canUse = rol === 'streamer' && !!usuario
  const [title, setTitle] = useState('')
  const [created, setCreated] = useState(false)
  const [elapsed, setElapsed] = useState('0s')
  // Métricas en vivo (simuladas)
  const [viewersNow, setViewersNow] = useState<number>(0)
  const [peakViewers, setPeakViewers] = useState<number>(0)
  const [totalViewers, setTotalViewers] = useState<number>(0)
  const [likes, setLikes] = useState<number>(0)
  const [gifts, setGifts] = useState<number>(0)
  const [earnings, setEarnings] = useState<number>(0)
  const [viewersSeries, setViewersSeries] = useState<number[]>([])
  const [earnSeries, setEarnSeries] = useState<number[]>([])
  const metricsTimer = useRef<number | null>(null)

  const m = useMemo(() => (usuario ? getUserMetrics(usuario) : null), [usuario, created])
  const active = !!m?.activeSessionId

  useEffect(() => {
    if (!active || !usuario) { setElapsed('0s'); return }
    const tick = () => {
      const mm = getUserMetrics(usuario)
      const session = mm.sessions.find(s => s.id === mm.activeSessionId)
      if (session) {
        const end = Date.now()
        const ms = (session.end ?? end) - session.start
        setElapsed(formatDuration(ms))
      }
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [usuario, active])

  // Simulación de métricas mientras está activo
  useEffect(() => {
    if (!active) {
      // limpiar timer si existe
      if (metricsTimer.current) { window.clearInterval(metricsTimer.current); metricsTimer.current = null }
      return
    }
    // inicializar si no hay datos
    if (viewersSeries.length === 0) setViewersSeries(Array.from({ length: 30 }, () => 0))
    if (earnSeries.length === 0) setEarnSeries(Array.from({ length: 12 }, () => 0))
    // cada 2s: random walk de audiencia, likes y regalos
    metricsTimer.current = window.setInterval(() => {
      setViewersNow(prev => {
        const delta = Math.floor((Math.random() - 0.3) * 50) // sesgo leve positivo
        const next = Math.max(0, prev + delta)
        setPeakViewers(p => Math.max(p, next))
        setTotalViewers(t => t + Math.max(0, Math.floor(next * 0.05))) // visitantes acumulados
        setLikes(l => l + Math.floor(Math.random() * 25))
        // regalos y ganancias esporádicos
        if (Math.random() < 0.35) {
          const giftCount = 1 + Math.floor(Math.random() * 3)
          const giftValue = [5, 10, 25, 50, 100][Math.floor(Math.random() * 5)]
          setGifts(g => g + giftCount)
          setEarnings(e => e + giftCount * giftValue)
          setEarnSeries(arr => {
            const idx = arr.length - 1
            const nextArr = [...arr]
            nextArr[idx] = (nextArr[idx] || 0) + giftCount * giftValue
            return nextArr
          })
        }
        // series de audiencia (rolling 30 puntos)
        setViewersSeries(arr => [...arr.slice(1), next])
        return next
      })
    }, 2000)

    // cada minuto: avanzar bucket de earnings por minuto
    const minuteTimer = window.setInterval(() => {
      setEarnSeries(arr => [...arr.slice(1), 0])
    }, 60000)

    return () => {
      if (metricsTimer.current) { window.clearInterval(metricsTimer.current); metricsTimer.current = null }
      window.clearInterval(minuteTimer)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active])

  const resetMetrics = () => {
    setViewersNow(0); setPeakViewers(0); setTotalViewers(0); setLikes(0); setGifts(0); setEarnings(0)
    setViewersSeries([]); setEarnSeries([])
  }

  const onCreate = () => {
    if (!canUse) return
    const t = title.trim()
    if (!t) return alert('Coloca un título para tu LIVE')
    // crear inicia la sesión de LIVE
    startSession(usuario)
    setCreated(true)
    resetMetrics()
  }

  const onStop = () => { if (!canUse) return; stopSession(usuario); setCreated(false) }

  if (!canUse) {
    return <div className="crear-page"><div className="crear-warning">Esta sección es exclusiva para Streamers.</div></div>
  }

  return (
    <div className="crear-page">
      <div className="crear-card">
        <div className="crear-header">
          <div className="crear-title">Crear LIVE</div>
          <div>@{usuario}</div>
        </div>
        <div className="crear-form">
          <label htmlFor="live-title">Título del LIVE</label>
          <input id="live-title" className="crear-input" placeholder="¿De qué trata tu LIVE?" value={title} onChange={e => setTitle(e.target.value)} />
          <div className="crear-actions">
            {!active ? (
              <button className="crear-btn primary" onClick={onCreate}>Crear y empezar</button>
            ) : (
              <button className="crear-btn" onClick={onStop}>Detener</button>
            )}
            <button className="crear-btn" onClick={onGoRegalos}>Editar regalos</button>
          </div>
          {active && (
            <div className="crear-meta">En vivo: {elapsed}</div>
          )}
        </div>
        {active && (
          <div className="crear-metricas">
            <div className="metricas-kpis">
              <div className="kpi-card">
                <div className="kpi-label">Espectadores actuales</div>
                <div className="kpi-value">{viewersNow}</div>
              </div>
              <div className="kpi-card">
                <div className="kpi-label">Pico de audiencia</div>
                <div className="kpi-value">{peakViewers}</div>
              </div>
              <div className="kpi-card">
                <div className="kpi-label">Visitantes únicos</div>
                <div className="kpi-value">{totalViewers}</div>
              </div>
              <div className="kpi-card">
                <div className="kpi-label">Likes</div>
                <div className="kpi-value">{likes}</div>
              </div>
              <div className="kpi-card">
                <div className="kpi-label">Regalos</div>
                <div className="kpi-value">{gifts}</div>
              </div>
              <div className="kpi-card">
                <div className="kpi-label">Ganancias (Intis)</div>
                <div className="kpi-value">{earnings}</div>
              </div>
            </div>

            <div className="metricas-charts">
              <div className="chart-card">
                <div className="chart-title">Audiencia en tiempo real</div>
                <MiniLineChart data={viewersSeries} height={120} />
              </div>
              <div className="chart-card">
                <div className="chart-title">Ganancias por minuto</div>
                <MiniBarChart data={earnSeries} height={120} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Componentes de gráficos ligeros (SVG)
const MiniLineChart: React.FC<{ data: number[]; width?: number; height?: number }> = ({ data, width = 520, height = 120 }) => {
  const pad = 8
  const w = Math.max(40, width)
  const h = Math.max(40, height)
  const max = Math.max(1, ...data)
  const step = data.length > 1 ? (w - pad * 2) / (data.length - 1) : 0
  const points = data.map((v, i) => {
    const x = pad + i * step
    const y = pad + (h - pad * 2) * (1 - v / max)
    return `${x},${y}`
  }).join(' ')
  return (
    <svg className="chart-svg" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id="lg-line" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.9" />
        </linearGradient>
      </defs>
      <polyline fill="none" stroke="url(#lg-line)" strokeWidth="3" points={points} />
      {/* sutil relleno debajo de la línea */}
      {data.length > 1 && (
        <polygon
          points={`${pad},${h - pad} ${points} ${pad + (data.length - 1) * step},${h - pad}`}
          fill="url(#lg-line)" opacity="0.15"
        />
      )}
    </svg>
  )
}

const MiniBarChart: React.FC<{ data: number[]; width?: number; height?: number }> = ({ data, width = 520, height = 120 }) => {
  const pad = 8
  const w = Math.max(40, width)
  const h = Math.max(40, height)
  const max = Math.max(1, ...data)
  const barGap = 4
  const barW = data.length > 0 ? (w - pad * 2 - barGap * (data.length - 1)) / data.length : 0
  return (
    <svg className="chart-svg" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      {data.map((v, i) => {
        const x = pad + i * (barW + barGap)
        const bh = (h - pad * 2) * (v / max)
        const y = h - pad - bh
        return <rect key={i} x={x} y={y} width={barW} height={bh} rx={3} ry={3} fill="#ffd54a" opacity={0.9} />
      })}
    </svg>
  )
}

export default Crear
