import './NavBar.css'
import HomeIcon from '@mui/icons-material/Home';
import ExploreIcon from '@mui/icons-material/Explore';
import FollowTheSignsIcon from '@mui/icons-material/FollowTheSigns';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
type NavBarProps = {
    onNavigate?: (to: 'home' | 'settings' | 'perfil' | 'nosotros' | 'live') => void
    current?: 'home' | 'settings' | 'perfil' | 'nosotros' | 'live'
}

const NavBar: React.FC<NavBarProps> = ({ onNavigate, current }) => {
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
                <div className={`nav-link ${current === 'home' ? '' : ''}`}> {/* placeholder para Cargar */}
                    <div className="nav-icon">
                        <CloudUploadIcon/>
                    </div>
                    <p>Cargar</p>
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
                {/* Insertar Quienes Somos y PW2025-2 justo debajo de Más */}
                <button className="nav-mini-link" onClick={() => onNavigate && onNavigate('nosotros')}>Quiénes Somos</button>
                <div className="nav-mini-note">PW2025-2</div>
            </div>
        </div>
        
        
    )
}

export default NavBar
