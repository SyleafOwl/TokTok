import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import './main.css'
import App from './App'
import { BrowserRouter } from 'react-router-dom'

// Activar modo oscuro por defecto
document.body.classList.add('theme-dark')

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename="/TokTok-Frontend">
      <App />
    </BrowserRouter>
  </StrictMode>,
)