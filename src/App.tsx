import React, { useState, useCallback } from 'react'
import NavBar from './Navigation/NavBar'
import Home from './Home'
import Settings from './Settings/Settings'

// App simple sin router: mantiene NavBar fijo y cambia el panel derecho
export type PageKey = 'home' | 'settings'

const App: React.FC = () => {
  const [page, setPage] = useState<PageKey>('home')

  const handleNavigate = useCallback((to: PageKey) => {
    setPage(to)
  }, [])

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw' }}>
      <NavBar onNavigate={handleNavigate} />
      {page === 'home' && <Home />}
      {page === 'settings' && (
        <div style={{ flex: 1, overflow: 'auto' }}>
          <Settings onBack={() => setPage('home')} onLogout={() => alert('Cerrar sesión')} />
        </div>
      )}
    </div>
  )
}

export default App
