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
  // Layout opcional
  columnas?: number
  maxItems?: number
  onVerTodos?: () => void
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
  columnas,
  maxItems,
  onVerTodos,
}) => {
  if (!abierto) return null
  const styleCols: React.CSSProperties | undefined = columnas ? ({ ['--gift-grid-columns' as any]: String(columnas) } as React.CSSProperties) : undefined
  const hayMas = typeof maxItems === 'number' && regalos.length > maxItems
  const limite = typeof maxItems === 'number' ? maxItems : undefined
  const cantidadMostrar = hayMas && limite && limite > 0 ? limite - 1 : limite
  const mostrar = typeof cantidadMostrar === 'number' ? regalos.slice(0, Math.max(0, cantidadMostrar)) : regalos
  return (
    <div className="gift-panel" role="dialog" aria-label="Panel de regalos" style={styleCols}
    >
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
        {mostrar.map((g) => (
          <div key={g.id} className="gift-item">
            {editable ? (
              // En modo edición NO usamos botón para evitar conflictos de clic
              <div className="gift-item-row" aria-label="Editar nombre de regalo">
                <span className="gift-emoji" aria-hidden>{g.emoji}</span>
                <input
                  className="gift-name-input"
                  value={g.name}
                  onChange={(e) => onCambiarNombre && onCambiarNombre(g.id, e.target.value)}
                />
              </div>
            ) : (
              <button
                className="gift-item-button"
                onClick={() => onEnviar(g)}
                aria-label={`Enviar regalo ${g.name}`}
              >
                <span className="gift-emoji" aria-hidden>{g.emoji}</span>
                <span className="gift-name">{g.name}</span>
              </button>
            )}

            <div className="gift-cost-row">
              {editable ? (
                <>
                  <input
                    className="gift-cost-input"
                    type="number"
                    min={0}
                    value={g.cost}
                    onChange={(e) =>
                      onCambiarCosto && onCambiarCosto(g.id, Math.max(0, Number(e.target.value)))
                    }
                  />
                  <span className="gift-cost-sufijo">monedas</span>
                </>
              ) : (
                <span className="gift-cost">{g.cost} monedas</span>
              )}
            </div>
          </div>
        ))}
        {hayMas && (
          <button className="gift-item gift-more" onClick={onVerTodos} aria-label="Ver más regalos">
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, color: 'var(--on-card-text)' }}>
              <span style={{ fontSize: 22 }}>＋</span>
              <span style={{ fontWeight: 700 }}>Más Regalos</span>
            </div>
          </button>
        )}
      </div>
    </div>
  )
}

export default RegalosPanel
