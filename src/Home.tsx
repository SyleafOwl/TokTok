import React, { useEffect, useRef, useState } from 'react';
import './Home.css';
import ComentariosPanel from './Comentarios/ComentariosPanel';
import RegalosPanel, { Regalo } from './Regalos/RegalosPanel';

// Hola, todos estos comentarios si estan hecho con IA para explicar el codigo
// y ayudar a entender la logica detras de cada parte.
// Por siaca si algo no se entiende XD
// ========================= REGALOS =========================
// Estructura de un regalo y lista por defecto.
// - emoji: lo que se muestra
// - name: nombre del regalo
// - cost: coste ficticio en "monedas" (sin lógica aún)
type Gift = Regalo;
const GIFTS: Gift[] = [
	{ id: 'owl', emoji: '🦉', name: 'Búho', cost: 5 },
	{ id: 'rose', emoji: '🌹', name: 'Rosa', cost: 10 },
	{ id: 'lion', emoji: '🦁', name: 'León', cost: 25 },
	{ id: 'confetti', emoji: '🎉', name: 'Confetti', cost: 50 },
	{ id: 'mic', emoji: '🎤', name: 'Micrófono', cost: 75 },
	{ id: 'gem', emoji: '💎', name: 'Diamante', cost: 100 },
];

const getMoreVideos = (startId: number, count = 2) => {
	// Simula traer más videos
	return Array.from({ length: count }, (_, i) => ({
		id: startId + i,
		user: `@usuario${startId + i}`,
		description: `Video extra #${startId + i}`,
		song: `Canción #${startId + i}`,
		likes: `${Math.floor(Math.random() * 100)}K`,
		comentarios: `${Math.floor(Math.random() * 10)}K`,
		compartir: `${Math.floor(Math.random() * 1000)}`,
		perfil: String.fromCharCode(65 + ((startId + i) % 26)),
	}));
};

const initialVideos: any[] = getMoreVideos(1, 2);

const TokTokHome: React.FC = () => {
	const [videos, setVideos] = useState(initialVideos);
	const [loading, setLoading] = useState(false);
	const videoContainerRef = useRef<HTMLDivElement>(null);
	// ID del video cuyo panel de regalos está abierto (o null si ninguno)
	const [openGiftFor, setOpenGiftFor] = useState<number | null>(null);
	// ID del video cuyo panel de comentarios está abierto (o null si ninguno)
	const [openCommentsFor, setOpenCommentsFor] = useState<number | null>(null);
	// Ya no es necesario cargar los primeros videos en useEffect

	useEffect(() => {
		const handleScroll = () => {
			const container = videoContainerRef.current;
			if (!container || loading) return;

			// Cerrar el panel de regalos al scrollear
			if (openGiftFor !== null) {
				setOpenGiftFor(null);
			}
			// Cerrar el panel de comentarios al scrollear
			if (openCommentsFor !== null) {
				setOpenCommentsFor(null);
			}

			// Detecta si el usuario está cerca del final
			if (
				container.scrollTop + container.clientHeight >=
				container.scrollHeight - 200
			) {
				setLoading(true);
				setTimeout(() => {
					setVideos((prev) => [...prev, ...getMoreVideos(prev.length + 1, 2)]);
					setLoading(false);
				}, 1000); // Simula delay de red
			}
		};

		const container = videoContainerRef.current;
		if (container) {
			container.addEventListener('scroll', handleScroll);
		}
		return () => {
			if (container) {
				container.removeEventListener('scroll', handleScroll);
			}
		};
	}, [loading, openGiftFor, openCommentsFor]);

	// Cerrar comentarios con tecla ESC
	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				setOpenCommentsFor(null);
				setOpenGiftFor(null);
			}
		};
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	}, []);

	// Abre/cierra el panel de regalos para un video específico
	const toggleGiftPanel = (videoId: number) => {
		setOpenGiftFor((curr) => (curr === videoId ? null : videoId));
		// si se abre regalos, cerramos comentarios
		setOpenCommentsFor(null);
	};

	// Maneja el envío de un regalo (por ahora solo muestra un mensaje).
	// Aquí en el futuro se integrará la lógica de monedas / pagos / animaciones.
	const handleSendGift = (videoId: number, gift: Gift) => {
		alert(`Enviado ${gift.emoji} ${gift.name} (coste: ${gift.cost} monedas) al video #${videoId}`);
		setOpenGiftFor(null);
	};

	// Abre/cierra el panel de comentarios para un video específico
	const toggleComments = (videoId: number) => {
		setOpenCommentsFor((curr) => (curr === videoId ? null : videoId));
		// si se abre comentarios, cerramos regalos
		setOpenGiftFor(null);
	};

	return (
		<div className="tiktok-container">
			<div className="main-content">
				   {/* ...eliminado nav superior... */}

				{/* Contenedor de videos */}
				<div className="video-container" ref={videoContainerRef}>
					{videos.map((video) => (
						<div key={video.id} className="feed-item">
							<div className="video-card">
								{/* Video centrado */}
								<div className="video-wrapper">
									<video
										className="video-player"
										controls
										autoPlay
										muted
										loop
										src="/ruta-del-video.mp4"
										poster="/ruta-thumbnail.jpg"
									/>
								</div>

								{/* Información del video */}
								<div className="video-info">
									<h3 className="user">{video.user}</h3>
									<p className="description">{video.description}</p>
									<p className="song">{video.song}</p>
								</div>
							</div>

							{/* Barra lateral de acciones fuera del video */
							/* actions-wrapper posiciona el panel de regalos a la derecha de la barra */}
							<div className="actions-wrapper">
							<div className="action-bar">
								<div className="action-item">
									<div className="perfil">{video.perfil}</div>
									<span className="follow-btn">+</span>
								</div>
								<div className="action-item">
									<div className="icon">❤️</div>
									<span className="count">{video.likes}</span>
								</div>
								<div className="action-item">
									<div className="icon" onClick={() => toggleComments(video.id)}>💬</div>
									<span className="count">{video.comentarios}</span>
								</div>
								<div className="action-item">
									<div className="icon">🔄</div>
									<span className="count">{video.compartir}</span>
								</div>
								{/* Botón de regalos: abre/cierra el panel */}
								<div className="action-item" onClick={() => toggleGiftPanel(video.id)}>
									<div className="icon">🎁</div>
									<span className="count">Regalos</span>
								</div>
								<div className="action-item">
									<div className="music-album">🎵</div>
								</div>
							</div>
							{/* Panel flotante de regalos reutilizable */}
							{openGiftFor === video.id && (
								<RegalosPanel
									abierto
									regalos={GIFTS}
									onEnviar={(g) => handleSendGift(video.id, g)}
									onCerrar={() => setOpenGiftFor(null)}
								/>
							)}
							</div>
						</div>
					))}
					{loading && (
						<div style={{ color: '#fff', margin: '20px' }}>
							Cargando más videos...
						</div>
					)}
				</div>

				   {/* ...eliminado nav inferior... */}
				{/* Panel fijo de comentarios (pegado a la derecha de la pantalla) */}
				{openCommentsFor !== null && (
					<ComentariosPanel
						videoId={openCommentsFor}
						onClose={() => setOpenCommentsFor(null)}
					/>
				)}
			</div>
		</div>
	);
};

export default TokTokHome;