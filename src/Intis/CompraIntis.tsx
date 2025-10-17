import React from 'react'
import './CompraIntis.css'
import Paquetes from './paquetes/paquetes'

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
        <Paquetes />
        <div className="modal-form">
          <label htmlFor="nombre">Nombre:</label>
          <input
            id="nombre"
            type="text"
            placeholder="Tu nombre completo"
            required
            style={{ marginBottom: '0.7rem' }}
          />
          <label htmlFor="cartera">Cartera digital:</label>
          <select id="cartera" required style={{ padding: '0.5rem', borderRadius: '0.5rem', width: '100%', fontSize: '1rem', marginBottom: '0.7rem' }}>
            <option value="">Selecciona una billetera</option>
            <option value="yape">Yape</option>
            <option value="plin">Plin</option>
            <option value="tunki">Tunki</option>
            <option value="bim">BIM</option>
            <option value="paypal">PayPal</option>
          </select>
          <button type="button" className="modal-buy">Comprar</button>
        </div>
      </div>
    </div>
  )
}

export default CompraIntis
