import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Home from './Home.tsx'
import NavBar from './Navigation/NavBar.tsx'
import Top_Header from './header/Top_Header.tsx'

// Activar modo oscuro por defecto
document.body.classList.add('theme-dark')

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <div style={{ display: 'flex', height: '100vh', width: '100vw' }}>
      <NavBar/>
      <Home />
    </div>
  </StrictMode>,
)
