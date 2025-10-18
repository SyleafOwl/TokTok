import React from 'react'
import './CompraIntis.css'
import Paquetes from './paquetes/Paquetes'

export interface CompraIntisProps {
  abierto: boolean
  onCerrar: () => void
  onComprar: (monto: number) => void
}

const CompraIntis: React.FC<CompraIntisProps> = ({ abierto, onCerrar, onComprar }) => {
  const [monto, setMonto] = React.useState(0)
  const [personalizar, setPersonalizar] = React.useState(false)

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
        <Paquetes onSelect={(amt) => { onComprar(amt); onCerrar(); }} />

        <div style={{ width: '100%', marginTop: '0.5rem' }}>
          <button
            type="button"
            className="modal-buy"
            onClick={() => setPersonalizar(v => !v)}
            aria-expanded={personalizar}
          >
            {personalizar ? 'Ocultar personalizado' : 'Personalizar'}
          </button>
        </div>

        {personalizar && (
          <div className="custom-section" role="region" aria-label="Recarga personalizada">
            <label htmlFor="monto-personalizado">Monto personalizado</label>
            <div className="custom-row">
              <input
                id="monto-personalizado"
                className="custom-amount"
                type="number"
                min={1}
                step={1}
                inputMode="numeric"
                placeholder="Ingresa los Intis"
                value={monto || ''}
                onChange={(e) => setMonto(parseInt(e.target.value || '0', 10))}
              />
              <button
                type="button"
                className="modal-buy"
                onClick={() => {
                  if (monto > 0) {
                    onComprar(monto)
                    setMonto(0)
                    onCerrar()
                  }
                }}
              >
                Recargar
              </button>
            </div>
          </div>
        )}
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
          <select id="cartera" required>
            <option value="">Selecciona una billetera</option>
            <option value="yape">Yape</option>
            <option value="plin">Plin</option>
            <option value="tunki">Tunki</option>
            <option value="bim">BIM</option>
            <option value="paypal">PayPal</option>
          </select>
          <button type="button" className="modal-buy">Comprar Intis</button>
        </div>
      </div>
    </div>
  )
}

export default CompraIntis
