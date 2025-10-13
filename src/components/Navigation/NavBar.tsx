import FollowingSec from "./FollowingSec/FollowingSec"
import './NavBar.css'
const NavBar = () => {
    return (
        <div className="contenedor-navbar">
            <div className="nav-bar">
                <div className="nav-link">Para ti</div>
                <div className="nav-link">Explorar</div>
                <div className="nav-link">Siguiendo</div>
                <div className="nav-link">LIVE</div>
                <div className="nav-link">Cargar</div>
                <div className="nav-link">Perfil</div>
                <div className="nav-link">Más</div>
            </div>
            <FollowingSec/>
        </div>
    )
}

export default NavBar