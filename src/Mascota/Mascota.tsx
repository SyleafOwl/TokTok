import React from 'react'
import './Mascota.css'
import { getUserXP, addPoints } from '../Perfil/xpStore'
import { feedPet, getPet, getPetRemote, PetState } from './mascotaStore'

const PET_IMG = 'https://preview.redd.it/z1gd2kwa4a361.jpg?width=1080&crop=smart&auto=webp&s=f0be45d17874f0dd0437eca0032b596cb66951db'

type Props = { usuario?: string }

const Mascota: React.FC<Props> = ({ usuario = '' }) => {
  // usar cache local inmediato y luego reemplazar con la versión remota cuando llegue
  const [pet, setPet] = React.useState<PetState>(() => getPet(usuario || 'anon'))
  const [pct, setPct] = React.useState(0)
  const [feeding, setFeeding] = React.useState(false)
  const [showNoPoints, setShowNoPoints] = React.useState(false)
  const [showBoom, setShowBoom] = React.useState(false)
  const [lastMilestone, setLastMilestone] = React.useState<number>(() => Math.floor((getPet(usuario || 'anon').size) || 1))
  const stageRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (!usuario) return
    const ctrl = new AbortController()
    ;(async () => {
      try {
        const remote = await getPetRemote(usuario, ctrl.signal)
        setPet(remote)
      } catch (err) {
        if ((err as any)?.name === 'AbortError') return
        // already handled by getPetRemote fallback — optionally log
        console.warn('pet load failed', err)
      }
    })()
    return () => { ctrl.abort() }
  }, [usuario])

  React.useEffect(() => {
    if (!usuario) { setPct(0); return }
    const id = setInterval(() => {
      const xp = getUserXP(usuario)
      const perLevel = 100
      const within = xp.points % perLevel
      setPct(Math.max(0, Math.min(100, Math.floor((within / perLevel) * 100))))
    }, 600)
    return () => clearInterval(id)
  }, [usuario])

  const spawnHearts = (n = 6) => {
    const el = stageRef.current
    if (!el) return
    for (let i = 0; i < n; i++) {
      const h = document.createElement('div')
      h.className = 'heart'
      h.textContent = '❤'
      const x = 50 + (Math.random() * 40 - 20)
      h.style.left = `${x}%`
      h.style.bottom = '80px'
      h.style.color = ['#ff6b6b','#ffd93d','#ff8e53','#ff4b5c'][i % 4]
      el.appendChild(h)
      setTimeout(() => { el.removeChild(h) }, 1100)
    }
  }

  const spawnConfetti = (n = 24) => {
    const el = stageRef.current
    if (!el) return
    for (let i = 0; i < n; i++) {
      const c = document.createElement('div')
      c.className = 'confetti'
      const hue = Math.floor(Math.random() * 360)
      c.style.background = `hsl(${hue} 90% 60%)`
      const x = 50 + (Math.random() * 40 - 20)
      c.style.left = `${x}%`
      c.style.bottom = '120px'
      c.style.transform = `rotate(${Math.random() * 360}deg)`
      c.style.width = `${6 + Math.random() * 6}px`
      c.style.height = `${8 + Math.random() * 10}px`
      el.appendChild(c)
      setTimeout(() => { el.removeChild(c) }, 1500)
    }
  }

  const triggerBoom = () => {
    setShowBoom(true)
    spawnConfetti(36)
    setTimeout(() => setShowBoom(false), 900)
  }

  const onFeed = (amount: number) => {
    if (!usuario) return
    const prevSize = pet.size
    const res = feedPet(usuario, amount)
    if (!res.ok) { setShowNoPoints(true); return }
    setPet(res.pet)
    setFeeding(true)
    spawnHearts(8)
    // Celebración si cruza un umbral entero de tamaño
    const prev = Math.floor(prevSize)
    const now = Math.floor(res.pet.size)
    if (now > prev) {
      setLastMilestone(now)
      triggerBoom()
    }
    setTimeout(() => setFeeding(false), 460)
  }

  const xp = usuario ? getUserXP(usuario) : { points: 0, level: 1, pct: 0, user: '', currBase: 0, nextBase: 100 }
  const scale = 0.8 + Math.min(1.2, pet.size) * 0.1

  return (
    <div className="mascota-page">
      <div className="mascota-card">
        <div className="mascota-header">
          <div className="mascota-title">Tu Mascota</div>
          <div className="mascota-meta">@{usuario || 'invitado'} · Nivel {xp.level} · Puntos {xp.points}</div>
        </div>
        <div ref={stageRef} className="mascota-stage">
          {showBoom && (
            <div className="damn-burst" aria-live="polite">DAMN!</div>
          )}
          <div className={`mascota-img ${feeding ? 'mascota-eat' : ''} ${showBoom ? 'mascota-boom' : ''}`} style={{ transform: `scale(${scale.toFixed(2)})` }}>
            <img src={PET_IMG} alt="Mascota" />
          </div>
        </div>
        <div className="mascota-stats">
          <div className="mascota-meta">Tamaño: {pet.size.toFixed(1)} · ❤ {pet.hearts}</div>
          <div className="mascota-bar" aria-label="Progreso XP"><span style={{ ['--pct' as any]: `${pct}%` }} /></div>
        </div>
        <div className="mascota-actions" role="group" aria-label="Alimentar mascota">
          <button className="mascota-btn" onClick={() => onFeed(10)}>Dar 10 pts</button>
          <button className="mascota-btn" onClick={() => onFeed(50)}>Dar 50 pts</button>
          <button className="mascota-btn" onClick={() => onFeed(100)}>Dar 100 pts</button>
          <button className="mascota-btn primary" onClick={() => onFeed(250)}>Banquete 250</button>
        </div>
      </div>
      {showNoPoints && (
        <div className="pet-overlay" role="dialog" aria-modal="true" aria-label="Puntos insuficientes">
          <div className="pet-modal">
            <h3>INSUFICIENTES PUNTOS</h3>
            <p>No tienes suficientes puntos para alimentar a tu mascota.</p>
            <div className="row">
              <button className="btn" onClick={() => setShowNoPoints(false)}>Cerrar</button>
              <button
                className="btn primary"
                onClick={() => {
                  if (!usuario) return
                  addPoints(usuario, 1000)
                  setShowNoPoints(false)
                }}
              >Añadir 1000 puntos (demo)</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Confeti y boom
// (placeholder removed — triggerBoom is declared above as a const)

export default Mascota
