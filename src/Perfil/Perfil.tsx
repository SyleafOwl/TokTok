import { useEffect, useState } from "react"
import FotoPerfil from "./FotoPerfil"
import InfoPerfil from "./InfoPerfil"
import NavVideos from "./NavVideos"
import VideosPerfil from "./VideosPerfil"
import { storage, getStreamerMetrics } from "../api"
import { getUserXP } from "./xpStore"

//Estos imports son para la interfaz de estadísticas de creador
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

import "./Perfil.css"

// Datos de ejemplo para videos y stats visuales (placeholder)
const ejemploVideos = [
  {id:1,thumbnailUrl: 'https://i.pinimg.com/736x/a8/8d/4d/a88d4d2433cec261fb891b189ae4c3d7.jpg', views:'4.6M'},
  {id:2,thumbnailUrl: 'https://i.pinimg.com/736x/a6/24/4c/a6244c36930d425e643459e698364deb.jpg', views:'3.6M'},
  {id:3,thumbnailUrl: 'https://i.pinimg.com/736x/19/02/bc/1902bc090ff8435d8a4e4750f961b6b9.jpg', views:'834K'},
]

const Perfil = () => {
    const [showModal, setShowModal] = useState(false)
    const persona = storage.getPersona()
    const rol = persona?.rol || 'viewer'
    const nombre = persona?.nombre || 'Invitado'
    const usuario = persona?.nombre || 'invitado'
    const [roleLabel, setRoleLabel] = useState<string>('')
    const [xpPct, setXpPct] = useState<number>(0)
    const [xpLevel, setXpLevel] = useState<number>(1)
            // Sincroniza nivel/porcentaje según rol
            useEffect(() => {
                setRoleLabel(rol === 'streamer' ? 'Streamer' : 'Viewer')
                const syncViewer = () => {
                    const xp = getUserXP(usuario)
                    setXpPct(xp.pct)
                    setXpLevel(xp.level)
                }
                const syncStreamer = async () => {
                    if (!persona) return
                    try {
                        const m = await getStreamerMetrics(persona.id)
                        const level = m.currentLevel
                        setXpLevel(level)
                        const minutesInLevel = 60
                        const msIntoLevel = Math.max(0, m.totalMs - (level - 1) * minutesInLevel * 60_000)
                        const pct = Math.max(0, Math.min(100, (msIntoLevel / (minutesInLevel * 60_000)) * 100))
                        setXpPct(pct)
                    } catch {}
                }
                const run = () => {
                    if (rol === 'viewer') syncViewer()
                    else syncStreamer()
                }
                run()
                const id = setInterval(run, 2000)
                return () => clearInterval(id)
            }, [rol, usuario, persona])
    const handleCloseModal = () => setShowModal(false)
    const handleShowModal= () =>setShowModal(true)

    return (
    <>
        <div className="container mt-4 text-white">
            <div className="row mb-5 align-items-center justify-content-center">
                <div className="col-auto me-4">
                <FotoPerfil imagenUrl={"https://preview.redd.it/z1gd2kwa4a361.jpg?width=1080&crop=smart&auto=webp&s=f0be45d17874f0dd0432eca0032b596cb66951db"} esCreador={rol === 'streamer'}/>
                </div>
                <div className="col-md-6 col-lg-5">
                    <InfoPerfil 
                        usuario={usuario}
                        nombre={`${nombre} · ${roleLabel}`}
                        estadisticas={{ seguidos: 0, seguidores: 0 }}
                        bio={rol === 'streamer' ? 'Streamer' : 'Viewer'}
                        esCreador={rol === 'streamer'}
                        onEstadisticasClick={handleShowModal}
                    />
                    <div className="perfil-xp-block">
                      <div className="perfil-xpbar"><span style={{ width: `${xpPct}%` }}/></div>
                      <div className="perfil-xplevel">Nivel {xpLevel}</div>
                    </div>
                </div>
            </div>

            <hr className="border-secondary mt-0"/>

            <NavVideos/>
            <VideosPerfil videos={ejemploVideos}/>
        
        </div>

        <Modal show={showModal} onHide={handleCloseModal} centered>
            <Modal.Header closeButton closeVariant="white" className="bg-dark text-white border-secondary">
            <Modal.Title>Estadísticas</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-white">
            <p><strong>Rol:</strong> {roleLabel}</p>
            <p><strong>Nivel actual:</strong> {xpLevel}</p>
            <p><strong>Progreso:</strong> {Math.round(xpPct)}%</p>
        </Modal.Body>
        <Modal.Footer className="bg-dark text-white border-secondary">
            <Button variant="secondary" onClick={handleCloseModal}>
            Cerrar
            </Button>
        </Modal.Footer>
        </Modal>
    </>
    )
}

export default Perfil
