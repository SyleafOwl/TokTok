import React, { useState, useCallback } from 'react'
import NavBar from './NavLeft/NavBar'
import Home from './Home'
import PerfilPage from './Perfil/Perfil'
import Settings from './Settings/Settings'
import LoginScreen from './LogRegYTerm/LoginScreen'
import Nosotros from './Nosotros/Nosotros'
import PerfilTopBar from './NavRight/PerfilTopBar'
import Live from './LIVE/Live'

// App simple sin router: mantiene NavBar fijo y cambia el panel derecho
export type PageKey = 'home' | 'settings' | 'perfil' | 'nosotros' | 'live'

const App: React.FC = () => {
  const [page, setPage] = useState<PageKey>('home')
  const [authenticated, setAuthenticated] = useState<boolean>(false)
  const [usuario, setUsuario] = useState<string>('')
  const [rol, setRol] = useState<'viewer' | 'streamer'>('viewer')
  const [intis, setIntis] = useState<number>(0)

  const handleNavigate = useCallback((to: PageKey) => {
    setPage(to)
  }, [])

  // Handler de login simple: admin/admin => viewer, Streamer1/1234 => streamer
  const handleLoginSuccess = (username: string, role: 'viewer' | 'streamer') => {
    setUsuario(username)
    setRol(role)
    setAuthenticated(true)
  }

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', position: 'relative' }}>
  <NavBar onNavigate={handleNavigate} current={page} />
  <PerfilTopBar intis={intis} setIntis={setIntis} onNavigate={handleNavigate} onLogout={() => { /* pendiente: cerrar sesión real */ }} />
      {page === 'home' && <Home />}
      {page === 'perfil' && (
        <div style={{ flex: 1, overflow: 'auto' }}>
          <PerfilPage />
        </div>
      )}
      {page === 'live' && (
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <Live usuario={usuario} rol={rol} />
        </div>
      )}
      {page === 'settings' && (
        <div style={{ flex: 1, overflow: 'auto' }}>
          <Settings onBack={() => setPage('home')} onLogout={() => alert('Cerrar sesión')} />
        </div>
      )}
      {page === 'nosotros' && (
        <div style={{ flex: 1, overflow: 'auto' }}>
          <Nosotros onBack={() => setPage('home')} />
        </div>
      )}
      {!authenticated && (
        <LoginScreen
          show={!authenticated}
          onSuccess={() => setAuthenticated(true)}
          onLoginCustom={(u, r) => handleLoginSuccess(u, r)}
        />
      )}
    </div>
  )
}

export default App
