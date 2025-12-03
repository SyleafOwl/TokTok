import React, { useEffect, useRef, useState } from 'react'
import './Live.css'
import ComentariosPanel from '../Comentarios/ComentariosPanel'
import RegalosPanel, { Regalo } from '../Regalos/RegalosPanel'
import RegalosOverlay from '../Regalos/RegalosOverlay'
import AnimacionGift, { type GiftToast } from '../Regalos/AnimacionGift'
import { loadRegalos, saveRegalos, REGALOS_BASE } from '../Regalos/regalosStore'
import { addWatchSeconds } from '../Perfil/xpStore'
import CompraIntis from '../Intis/CompraIntis'
import { getUserMetrics } from '../Metricas/metricasStore'

export type RolUsuario = 'viewer' | 'streamer'

type Props = {
  usuario?: string
  rol?: RolUsuario
  intis: number
  setIntis: React.Dispatch<React.SetStateAction<number>>
}

// Regalos base vienen del store compartido

type LiveItem = {
  id: number
  user: string
  title: string
  viewers: string
  perfil: string
}

const LIVES_INICIALES: LiveItem[] = [
  { id: 1, user: 'Streamer1', title: 'Charlando en vivo', viewers: '2.3K', perfil: 'S' },
  { id: 2, user: 'DJ_Luna', title: 'Música y chill 🎶', viewers: '1.1K', perfil: 'L' },
  { id: 3, user: 'GamerPro', title: 'Rankeds hoy 🔥', viewers: '3.7K', perfil: 'G' },
]

const Live: React.FC<Props> = ({ usuario, rol = 'viewer', intis, setIntis }) => {
  const [lives] = useState<LiveItem[]>(LIVES_INICIALES)
  const [regalos, setRegalos] = useState<Regalo[]>(REGALOS_BASE)
  const [openGiftFor, setOpenGiftFor] = useState<number | null>(null)
  const contRef = useRef<HTMLDivElement>(null)
  const [modoEdicion, setModoEdicion] = useState<boolean>(false)
  const [verTodosPara, setVerTodosPara] = useState<number | null>(null)
  // overlays de regalos por liveId
  const [toastsByLive, setToastsByLive] = useState<Record<number, GiftToast[]>>({})
  const [mostrarCompra, setMostrarCompra] = useState<boolean>(false)
  const [liveElapsed, setLiveElapsed] = useState<number>(0)
  // Añadir estado para mostrar tiempo proveniente del store
  const [storeLiveMs, setStoreLiveMs] = useState<number | null>(null)

  // Solo el primer LIVE (user=Streamer1) puede editar regalos si el rol del usuario es streamer y usuario es 'Streamer1'
  const puedeEditar = (live: LiveItem) => rol === 'streamer' && usuario === 'Streamer1' && live.user === 'Streamer1'

  useEffect(() => {
    // cargar regalos compartidos
    setRegalos(loadRegalos())
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOpenGiftFor(null); setVerTodosPara(null) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Sumar puntos de visualización a viewers: 1 punto/segundo mientras está en LIVE
  useEffect(() => {
    if (rol !== 'viewer' || !usuario) return
    const id = setInterval(() => {
      addWatchSeconds(usuario, 1)
    }, 1000)
    return () => clearInterval(id)
  }, [rol, usuario])

  // dentro del componente Live (añadir efecto para leer el estado de metricasStore)
  useEffect(() => {
    if (!usuario) return // streamerUser = nombre/ID del streamer en Live.tsx
    let tick: number | null = null

    const update = () => {
      const data = getUserMetrics(usuario)
      // si hay sesión activa y está pausada, no avanzar el contador
      const active = data.sessions?.find(s => s.id === data.activeSessionId)
      if (!data.activeSessionId || active?.paused) {
        setLiveElapsed(data.totalMs || 0) // muestra total sin avanzar
      } else {
        // si está activo y no pausado, calcular tiempo actual
        const now = Date.now()
        const base = data.totalMs || 0
        const sess = active
        const elapsedSession = (sess && !sess.end) ? (now - sess.start - (sess.pausedAccumMs || 0)) : 0
        setLiveElapsed(base + elapsedSession)
      }
    }

    update()
    tick = window.setInterval(update, 1000)
    return () => { if (tick) clearInterval(tick) }
  }, [usuario])

  // Reemplaza 'streamerUser' por la variable real que identifica al streamer en este componente
  useEffect(() => {
    const streamerId = usuario // <- substituir por la variable real (ej. usuario, streamer, user)
    if (!streamerId) return
    const tick = window.setInterval(() => {
      const data = getUserMetrics(streamerId)
      const active = data?.sessions?.find((s: any) => s.id === data.activeSessionId)
      if (!data.activeSessionId || active?.paused) {
        // sesión pausada o no hay sesión → no avanzar
        setStoreLiveMs(data.totalMs || 0)
      } else {
        // sesión activa y no pausada → calcular en vivo
        const now = Date.now()
        const elapsedSession = active && !active.end ? (now - active.start - (active.pausedAccumMs || 0)) : 0
        setStoreLiveMs((data.totalMs || 0) + elapsedSession)
      }
    }, 1000)

    // actualización inmediata
    const data0 = getUserMetrics(streamerId)
    setStoreLiveMs(data0.totalMs || 0)

    return () => clearInterval(tick)
  }, [usuario])

  const toggleGift = (id: number) => {
    setOpenGiftFor((curr) => (curr === id ? null : id))
    
  }

  const onEnviarRegalo = (liveId: number, g: Regalo) => {
    // Verificar saldo de Intis
    if (intis < g.cost) {
      setMostrarCompra(true)
      return
    }
    // Descontar saldo
    setIntis((prev) => prev - g.cost)
    // Mostrar overlay animado al streamer reconociendo al viewer
    const toast: GiftToast = {
      id: `${Date.now()}_${Math.random().toString(36).slice(2,7)}`,
      emoji: g.emoji,
      name: g.name,
      cost: g.cost,
      from: usuario || 'anon'
    }
    setToastsByLive(prev => {
      const curr = prev[liveId] ?? []
      return { ...prev, [liveId]: [...curr, toast].slice(-3) } // mantener últimos 3
    })
    // retirar automáticamente luego de 3.2s
    setTimeout(() => {
      setToastsByLive(prev => {
        const list = prev[liveId] ?? []
        return { ...prev, [liveId]: list.filter(t => t.id !== toast.id) }
      })
    }, 3200)
    setOpenGiftFor(null)
  }

  const onCambiarCosto = (id: string, nuevoCosto: number) => {
    setRegalos((prev) => {
      const next = prev.map((r) => (r.id === id ? { ...r, cost: nuevoCosto } : r))
      saveRegalos(next)
      return next
    })
  }
  const onCambiarNombre = (id: string, nuevoNombre: string) => {
    setRegalos((prev) => {
      const next = prev.map((r) => (r.id === id ? { ...r, name: nuevoNombre } : r))
      saveRegalos(next)
      return next
    })
  }

  return (
    <>
    <div className="tiktok-container">
      <div className="main-content">
        {/** Panel de comentarios fijo a la derecha, siempre visible para el LIVE activo */}
        {(() => { const activeLiveId = lives[0]?.id ?? 1; return (
          <ComentariosPanel videoId={activeLiveId} onClose={() => {}} usuario={usuario || ''} />
        ) })()}
        <div className="video-container" ref={contRef}>
          {lives.map((live) => (
            <div key={live.id} className="feed-item">
              <div className="video-card" style={{ position: 'relative' }}>
                <span className="live-badge">LIVE</span>
                <div className="video-wrapper">
                  <video className="video-player" controls autoPlay muted loop src="/ruta-live.mp4" poster="/ruta-live.jpg" />
                </div>
                {/* overlays de regalos recibidos */}
                {toastsByLive[live.id] && toastsByLive[live.id].length > 0 && (
                  <AnimacionGift toasts={toastsByLive[live.id]} />
                )}
                <div className="video-info">
                  <h3 className="user">@{live.user} · {live.viewers} espectadores</h3>
                  <p className="description">{live.title}</p>
                  <p className="song">Ambiente en vivo</p>
                </div>
              </div>

              <div className="actions-wrapper">
                <div className="action-bar">
                  <div className="action-item">
                    <div className="perfil">{live.perfil}</div>
                    <span className="follow-btn">+</span>
                  </div>
                  <div className="action-item">
                    <div className="icon">❤️</div>
                    <span className="count">99K</span>
                  </div>
                  <div className="action-item">
                    <div className="icon">🔄</div>
                    <span className="count">2K</span>
                  </div>
                  <div className="action-item" onClick={() => toggleGift(live.id)}>
                    <div className="icon">🎁</div>
                    <span className="count">Regalos</span>
                  </div>
                  <div className="action-item">
                    <div className="music-album">🎵</div>
                  </div>
                </div>

                {openGiftFor === live.id && (
                  <RegalosPanel
                    abierto
                    regalos={regalos}
                    onEnviar={(g) => onEnviarRegalo(live.id, g)}
                    onCerrar={() => setOpenGiftFor(null)}
                    editable={puedeEditar(live) && modoEdicion}
                    onCambiarCosto={puedeEditar(live) ? onCambiarCosto : undefined}
                    onCambiarNombre={puedeEditar(live) ? onCambiarNombre : undefined}
                    titulo={puedeEditar(live) ? (modoEdicion ? 'Regalos (edición)' : 'Regalos') : 'Enviar regalo'}
                    mostrarEditar={puedeEditar(live)}
                    onToggleEditar={() => setModoEdicion((m) => !m)}
                    columnas={2}
                    maxItems={6}
                    onVerTodos={() => setVerTodosPara(live.id)}
                  />
                )}
        {verTodosPara !== null && (
          <RegalosOverlay
            abierto
            regalos={regalos}
            onEnviar={(g) => onEnviarRegalo(verTodosPara!, g)}
            onCerrar={() => setVerTodosPara(null)}
            editable={lives.find((l) => l.id === verTodosPara) ? puedeEditar(lives.find((l) => l.id === verTodosPara)!) && modoEdicion : false}
            onCambiarCosto={onCambiarCosto}
            onCambiarNombre={onCambiarNombre}
            mostrarEditar={lives.find((l) => l.id === verTodosPara) ? puedeEditar(lives.find((l) => l.id === verTodosPara)!) : false}
            onToggleEditar={() => setModoEdicion((m) => !m)}
          />
        )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    {/** Modal de compra de Intis si saldo insuficiente */}
    <CompraIntis
      abierto={mostrarCompra}
      onCerrar={() => setMostrarCompra(false)}
      onComprar={(monto) => {
        setIntis((prev) => prev + monto)
        setMostrarCompra(false)
      }}
      saldo={intis}
    />
    </>
  )
}

export default Live
