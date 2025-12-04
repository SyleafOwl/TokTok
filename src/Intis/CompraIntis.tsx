import React from 'react'
import { createPortal } from 'react-dom'
import './CompraIntis.css'
import Paquetes from './paquetes/Paquetes'
import { adjustIntis, getIntisBalance, storage } from '../api'

export interface CompraIntisProps {
  abierto: boolean
  onCerrar: () => void
  onComprar: (monto: number) => void
  saldo?: number
}

type Vista = 'seleccion' | 'checkout'
const SOL_POR_INTI = 0.10 // 100 intis => 10 soles

const CompraIntis: React.FC<CompraIntisProps> = ({ abierto, onCerrar, onComprar, saldo = 0 }) => {
  const [monto, setMonto] = React.useState<number>(0)
  const [vista, setVista] = React.useState<Vista>('seleccion')
  const [customMode, setCustomMode] = React.useState(false)

  if (!abierto) return null

  const precio = Math.max(0, monto) * SOL_POR_INTI
  const formatearSoles = (v: number) => `S/ ${v.toFixed(2)}`
  // Reset solo al cerrar el panel explícitamente
  const reset = () => { setVista('seleccion'); setMonto(0); setCustomMode(false) }
  const handleClose = () => { reset(); onCerrar() }

  // Nota: no reiniciamos automáticamente al abrir/cerrar desde afuera.
  // Solo hacemos reset cuando el usuario cierra el panel (handleClose).

  // Error boundary para evitar pantalla negra si algún hijo falla al renderizar
  class ErrorCatcher extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
    constructor(props: { children: React.ReactNode }) {
      super(props)
      this.state = { hasError: false }
    }
    static getDerivedStateFromError() { return { hasError: true } }
    componentDidCatch(err: any) { console.error('CompraIntis render error:', err) }
    render() {
      if (this.state.hasError) {
        return (
          <div style={{ padding: '1rem', textAlign: 'center' }}>
            <h3 style={{ margin: 0, marginBottom: 8 }}>Algo salió mal</h3>
            <p style={{ opacity: 0.85 }}>No pudimos cargar este panel. Intenta de nuevo.</p>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
              <button className="modal-buy" onClick={() => this.setState({ hasError: false })}>Reintentar</button>
              <button className="modal-buy" onClick={handleClose}>Cerrar</button>
            </div>
          </div>
        )
      }
      return <>{this.props.children}</>
    }
  }

  const modal = (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-content">
        {vista === 'checkout' && (
          <button className="modal-back" onClick={() => setVista('seleccion')} aria-label="Volver">←</button>
        )}
        <button className="modal-close" onClick={handleClose} aria-label="Cerrar">×</button>
        <ErrorCatcher>
        {vista === 'seleccion' ? (
          <>
            <h2>Comprar Intis</h2>
            <div className="saldo-line">Saldo actual: <strong>{saldo}</strong> Intis</div>
            <Paquetes
              onSelect={(amt) => { setMonto(amt); setCustomMode(false) }}
              onCustom={() => { setCustomMode(true); setMonto(0) }}
              selectedAmount={!customMode ? monto : undefined}
              customSelected={customMode}
            />

            {customMode && (
              <div className="custom-section" role="region" aria-label="Monto personalizado">
                <label htmlFor="monto-personalizado">Intis personalizados</label>
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
                </div>
              </div>
            )}

            <div className="resumen-compra">
              <div className="resumen-item">
                <span>Vas a comprar</span>
                <strong>{monto > 0 ? `${monto} Intis` : '—'}</strong>
              </div>
              <div className="resumen-item">
                <span>Precio</span>
                <strong>{monto > 0 ? formatearSoles(precio) : '—'}</strong>
              </div>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="modal-buy"
                disabled={monto <= 0}
                onClick={() => setVista('checkout')}
              >
                Comprar
              </button>
            </div>
          </>
        ) : (
          <div className="checkout">
            <h2 className="checkout-title">Completar la compra</h2>
            <div className="checkout-resumen">
              <div className="checkout-row header">
                <div>Resumen de la compra</div>
                <div className="total">Total {formatearSoles(precio)}</div>
              </div>
              <div className="checkout-item">
                <div className="diamond">◆</div>
                <div className="desc">
                  <div className="name">Paquete de {monto} Intis</div>
                  <div className="meta">Cargo único — {new Date().toLocaleDateString()}</div>
                </div>
                <div className="price">{formatearSoles(precio)}</div>
              </div>
            </div>

            <div className="checkout-pagar">
              <div className="methods">
                <button className="method yape" aria-label="Pagar con Yape">
                  <span className="yape-bubble" aria-hidden="true">S/</span>
                  <span className="yape-word" aria-hidden="false">yape</span>
                </button>
                <button className="method alt">Ver otros métodos</button>
              </div>
              <div className="divider"><span>O</span></div>
              <div className="card-pay">
                <div className="mini-title">Pagar con tarjeta</div>
                <div className="grid">
                  <label>
                    <span>Nombre</span>
                    <input placeholder="Nombre" />
                  </label>
                  <label>
                    <span>Apellidos</span>
                    <input placeholder="Apellidos" />
                  </label>
                  <label>
                    <span>País</span>
                    <select defaultValue="PE">
                      <option value="PE">Perú</option>
                      <option value="US">Estados Unidos</option>
                    </select>
                  </label>
                  <div />
                  <label className="span2">
                    <span>Número de tarjeta de crédito</span>
                    <input placeholder="Número de tarjeta" />
                  </label>
                  <label>
                    <span>Mes de caducidad</span>
                    <input placeholder="MM" />
                  </label>
                  <label>
                    <span>Año de caducidad</span>
                    <input placeholder="AA" />
                  </label>
                  <label>
                    <span>CVV</span>
                    <input placeholder="CVV" />
                  </label>
                </div>
              </div>
            </div>

            <div className="checkout-actions">
              <button
                className="modal-buy"
                onClick={async () => {
                  // Actualizar saldo en backend y luego reflejar en UI
                  try {
                    const persona = storage.getPersona()
                    if (persona?.id && monto > 0) {
                      await adjustIntis(persona.id, Math.max(0, monto))
                      const bal = await getIntisBalance(persona.id)
                      // Pasar el monto a la TopBar y luego sincronizar al valor real
                      onComprar(monto)
                      // Opcional: podríamos mandar un callback para setear bal.balance
                    } else {
                      onComprar(monto)
                    }
                  } catch (err) {
                    console.warn('Compra/ajuste de Intis falló, aplicando solo estado local', err)
                    onComprar(monto)
                  }
                  handleClose()
                }}
              >Revisar compra</button>
            </div>
          </div>
        )}
        </ErrorCatcher>
      </div>
    </div>
  )

  // Renderizamos en portal para evitar conflictos de stacking context en la TopBar
  return createPortal(modal, document.body)
}

export default CompraIntis
