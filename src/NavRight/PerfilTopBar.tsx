import { useEffect, useRef, useState } from 'react'
import GeneratingTokensIcon from '@mui/icons-material/GeneratingTokens'
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import CompraIntis from '../Intis/CompraIntis'
import './PerfilTopBar.css'

export interface PerfilTopBarProps {
  intis: number
  setIntis: React.Dispatch<React.SetStateAction<number>>
  onNavigate?: (to: 'home' | 'settings' | 'perfil' | 'nosotros' | 'regalos') => void
  onLogout?: () => void
}

const PerfilTopBar: React.FC<PerfilTopBarProps> = ({ intis, setIntis, onNavigate, onLogout }) => {
  const [mostrarCompra, setMostrarCompra] = useState(false)
  const [menuAbierto, setMenuAbierto] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)

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
      />

      {menuAbierto && (
        <div ref={menuRef} className="perfil-menu" role="menu" aria-label="Menú de perfil">
          <button className="perfil-menu__item" role="menuitem" onClick={() => { setMenuAbierto(false); onNavigate && onNavigate('perfil') }}>Ver tu perfil</button>
          <button className="perfil-menu__item" role="menuitem" onClick={() => { setMenuAbierto(false); onNavigate && onNavigate('settings') }}>Opciones</button>
          <button className="perfil-menu__item" role="menuitem" onClick={() => { setMenuAbierto(false); onNavigate && onNavigate('regalos') }}>Regalos</button>
          <div className="perfil-menu__separator"/>
          <button className="perfil-menu__item perfil-menu__danger" role="menuitem" onClick={() => { setMenuAbierto(false); onLogout && onLogout() }}>Cerrar sesión</button>
        </div>
      )}
    </div>
  )
}

export default PerfilTopBar
