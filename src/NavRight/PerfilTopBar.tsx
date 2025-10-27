import { useEffect, useRef, useState } from 'react'
import GeneratingTokensIcon from '@mui/icons-material/GeneratingTokens'
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import CompraIntis from '../Intis/CompraIntis'
import './PerfilTopBar.css'
import { getUserXP } from '../Perfil/xpStore'

export interface PerfilTopBarProps {
  intis: number
  setIntis: React.Dispatch<React.SetStateAction<number>>
  onNavigate?: (to: 'home' | 'settings' | 'perfil' | 'nosotros' | 'regalos' | 'metricas') => void
  onLogout?: () => void
  rol?: 'viewer' | 'streamer'
  usuario?: string
}

const PerfilTopBar: React.FC<PerfilTopBarProps> = ({ intis, setIntis, onNavigate, onLogout, rol = 'viewer', usuario }) => {
  const [mostrarCompra, setMostrarCompra] = useState(false)
  const [menuAbierto, setMenuAbierto] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const [mostrarAvisoViewer, setMostrarAvisoViewer] = useState(false)
  const [xpPct, setXpPct] = useState<number>(0)
  const [xpLevel, setXpLevel] = useState<number>(1)

  const manejarCompra = (monto: number) => {
    setIntis((prev) => prev + monto)
  }

  // Cerrar menú con click fuera
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!menuRef.current) return
      if (menuRef.current.contains(e.target as Node)) return
      setMenuAbierto(false)
    }
    if (menuAbierto) document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [menuAbierto])

  // Cerrar con ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuAbierto(false)
    }
    if (menuAbierto) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuAbierto])

  // mientras el menú está abierto, refrescar XP del viewer cada ~1s
  useEffect(() => {
    if (!menuAbierto || rol !== 'viewer' || !usuario) return
    const sync = () => {
      const xp = getUserXP(usuario!)
      setXpPct(xp.pct)
      setXpLevel(xp.level)
    }
    sync()
    const id = setInterval(sync, 1000)
    return () => clearInterval(id)
  }, [menuAbierto, rol, usuario])

  return (
    <div className="perfil-topbar-container" role="banner">
      <div className="perfil-topbar">
        <div className="perfil-topbar__group">
          <button className="perfil-topbar__btn" onClick={() => setMostrarCompra(true)} title="Comprar Intis">
            <GeneratingTokensIcon/>
          </button>
          <div className="perfil-topbar__intis" aria-label={`Saldo: ${intis} intis`}>
            <span>{intis}</span>
          </div>
        </div>

        <div className="perfil-topbar__group">
          <button className="perfil-topbar__btn" title="Descargar App">
            <PhoneAndroidIcon/>
          </button>
        </div>

        <div className="perfil-topbar__divider" aria-hidden/>

        <div className="perfil-topbar__group">
          <button className="perfil-topbar__btn" title="Perfil" onClick={() => setMenuAbierto((v) => !v)} aria-haspopup="menu" aria-expanded={menuAbierto}>
            <AccountCircleIcon/>
          </button>
        </div>
      </div>

      <CompraIntis
        abierto={mostrarCompra}
        onCerrar={() => setMostrarCompra(false)}
        onComprar={manejarCompra}
        saldo={intis}
      />

      {menuAbierto && (
        <div ref={menuRef} className="perfil-menu" role="menu" aria-label="Menú de perfil">
          {/* Encabezado con nombre de usuario y progreso (solo viewer) */}
          <div className="perfil-menu__header">
            <div className="perfil-menu__user">{usuario ? `@${usuario}` : 'Invitado'}</div>
            {rol === 'viewer' && (
              <div className="perfil-menu__xp">
                <div className="perfil-menu__xpbar"><span style={{ width: `${xpPct}%` }}/></div>
                <div className="perfil-menu__xplevel">Nivel {xpLevel}</div>
              </div>
            )}
          </div>
          <button className="perfil-menu__item" role="menuitem" onClick={() => { setMenuAbierto(false); onNavigate && onNavigate('perfil') }}>Tu Perfil</button>
          <button
            className="perfil-menu__item"
            role="menuitem"
            onClick={() => {
              setMenuAbierto(false)
              if (rol === 'streamer') { onNavigate && onNavigate('metricas') }
              else { setMostrarAvisoViewer(true) }
            }}
          >
            Métricas
          </button>
          <button className="perfil-menu__item" role="menuitem" onClick={() => { setMenuAbierto(false); onNavigate && onNavigate('settings') }}>Opciones</button>
          <button
            className="perfil-menu__item"
            role="menuitem"
            onClick={() => {
              setMenuAbierto(false)
              if (rol === 'streamer') {
                onNavigate && onNavigate('regalos')
              } else {
                setMostrarAvisoViewer(true)
              }
            }}
          >
            Tus Regalos
          </button>
          <div className="perfil-menu__separator"/>
          <button className="perfil-menu__item perfil-menu__danger" role="menuitem" onClick={() => { setMenuAbierto(false); onLogout && onLogout() }}>Cerrar sesión</button>
        </div>
      )}

      {mostrarAvisoViewer && (
        <div className="perfil-guard-overlay" role="dialog" aria-label="Solo Streamers">
          <div className="perfil-guard-modal">
            <h4>¡Solamente para Streamers!</h4>
            <p>Esta sección es exclusiva para cuentas de Streamer.</p>
            <div className="perfil-guard-actions">
              <button className="perfil-menu__item" onClick={() => setMostrarAvisoViewer(false)}>Entendido</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PerfilTopBar
