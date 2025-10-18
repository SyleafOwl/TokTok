import './NavBar.css'
import HomeIcon from '@mui/icons-material/Home';
import ExploreIcon from '@mui/icons-material/Explore';
import FollowTheSignsIcon from '@mui/icons-material/FollowTheSigns';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
type PageKeyNav = 'home' | 'settings' | 'perfil' | 'nosotros' | 'live' | 'regalos' | 'metricas' | 'terminos' | 'crear' | 'mascota'
type NavBarProps = {
    onNavigate?: (to: PageKeyNav) => void
    current?: PageKeyNav
    usuario?: string
    rol?: 'viewer' | 'streamer'
}

const NavBar: React.FC<NavBarProps> = ({ onNavigate, current, rol }) => {
    return (
        <div className="contenedor-navbar">
            <div className="brand">
                <div className="brand-mark">TokTok</div>
            </div>
            <div className="sidebar-nav"> {/* Cambiado de nav-bar a sidebar-nav */}
                <div className={`nav-link ${current === 'home' ? 'active' : ''}`} onClick={() => onNavigate && onNavigate('home')}>
                    <div className="nav-icon">
                        <HomeIcon/>    
                    </div>
                    <p>Para ti</p>
                </div>
                <div className={`nav-link ${current === 'home' ? '' : ''}`}> {/* placeholder para Explorar */}
                    <div className="nav-icon">
                        <ExploreIcon/>
                    </div>
                    <p>Explorar</p>
                </div>
                <div className={`nav-link ${current === 'home' ? '' : ''}`}> {/* placeholder para Siguiendo */}
                    <div className="nav-icon">
                        <FollowTheSignsIcon/>
                    </div>
                    <p>Siguiendo</p>
                </div>
                <div className={`nav-link ${current === 'live' ? 'active' : ''}`} onClick={() => onNavigate && onNavigate('live')}>
                    <div className="nav-icon">
                        <LiveTvIcon/>
                    </div>
                    <p>LIVE</p>
                </div>
                <div className={`nav-link ${current === 'crear' ? 'active' : ''}`} onClick={() => onNavigate && onNavigate('crear')}>
                    <div className="nav-icon">
                        <AddCircleIcon/>
                    </div>
                    <p>Crear</p>
                </div>
                    {/* MASCOTA */}
                    <div className={`nav-link ${current === 'mascota' ? 'active' : ''}`} onClick={() => onNavigate && onNavigate('mascota')}>
                        <div className="nav-icon">
                            <span role="img" aria-label="Mascota">🐾</span>
                        </div>
                        <p>Mascota</p>
                    </div>
                <div className={`nav-link ${current === 'perfil' ? 'active' : ''}`} onClick={() => onNavigate && onNavigate('perfil')}>
                    <div className="nav-icon">
                        <AccountCircleIcon/>
                    </div>
                    <p>Perfil</p>
                </div>
                <div className={`nav-link ${current === 'settings' ? 'active' : ''}`} onClick={() => onNavigate && onNavigate('settings')}>
                    <div className="nav-icon">
                        <MoreHorizIcon/>
                    </div>
                    <p>Más</p>
                </div>
                {/* Insertar Quienes Somos y Términos justo debajo de Más */}
                <button className="nav-mini-link" onClick={() => onNavigate && onNavigate('nosotros')}>Quiénes Somos</button>
                <button className="nav-mini-link" onClick={() => onNavigate && onNavigate('terminos')}>Términos y Condiciones</button>
                {/* Acceso directo opcional a Regalos */}
                {/* <button className="nav-mini-link" onClick={() => onNavigate && onNavigate('regalos')}>Regalos</button> */}
                <div className="nav-mini-note">PW2025-2</div>
            </div>
        </div>
        
        
    )
}

export default NavBar
