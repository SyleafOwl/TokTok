import FollowingSec from "./FollowingSec/FollowingSec"
import './NavBar.css'
import HomeIcon from '@mui/icons-material/Home';
import ExploreIcon from '@mui/icons-material/Explore';
import FollowTheSignsIcon from '@mui/icons-material/FollowTheSigns';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
const NavBar = () => {
    return (
        <div className="contenedor-navbar">
            <div className="sidebar-nav"> {/* Cambiado de nav-bar a sidebar-nav */}
                <div className="nav-link">
                    <div className="nav-icon">
                        <HomeIcon/>    
                    </div>
                    <p>Para ti</p>
                </div>
                <div className="nav-link">
                    <div className="nav-icon">
                        <ExploreIcon/>
                    </div>
                    <p>Explorar</p>
                </div>
                <div className="nav-link">
                    <div className="nav-icon">
                        <FollowTheSignsIcon/>
                    </div>
                    <p>Siguiendo</p>
                </div>
                <div className="nav-link">
                    <div className="nav-icon">
                        <LiveTvIcon/>
                    </div>
                    <p>LIVE</p>
                </div>
                <div className="nav-link">
                    <div className="nav-icon">
                        <CloudUploadIcon/>
                    </div>
                    <p>Cargar</p>
                </div>
                <div className="nav-link">
                    <div className="nav-icon">
                        <AccountCircleIcon/>
                    </div>
                    <p>Perfil</p>
                </div>
                <div className="nav-link">
                    <div className="nav-icon">
                        <MoreHorizIcon/>
                    </div>
                    <p>Más</p>
                </div>
            </div>
            <FollowingSec/>
        </div>
        
        
    )
}

export default NavBar