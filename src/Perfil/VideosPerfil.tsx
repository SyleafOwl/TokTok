interface Video {
    id: number
    thumbnailUrl: string
    views: string
}

interface Props{
    videos: Video[]
}

const VideosPerfil =({ videos }:Props)=>{
    return (
        <div className="row g-2">
            {videos.map((video)=> (
                <div key={video.id} className="col-3">
                    <div className="video-card">
                        <img src={video.thumbnailUrl} alt={'Video ${video.id}'}/>
                        <div className="view-overlay">
                            <i className="bi bi-play-fill"></i>
                            <span>{video.views}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default VideosPerfil