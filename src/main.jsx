import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import './main.css'
import App from './App'


import React from 'react';
import ReactDOM from 'react-dom/client';

// 🛑 Importa el componente de Login
import LoginScreen from './LoginScreen.tsx'; 


// Activar modo oscuro por defecto
document.body.classList.add('theme-dark')

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

//Inicializar el log in 
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* ✅ Renderiza directamente el LoginScreen */}
    <LoginScreen /> 
  </React.StrictMode>,
);