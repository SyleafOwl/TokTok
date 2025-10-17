import React, { useEffect, useRef, useState } from 'react'
import './Live.css'
import ComentariosPanel from '../Comentarios/ComentariosPanel'
import RegalosPanel, { Regalo } from '../Regalos/RegalosPanel'
import RegalosOverlay from '../Regalos/RegalosOverlay'
import { loadRegalos, saveRegalos, REGALOS_BASE } from '../Regalos/regalosStore'

export type RolUsuario = 'viewer' | 'streamer'

type Props = {
  usuario?: string
  rol?: RolUsuario
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

const Live: React.FC<Props> = ({ usuario, rol = 'viewer' }) => {
  const [lives] = useState<LiveItem[]>(LIVES_INICIALES)
  const [regalos, setRegalos] = useState<Regalo[]>(REGALOS_BASE)
  const [openGiftFor, setOpenGiftFor] = useState<number | null>(null)
  const [openCommentsFor, setOpenCommentsFor] = useState<number | null>(null)
  const contRef = useRef<HTMLDivElement>(null)
  const [modoEdicion, setModoEdicion] = useState<boolean>(false)
  const [verTodosPara, setVerTodosPara] = useState<number | null>(null)

  // Solo el primer LIVE (user=Streamer1) puede editar regalos si el rol del usuario es streamer y usuario es 'Streamer1'
  const puedeEditar = (live: LiveItem) => rol === 'streamer' && usuario === 'Streamer1' && live.user === 'Streamer1'

  useEffect(() => {
    // cargar regalos compartidos
    setRegalos(loadRegalos())
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOpenGiftFor(null); setOpenCommentsFor(null); setVerTodosPara(null) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const toggleGift = (id: number) => {
    setOpenGiftFor((curr) => (curr === id ? null : id))
    setOpenCommentsFor(null)
  }
  const toggleComments = (id: number) => {
    setOpenCommentsFor((curr) => (curr === id ? null : id))
    setOpenGiftFor(null)
  }

  const onEnviarRegalo = (liveId: number, g: Regalo) => {
    alert(`Enviado ${g.emoji} ${g.name} (${g.cost} monedas) al LIVE #${liveId}`)
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
    <div className="tiktok-container">
      <div className="main-content">
        <div className="video-container" ref={contRef}>
          {lives.map((live) => (
            <div key={live.id} className="feed-item">
              <div className="video-card" style={{ position: 'relative' }}>
                <span className="live-badge">LIVE</span>
                <div className="video-wrapper">
                  <video className="video-player" controls autoPlay muted loop src="/ruta-live.mp4" poster="/ruta-live.jpg" />
                </div>
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
                    <div className="icon" onClick={() => toggleComments(live.id)}>💬</div>
                    <span className="count">5K</span>
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

        {openCommentsFor !== null && (
          <ComentariosPanel videoId={openCommentsFor} onClose={() => setOpenCommentsFor(null)} />
        )}
      </div>
    </div>
  )
}

export default Live
