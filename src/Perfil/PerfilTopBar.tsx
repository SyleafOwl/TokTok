import { useState } from 'react'
import GeneratingTokensIcon from '@mui/icons-material/GeneratingTokens'
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import CompraIntisModal from '../Intis/CompraIntisModal'
import './PerfilTopBar.css'

export interface PerfilTopBarProps {
  intis: number
  setIntis: React.Dispatch<React.SetStateAction<number>>
}

const PerfilTopBar: React.FC<PerfilTopBarProps> = ({ intis, setIntis }) => {
  const [mostrarCompra, setMostrarCompra] = useState(false)

  const manejarCompra = (monto: number) => {
    setIntis((prev) => prev + monto)
  }

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
          <button className="perfil-topbar__btn" title="Perfil">
            <AccountCircleIcon/>
          </button>
        </div>
      </div>

      <CompraIntisModal
        abierto={mostrarCompra}
        onCerrar={() => setMostrarCompra(false)}
        onComprar={manejarCompra}
      />
    </div>
  )
}

export default PerfilTopBar
