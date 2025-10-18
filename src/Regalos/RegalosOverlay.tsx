import React from 'react'
import './RegalosOverlay.css'
import type { Regalo } from './RegalosPanel'

type Props = {
  abierto?: boolean
  regalos: Regalo[]
  onEnviar: (g: Regalo) => void
  onCerrar: () => void
  editable?: boolean
  onCambiarCosto?: (id: string, c: number) => void
  onCambiarNombre?: (id: string, n: string) => void
  mostrarEditar?: boolean
  onToggleEditar?: () => void
}

const RegalosOverlay: React.FC<Props> = ({
  abierto = false,
  regalos,
  onEnviar,
  onCerrar,
  editable,
  onCambiarCosto,
  onCambiarNombre,
  mostrarEditar,
  onToggleEditar,
}) => {
  if (!abierto) return null
  return (
    <aside className="allgifts-panel" role="dialog" aria-label="Todos los regalos">
      <div className="allgifts-header">
        <h4>Todos los regalos</h4>
        <div style={{ display: 'flex', gap: 8 }}>
          {mostrarEditar && (
            <button className="gift-edit" onClick={onToggleEditar} aria-label="Editar regalos">✎</button>
          )}
          <button className="gift-close" onClick={onCerrar} aria-label="Cerrar">✕</button>
        </div>
      </div>
      <div className="allgifts-grid">
        {regalos.map((g) => (
          <div key={g.id} className="allgifts-item">
            <button className="allgifts-btn" onClick={() => onEnviar(g)}>
              <span className="allgifts-emoji" aria-hidden>{g.emoji}</span>
              {editable ? (
                <input className="allgifts-name" value={g.name} onChange={(e) => onCambiarNombre && onCambiarNombre(g.id, e.target.value)} />
              ) : (
                <span className="allgifts-name-label">{g.name}</span>
              )}
            </button>
            <div className="allgifts-costrow">
              {editable ? (
                <>
                  <input className="allgifts-cost" type="number" min={0} value={g.cost}
                         onChange={(e) => onCambiarCosto && onCambiarCosto(g.id, Math.max(0, Number(e.target.value)))} />
                  <span className="allgifts-cost-sufijo">Intis</span>
                </>
              ) : (
                <span className="allgifts-costlabel">{g.cost} Intis</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </aside>
  )
}

export default RegalosOverlay
