import React, { useEffect, useRef, useState } from 'react';
import './Home.css';


const getMoreVideos = (startId: number, count = 2) => {
	// Simula traer más videos
	return Array.from({ length: count }, (_, i) => ({
		id: startId + i,
		user: `@usuario${startId + i}`,
		description: `Video extra #${startId + i}`,
		song: `Canción #${startId + i}`,
		likes: `${Math.floor(Math.random() * 100)}K`,
		comments: `${Math.floor(Math.random() * 10)}K`,
		shares: `${Math.floor(Math.random() * 1000)}`,
		avatar: String.fromCharCode(65 + ((startId + i) % 26)),
	}));
};

const initialVideos: any[] = getMoreVideos(1, 2);

const TokTokHome: React.FC = () => {
	const [videos, setVideos] = useState(initialVideos);
	const [loading, setLoading] = useState(false);
	const videoContainerRef = useRef<HTMLDivElement>(null);
	// Ya no es necesario cargar los primeros videos en useEffect

	useEffect(() => {
		const handleScroll = () => {
			const container = videoContainerRef.current;
			if (!container || loading) return;

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
	}, [loading]);

	return (
		<div className="tiktok-container">
			<div className="main-content">
				   {/* ...eliminado nav superior... */}

				{/* Contenedor de videos */}
				<div className="video-container" ref={videoContainerRef}>
					{videos.map((video) => (
						<div key={video.id} className="video-card">
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

							{/* Barra lateral de acciones */}
							   <div className="action-bar">
								   <div className="action-item">
									   <div className="avatar">{video.avatar}</div>
									   <span className="follow-btn">+</span>
								   </div>
								   <div className="action-item">
									   <div className="icon">❤️</div>
									   <span className="count">{video.likes}</span>
								   </div>
								   <div className="action-item">
									   <div className="icon">💬</div>
									   <span className="count">{video.comments}</span>
								   </div>
								   <div className="action-item">
									   <div className="icon">🔄</div>
									   <span className="count">{video.shares}</span>
								   </div>
								   <div className="action-item">
									   <div className="music-album">🎵</div>
								   </div>
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
			</div>
		</div>
	);
};

export default TokTokHome;