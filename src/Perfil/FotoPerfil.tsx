interface Props{
    imagenUrl: string;
    esCreador:boolean
}

const FotoPerfil= ({ imagenUrl, esCreador }: Props)=>{
    const containerClassName = `foto-container ${esCreador ? 'creador' : ''}`;
    return (
        <div className={containerClassName}>
            <img
            src={imagenUrl}
            alt="Foto de Perfil"
            className="img-fluid foto-perfil"
            />
        </div>
    )
}

export default FotoPerfil