import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Home from './Home.tsx'
import NavBar from './Navigation/NavBar.tsx'


import React from 'react';
import ReactDOM from 'react-dom/client';

// 🛑 Importa el componente de Login
import LoginScreen from './LoginScreen.tsx'; 


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

//Inicializar el log in 
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* ✅ Renderiza directamente el LoginScreen */}
    <LoginScreen /> 
  </React.StrictMode>,
);