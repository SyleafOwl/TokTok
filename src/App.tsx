import React, { useState, useCallback } from 'react'
import NavBar from './Navigation/NavBar'
import Home from './Home'
import PerfilPage from './Perfil/Perfil'
import Settings from './Settings/Settings'
import LoginScreen from './LogRegYTerm/LoginScreen'
import Nosotros from './Nosotros/Nosotros'

// App simple sin router: mantiene NavBar fijo y cambia el panel derecho
export type PageKey = 'home' | 'settings' | 'perfil' | 'nosotros'

const App: React.FC = () => {
  const [page, setPage] = useState<PageKey>('home')
  const [authenticated, setAuthenticated] = useState<boolean>(false)

  const handleNavigate = useCallback((to: PageKey) => {
    setPage(to)
  }, [])

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', position: 'relative' }}>
  <NavBar onNavigate={handleNavigate} current={page} />
      {page === 'home' && <Home />}
      {page === 'perfil' && (
        <div style={{ flex: 1, overflow: 'auto' }}>
          <PerfilPage />
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
        <LoginScreen show={!authenticated} onSuccess={() => setAuthenticated(true)} />
      )}
    </div>
  )
}

export default App
