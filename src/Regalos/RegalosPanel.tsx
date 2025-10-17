import React from 'react'
import './RegalosPanel.css'

export type Regalo = { id: string; emoji: string; name: string; cost: number }

type Props = {
  abierto?: boolean
  regalos: Regalo[]
  onEnviar: (regalo: Regalo) => void
  onCerrar?: () => void
  editable?: boolean
  onCambiarCosto?: (id: string, nuevoCosto: number) => void
  onCambiarNombre?: (id: string, nuevoNombre: string) => void
  titulo?: string
  // Opcional: mostrar botón de edición (solo en LIVE para Streamer1)
  mostrarEditar?: boolean
  onToggleEditar?: () => void
}

// Panel flotante de regalos reutilizable
const RegalosPanel: React.FC<Props> = ({
  abierto = true,
  regalos,
  onEnviar,
  onCerrar,
  editable = false,
  onCambiarCosto,
  onCambiarNombre,
  titulo = 'Enviar regalo',
  mostrarEditar = false,
  onToggleEditar,
}) => {
  if (!abierto) return null
  return (
    <div className="gift-panel" role="dialog" aria-label="Panel de regalos">
      <div className="gift-header">
        <div className="gift-title">{titulo}</div>
        <div style={{ display: 'flex', gap: 8 }}>
          {mostrarEditar && (
            <button className="gift-edit" onClick={onToggleEditar} aria-label="Editar regalos">✎</button>
          )}
          {onCerrar && (
            <button className="gift-close" onClick={onCerrar} aria-label="Cerrar">✕</button>
          )}
        </div>
      </div>
      <div className="gift-grid">
        {regalos.map((g) => (
          <div key={g.id} className="gift-item">
            <button className="gift-item-button" onClick={() => onEnviar(g)}>
              <span className="gift-emoji" aria-hidden>{g.emoji}</span>
              {editable ? (
                <input
                  className="gift-name-input"
                  value={g.name}
                  onChange={(e) => onCambiarNombre && onCambiarNombre(g.id, e.target.value)}
                />
              ) : (
                <span className="gift-name">{g.name}</span>
              )}
            </button>
            <div className="gift-cost-row">
              {editable ? (
                <>
                  <input
                    className="gift-cost-input"
                    type="number"
                    min={0}
                    value={g.cost}
                    onChange={(e) => onCambiarCosto && onCambiarCosto(g.id, Math.max(0, Number(e.target.value)))}
                  />
                  <span className="gift-cost-sufijo">monedas</span>
                </>
              ) : (
                <span className="gift-cost">{g.cost} monedas</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RegalosPanel
