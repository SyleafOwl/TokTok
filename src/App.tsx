import React, { useState, useCallback } from 'react'
import NavBar from './NavLeft/NavBar'
import Home from './Home'
import PerfilPage from './Perfil/Perfil'
import Settings from './Settings/Settings'
import LoginScreen from './LogRegYTerm/LoginScreen'
import Nosotros from './Nosotros/Nosotros'
import PerfilTopBar from './NavRight/PerfilTopBar'
import Live from './LIVE/Live'
import RegalosPage from './Regalos/Regalos'
import MetricasPage from './Metricas/Metricas'
import TermsAndConditions from './LogRegYTerm/TerminosCondiciones'
import Crear from './Crear/Crear'
import Mascota from './Mascota/Mascota'

// App simple sin router: mantiene NavBar fijo y cambia el panel derecho
export type PageKey = 'home' | 'settings' | 'perfil' | 'nosotros' | 'live' | 'regalos' | 'metricas' | 'terminos' | 'crear' | 'mascota'

const App: React.FC = () => {
  const [page, setPage] = useState<PageKey>('home')
  const [authenticated, setAuthenticated] = useState<boolean>(false)
  const [usuario, setUsuario] = useState<string>('')
  const [rol, setRol] = useState<'viewer' | 'streamer'>('viewer')
  const [intis, setIntis] = useState<number>(0)

  const handleNavigate = useCallback((to: PageKey) => {
    setPage(to)
  }, [])

  // Logout: refresca la página para limpiar estado rápido
  const handleLogout = useCallback(() => {
    try {
      // Limpiar cualquier storage simple si hiciera falta
      // localStorage.clear(); // opcional: comenta si no quieres borrar todo
    } catch {}
    window.location.reload()
  }, [])

  // Handler de login simple: admin/admin => viewer, Streamer1/1234 => streamer
  const handleLoginSuccess = (username: string, role: 'viewer' | 'streamer') => {
    setUsuario(username)
    setRol(role)
    setAuthenticated(true)
  }

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', position: 'relative' }}>
  <NavBar onNavigate={handleNavigate} current={page} usuario={usuario} rol={rol} />
  <PerfilTopBar
    intis={intis}
    setIntis={setIntis}
    onNavigate={handleNavigate}
    onLogout={handleLogout}
    rol={rol}
    usuario={usuario}
  />
  {page === 'home' && <Home intis={intis} setIntis={setIntis} />}
      {page === 'perfil' && (
        <div style={{ flex: 1, overflow: 'auto' }}>
          <PerfilPage />
        </div>
      )}
      {page === 'live' && (
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <Live usuario={usuario} rol={rol} intis={intis} setIntis={setIntis} />
        </div>
      )}
      {page === 'regalos' && (
        <div style={{ flex: 1, overflow: 'auto' }}>
          <RegalosPage usuario={usuario} rol={rol} />
        </div>
      )}
      {page === 'metricas' && (
        <div style={{ flex: 1, overflow: 'auto' }}>
          <MetricasPage usuario={usuario} rol={rol} />
        </div>
      )}
      {page === 'settings' && (
        <div style={{ flex: 1, overflow: 'auto' }}>
          <Settings onBack={() => setPage('home')} onLogout={handleLogout} />
        </div>
      )}
      {page === 'crear' && (
        <div style={{ flex: 1, overflow: 'auto' }}>
          <Crear usuario={usuario} rol={rol} onGoRegalos={() => setPage('regalos')} />
        </div>
      )}
      {page === 'mascota' && (
        <div style={{ flex: 1, overflow: 'auto' }}>
          <Mascota usuario={usuario} />
        </div>
      )}
      {page === 'nosotros' && (
        <div style={{ flex: 1, overflow: 'auto' }}>
          <Nosotros onBack={() => setPage('home')} />
        </div>
      )}
      {page === 'terminos' && (
        <div style={{ flex: 1, overflow: 'auto' }}>
          <TermsAndConditions onBack={() => setPage('home')} />
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
