import React, { useEffect, useMemo, useState } from 'react'
import './ComentariosPanel.css'
import { getUserXP } from '../Perfil/xpStore'

// Panel de comentarios fijo a la derecha
// Props:
// - videoId: ID del video cuyos comentarios se simulan
// - onClose: función para cerrar el panel
type Props = {
  videoId: number
  onClose: () => void
  usuario?: string
}

type Comment = {
  id: string
  user: string
  avatar: string // letra del avatar
  text: string
  time: string // ej. "2h"
  likes: number
}

// Genera comentarios de ejemplo por video (solo para demo)
const getMockComments = (videoId: number): Comment[] => {
  const base = videoId * 7
  return Array.from({ length: 8 }, (_, i) => ({
    id: `${videoId}-${i}`,
    user: `usuario_${(base + i) % 99}`,
    avatar: String.fromCharCode(65 + ((base + i) % 26)),
    text: `Comentario de prueba #${i + 1} en el video ${videoId}. UN 20 pe PROFE`,
    time: `${1 + ((base + i) % 12)}h`,
    likes: (base + i * 3) % 200,
  }))
}

// Nivel simulado por usuario (1..20) si no es el usuario actual
const nivelPorUsuario = (user: string) => {
  let hash = 0
  for (let i = 0; i < user.length; i++) hash = (hash * 31 + user.charCodeAt(i)) | 0
  const n = Math.abs(hash % 20) + 1
  return n
}

const ComentariosPanel: React.FC<Props> = ({ videoId, onClose, usuario }) => {
  const [comments, setComments] = useState<Comment[]>(() => getMockComments(videoId))
  const [text, setText] = useState('')

  useEffect(() => {
    setComments(getMockComments(videoId))
  }, [videoId])

  const myLevel = useMemo(() => {
    if (!usuario) return 1
    const xp = getUserXP(usuario)
    return Math.max(1, xp.level)
  }, [usuario])

  const onSend = () => {
    const t = text.trim()
    if (!t) return
    const user = usuario && usuario.trim() ? usuario : 'invitado'
    const nuevo: Comment = {
      id: `${videoId}-u-${Date.now()}`,
      user,
      avatar: user.charAt(0).toUpperCase() || 'U',
      text: t,
      time: 'ahora',
      likes: 0,
    }
    setComments((prev) => [nuevo, ...prev])
    setText('')
  }

  return (
    <aside className="comments-panel" role="dialog" aria-label="Comentarios">
      <div className="comments-header">
        <h4>Comentarios</h4>
        {/* Panel fijo: sin botón de cerrar por ahora */}
      </div>
      <div className="comments-list">
        {comments.map((c) => {
          const level = c.user === (usuario || '') ? myLevel : nivelPorUsuario(c.user)
          return (
          <div key={c.id} className="comment-item">
            <div className="comment-avatar" aria-hidden>{c.avatar}</div>
            <div className="comment-body">
              <div className="comment-author">@{c.user} <span className="comment-level">Lv {level}</span></div>
              <div className="comment-text">{c.text}</div>
              <div className="comment-meta">
                <span>{c.time}</span>
                <span>·</span>
                <span>❤️ {c.likes}</span>
              </div>
            </div>
          </div>
          )
        })}
      </div>
      <div className="comments-input-row">
        <input
          className="comments-input"
          placeholder={usuario ? `Comenta como @${usuario}` : 'Escribe un comentario...'}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') onSend() }}
        />
        <button className="comments-send" onClick={onSend} disabled={!text.trim()}>Enviar</button>
      </div>
    </aside>
  )
}

export default ComentariosPanel
