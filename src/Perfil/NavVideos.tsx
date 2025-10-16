// Este contenedor es para el "mini encabezado" que dice videos,favoritos, me gusta
const NavVideos =()=>{
    return (
        <ul className="nav nav-tabs justify-content-center border-0 mb-4">
            <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="#">
                    <i className="bi bi-grid-3x3-gap-fill me-2"></i>
                Videos
                </a>
            </li>
            <li className="nav-item">
                <a className="nav-link" href="#">
                    <i className="bi bi-bookmark-fill me-2"></i>
                Favoritos
                </a>
            </li>
            <li className="nav-item">
                <a className="nav-link" href="#">
                    <i className="bi bi-heart-fill me-2"></i>
                Me gusta
                </a>
            </li>
        </ul>
    )
}

export default NavVideos