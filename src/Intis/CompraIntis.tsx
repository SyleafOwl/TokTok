import React from 'react'
import './CompraIntis.css'

export interface CompraIntisProps {
  abierto: boolean
  onCerrar: () => void
  onComprar: (monto: number) => void
}

const CompraIntis: React.FC<CompraIntisProps> = ({ abierto, onCerrar, onComprar }) => {
  const [monto, setMonto] = React.useState(0)

  if (!abierto) return null

  const manejarSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (monto > 0) {
      onComprar(monto)
      setMonto(0)
      onCerrar()
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onCerrar} aria-label="Cerrar">×</button>
        <h2>Comprar Intis</h2>
        <form onSubmit={manejarSubmit} className="modal-form">
          <label htmlFor="intis-amount">Cantidad de Intis:</label>
          <input
            id="intis-amount"
            type="number"
            min={1}
            value={monto}
            onChange={(e) => setMonto(Number(e.target.value))}
            required
          />
          <button type="submit" className="modal-buy">Comprar</button>
        </form>
      </div>
    </div>
  )
}

export default CompraIntis
