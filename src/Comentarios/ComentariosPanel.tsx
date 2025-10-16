import React from 'react'
import './ComentariosPanel.css'

// Panel de comentarios fijo a la derecha
// Props:
// - videoId: ID del video cuyos comentarios se simulan
// - onClose: función para cerrar el panel
type Props = {
  videoId: number
  onClose: () => void
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
    text: `Comentario de prueba #${i + 1} en el video ${videoId}. ¡Muy bueno! 🔥`,
    time: `${1 + ((base + i) % 12)}h`,
    likes: (base + i * 3) % 200,
  }))
}

const ComentariosPanel: React.FC<Props> = ({ videoId, onClose }) => {
  const comments = getMockComments(videoId)

  return (
    <aside className="comments-panel" role="dialog" aria-label="Comentarios">
      <div className="comments-header">
        <h4>Comentarios</h4>
        <button className="comments-close" onClick={onClose} aria-label="Cerrar comentarios">✕</button>
      </div>
      <div className="comments-list">
        {comments.map((c) => (
          <div key={c.id} className="comment-item">
            <div className="comment-avatar" aria-hidden>{c.avatar}</div>
            <div className="comment-body">
              <div className="comment-author">@{c.user}</div>
              <div className="comment-text">{c.text}</div>
              <div className="comment-meta">
                <span>{c.time}</span>
                <span>·</span>
                <span>❤️ {c.likes}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="comments-input-row">
        <input className="comments-input" placeholder="Escribe un comentario..." disabled />
        <button className="comments-send" disabled>Enviar</button>
      </div>
    </aside>
  )
}

export default ComentariosPanel
