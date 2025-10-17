import { useState } from "react"
import FotoPerfil from "./FotoPerfil"
import InfoPerfil from "./InfoPerfil"
import NavVideos from "./NavVideos"
import VideosPerfil from "./VideosPerfil"

//Estos imports son para la interfaz de estadísticas de creador
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

import "./Perfil.css"

const datosUsuario = {
    nombre: 'Usuario de prueba',
    usuario: 'TheUserPW',
    imagenUrl: 'https://preview.redd.it/z1gd2kwa4a361.jpg?width=1080&crop=smart&auto=webp&s=f0be45d17874f0dd0437eca0032b596cb66951db',
    bio: 'Biografía de usuario de prueba',
    estadisticas: {
        seguidos: 846,
        seguidores: 450,
    },
    esCreador: true,
    estadisticasCreador:{
        likesSemana: '1.2k',
        comentariosSemana: '342',
        nuevosSeguidores: '128'
    },
    videos:[
        {id:1,thumbnailUrl: 'https://i.pinimg.com/736x/a8/8d/4d/a88d4d2433cec261fb891b189ae4c3d7.jpg', views:'4.6M'},
        {id:2,thumbnailUrl: 'https://i.pinimg.com/736x/a6/24/4c/a6244c36930d425e643459e698364deb.jpg', views:'3.6M'},
        {id:3,thumbnailUrl: 'https://i.pinimg.com/736x/19/02/bc/1902bc090ff8435d8a4e4750f961b6b9.jpg', views:'834K'},
        {id:4,thumbnailUrl: 'https://i.pinimg.com/736x/df/85/5e/df855eb919118e9c11be697778fddaf3.jpg', views:'1K'},
        {id:5,thumbnailUrl: 'https://i.pinimg.com/1200x/e5/15/5b/e5155bf095f473cb755ca4083a664c01.jpg', views:'1.2M'},
        {id:6,thumbnailUrl: 'https://i.pinimg.com/736x/9f/99/68/9f9968370d2a9a534db6b1f3108af151.jpg', views:'367K'},
        {id:7,thumbnailUrl: 'https://i.pinimg.com/1200x/f9/92/f1/f992f1d36e43974125028988f5cd111c.jpg', views:'47K'},
        {id:8,thumbnailUrl: 'https://i.pinimg.com/736x/1a/3f/17/1a3f1736df026cb050ee120fa1fab2da.jpg', views:'2.3M'},
    ]
}

const Perfil = () => {
    const [showModal, setShowModal] = useState(false)
    const handleCloseModal = () => setShowModal(false)
    const handleShowModal= () =>setShowModal(true)

    return (
    <>
        <div className="container mt-4 text-white">
            <div className="row mb-5 align-items-center justify-content-center">
                <div className="col-auto me-4">
                <FotoPerfil imagenUrl={datosUsuario.imagenUrl} esCreador={datosUsuario.esCreador}/>
                </div>
                <div className="col-md-6 col-lg-5">
                    <InfoPerfil 
                        usuario={datosUsuario.usuario}
                        nombre={datosUsuario.nombre}
                        estadisticas={datosUsuario.estadisticas}
                        bio={datosUsuario.bio}
                        esCreador={datosUsuario.esCreador}
                        onEstadisticasClick={handleShowModal}
                    />
                </div>
            </div>

            <hr className="border-secondary mt-0"/>

            <NavVideos/>
            <VideosPerfil videos={datosUsuario.videos}/>
        
        </div>

        <Modal show={showModal} onHide={handleCloseModal} centered>
            <Modal.Header closeButton closeVariant="white" className="bg-dark text-white border-secondary">
            <Modal.Title>Estadísticas del Creador</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-white">
            <p><strong>Likes en la última semana:</strong> {datosUsuario.estadisticasCreador.likesSemana}</p>
            <p><strong>Comentarios en la última semana:</strong> {datosUsuario.estadisticasCreador.comentariosSemana}</p>
            <p><strong>Nuevos seguidores:</strong> {datosUsuario.estadisticasCreador.nuevosSeguidores}</p>
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
