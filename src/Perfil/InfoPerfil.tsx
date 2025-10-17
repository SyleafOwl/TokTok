import { useEffect, useState } from 'react'
import { getUserXP } from './xpStore'

interface Props {
    usuario: string
    nombre:string
    estadisticas:{
        seguidos: number
        seguidores: number
    }
    bio:String
    esCreador:boolean
    onEstadisticasClick: ()=> void
}

const InfoPerfil = ({usuario, nombre,estadisticas,bio, esCreador, onEstadisticasClick}:Props) =>{
    const [nivel, setNivel] = useState<number>(1)
    const [puntos, setPuntos] = useState<number>(0)

    useEffect(() => {
        const sync = () => {
            const xp = getUserXP(usuario)
            setNivel(xp.level)
            setPuntos(xp.points)
        }
        sync()
        const id = setInterval(sync, 1000)
        return () => clearInterval(id)
    }, [usuario])
    return (
        <div>
            <h2 className="fw-bold mb-1">{usuario}
                <span className="ms-2 badge bg-secondary">Nivel {nivel}</span>
                {esCreador && (
                    <i className="bi bi-patch-check-fill ms-2 text-primary"></i>
                )}
            </h2>
            <h5 className="text-secondary mb-1">{nombre}</h5>
            <div className="text-secondary mb-3">Puntos: <strong className="text-white">{puntos}</strong></div>

            <div className="d-flex mb-3">
                <div className="me-4">
                    <strong className="text-white">{estadisticas.seguidos}</strong><span className="text-secondary"> Seguidos</span>
                </div>
                <div>
                    <strong className="text-white">{estadisticas.seguidores}</strong><span className="text-secondary"> Seguidores</span>
                </div>
            </div>

            <p>{bio}</p>

            {esCreador&& (
                <button
                    className="bton btn-outline-line-light mt-3"
                    onClick={onEstadisticasClick}
                >
                    <i className="bi bi-bar-chart-line-fill me-2"></i>
                    Ver Estadísticas de Creador
                </button>
            )}
        </div>
    )
}

export default InfoPerfil