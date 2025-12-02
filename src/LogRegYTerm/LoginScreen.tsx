import React, { useRef, useState } from 'react'
import { registrar, loguear, storage, Rol } from '../api'
import { saveUserProfile } from '../Perfil/userStore'
import Nosotros from '../Nosotros/Nosotros'
import TermsAndConditions from './TerminosCondiciones'

type Props = { show?: boolean; onSuccess: () => void; onClose?: () => void; onLoginCustom?: (u: string, r: 'viewer' | 'streamer') => void }

// Floating label input similar to Google's sign-up fields
type FloatingProps = {
  id: string
  label: string
  type?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const FloatingField: React.FC<FloatingProps> = ({ id, label, type = 'text', value, onChange }) => {
  const [focused, setFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const float = focused || value.length > 0

  const wrapperStyle: React.CSSProperties = { position: 'relative', marginBottom: type === 'password' ? 16 : 12 }
  const inputStyle: React.CSSProperties = {
    width: '100%', padding: 12, border: `1px solid ${focused ? 'var(--accent)' : 'rgba(255,255,255,0.12)'}`,
    borderRadius: 10, background: 'transparent', color: 'var(--text-primary)', outline: 'none'
  }
  const labelStyle: React.CSSProperties = {
    position: 'absolute', left: 12, top: float ? -10 : 12, fontSize: float ? 12 : 14,
    color: 'var(--text-primary)', opacity: float ? 0.9 : 0.7, padding: '0 6px',
    background: 'var(--sidebar-bg)', transition: 'all 150ms ease', cursor: 'text',
  }

  return (
    <div style={wrapperStyle}>
      <span
        style={labelStyle}
        onMouseDown={(e) => { e.preventDefault(); inputRef.current?.focus() }}
      >{label}</span>
      <input
        ref={inputRef}
        id={id}
        type={type}
        value={value}
        placeholder=""
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={onChange}
        style={inputStyle}
      />
    </div>
  )
}

const LoginScreen: React.FC<Props> = ({ show = true, onSuccess, onLoginCustom }) => {
  const [activeTab, setActiveTab] = useState<'register' | 'login'>('register')
  const [view, setView] = useState<'main' | 'nosotros' | 'terms'>('main')
  const [username, setUsername] = useState('')
  const [contact, setContact] = useState('')
  const [password, setPassword] = useState('')
  const [loginUsername, setLoginUsername] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [selectedRole, setSelectedRole] = useState<null | 'streamer' | 'viewer'>(null)
  const [loading, setLoading] = useState(false)
  if (!show) return null

  const handleRegister = async () => {
    const uname = username.trim()
    if (!uname) { alert('Por favor, ingresa tu Nombre de Usuario.'); return }
    if (!password.trim()) { alert('Ingresa una Contraseña.'); return }
    if (!selectedRole) { alert('Selecciona tu Rol: Streamer o Viewer.'); return }
    // Rol exactamente 'viewer' | 'streamer' (normaliza por si hubiera valores antiguos como 'creador')
    const rolBackend: Rol = ((selectedRole as any) === 'creador' ? 'streamer' : selectedRole) as Rol
    try {
      setLoading(true)
      // Log mínimo para depurar (se oculta la contraseña)
      try { console.info('Registrando usuario:', { usuario: uname, rol: rolBackend, clave: '***', correo: contact.trim() || undefined }) } catch {}
      const { token, persona } = await registrar(uname, rolBackend, password.trim(), contact.trim() || undefined)
      storage.setToken(token)
      storage.setPersona(persona)
      saveUserProfile({ username: uname, contact: contact.trim() || undefined, role: selectedRole })
      onLoginCustom && onLoginCustom(uname, selectedRole)
      onSuccess()
    } catch (err: any) {
      alert(err?.message || 'Error al registrar')
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async () => {
    const uname = loginUsername.trim()
    if (!uname) { alert('Ingresa tu Usuario.'); return }
    if (!loginPassword.trim()) { alert('Ingresa tu Contraseña.'); return }
    try {
      setLoading(true)
      const { token, persona } = await loguear(uname, loginPassword.trim())
      storage.setToken(token)
      storage.setPersona(persona)
      // Si el backend devuelve rol 'viewer'|'streamer', úsalo en la app
      const rol = (persona.rol === 'streamer' ? 'streamer' : 'viewer') as 'viewer' | 'streamer'
      onLoginCustom && onLoginCustom(uname, rol)
      onSuccess()
    } catch (err: any) {
      alert(err?.message || 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  if (view === 'nosotros') {
    return (
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 3000, overflow: 'auto' }}>
        <Nosotros onBack={() => setView('main')} />
      </div>
    )
  }
  if (view === 'terms') {
    return (
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 3000, overflow: 'auto', padding: '20px 0' }}>
        <TermsAndConditions onBack={() => setView('main')} />
      </div>
    )
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
      <div style={{ maxWidth: '460px', width: '92vw', margin: '50px auto', padding: '28px', background: 'var(--sidebar-bg)', color: 'var(--text-primary)', borderRadius: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.35)', textAlign: 'center' }}>
        <h2 style={{ marginBottom: 6 }}>Bienvenido a TokTok</h2>
        <p style={{ marginBottom: 16, fontSize: 14, fontWeight: 700, opacity: 0.9 }}>Elige Registrar o Iniciar Sesión.</p>

        {/* Tabs: Register | Login */}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 16 }}>
          <button onClick={() => setActiveTab('register')} style={{ padding: 10, borderRadius: 10, border: '1px solid rgba(255,255,255,0.12)', background: activeTab === 'register' ? 'var(--accent)' : 'transparent', color: activeTab === 'register' ? '#fff' : 'var(--text-primary)', fontWeight: 800, cursor: 'pointer', minWidth: 110 }}>Register</button>
          <button onClick={() => setActiveTab('login')} style={{ padding: 10, borderRadius: 10, border: '1px solid rgba(255,255,255,0.12)', background: activeTab === 'login' ? 'var(--accent)' : 'transparent', color: activeTab === 'login' ? '#fff' : 'var(--text-primary)', fontWeight: 800, cursor: 'pointer', minWidth: 110 }}>Login</button>
        </div>

        {activeTab === 'register' ? (
          <>
            <div style={{ textAlign: 'left' }}>
              <FloatingField id="uname" label="Usuario" value={username} onChange={e => setUsername(e.target.value)} />
              <FloatingField id="contact" label="Correo electrónico o Teléfono" value={contact} onChange={e => setContact(e.target.value)} />
              <FloatingField id="pwd" label="Contraseña" type="password" value={password} onChange={e => setPassword(e.target.value)} />
            </div>

            <div style={{ textAlign: 'left', marginTop: 4 }}>
              <div style={{ fontWeight: 800, marginBottom: 10 }}>Selecciona tu Rol:</div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={() => setSelectedRole('streamer')}
                  style={{ flex: 1, padding: 12, borderRadius: 10, border: '1px solid rgba(255,255,255,0.12)', background: selectedRole === 'streamer' ? 'var(--accent)' : 'transparent', color: selectedRole === 'streamer' ? '#fff' : 'var(--text-primary)', fontWeight: 800, cursor: 'pointer' }}
                >Streamer</button>
                <button
                  onClick={() => setSelectedRole('viewer')}
                  style={{ flex: 1, padding: 12, borderRadius: 10, border: '1px solid rgba(255,255,255,0.12)', background: selectedRole === 'viewer' ? 'var(--accent)' : 'transparent', color: selectedRole === 'viewer' ? '#fff' : 'var(--text-primary)', fontWeight: 800, cursor: 'pointer' }}
                >Viewer</button>
              </div>
            </div>

            {/* Botón Registrar */}
            <button onClick={handleRegister} disabled={loading} style={{ width: '100%', marginTop: 14, padding: 12, borderRadius: 10, border: 'none', background: 'var(--accent)', color: '#fff', fontWeight: 800, cursor: 'pointer' }}>{loading ? 'Procesando...' : 'Registrar'}</button>

            {/* Separador */}
            <div style={{ height: 1, background: 'rgba(255,255,255,0.12)', margin: '14px 0' }} />

            {/* Iniciar con Google (placeholder no implementado) */}
            <button onClick={() => alert('Registro con Google no implementado')} style={{ width: '100%', padding: 12, borderRadius: 10, border: '1px solid #dadce0', background: '#fff', color: '#000', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <svg width="18" height="18" viewBox="0 0 533.5 544.3" aria-hidden="true">
                <path fill="#4285F4" d="M533.5 278.4c0-18.6-1.6-37-4.8-54.8H272v103.8h146.9c-6.4 34.6-25.9 63.9-55.1 83.5v68h89.1c52.3-48.2 80.6-119.2 80.6-200.5z"/>
                <path fill="#34A853" d="M272 544.3c73.7 0 135.7-24.4 180.9-66.2l-89.1-68c-24.7 16.6-56.2 26-91.8 26-70.5 0-130.2-47.5-151.6-111.2H27.7v69.9C72.7 487.1 165.8 544.3 272 544.3z"/>
                <path fill="#FBBC05" d="M120.4 324.9c-10.2-30.6-10.2-63.8 0-94.4V160.6H27.7c-40.5 80.9-40.5 177.4 0 258.3l92.7-69.9z"/>
                <path fill="#EA4335" d="M272 107.7c38.9-.6 76.3 14.3 104.5 41.9l78.1-78.1C407 24.6 340.5-1.4 272 0 165.8 0 72.7 57.2 27.7 160.6l92.7 69.9C141.8 155.4 201.5 107.7 272 107.7z"/>
              </svg>
              Iniciar con Google
            </button>

            <div style={{ marginTop: 14, fontSize: 12, opacity: 0.9 }}>
              ¿Quiénes Somos <span onClick={() => setView('nosotros')} style={{ color: 'var(--accent)', fontWeight: 800, cursor: 'pointer' }}>nosotros</span>?
            </div>
            <div style={{ marginTop: 6, fontSize: 12 }}>
              <span onClick={() => setView('terms')} style={{ color: 'var(--accent)', fontWeight: 800, cursor: 'pointer' }}>Términos y Condiciones</span>
            </div>
          </>
        ) : (
          <>
            <div style={{ textAlign: 'left' }}>
              <FloatingField id="login_uname" label="Usuario" value={loginUsername} onChange={e => setLoginUsername(e.target.value)} />
              <FloatingField id="login_pwd" label="Contraseña" type="password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} />
            </div>
            <button onClick={handleLogin} disabled={loading} style={{ width: '100%', padding: 12, borderRadius: 10, border: '1px solid rgba(255,255,255,0.12)', background: 'var(--accent)', color: '#fff', fontWeight: 800, cursor: 'pointer' }}>{loading ? 'Procesando...' : 'Entrar'}</button>

            {/* Separador */}
            <div style={{ height: 1, background: 'rgba(255,255,255,0.12)', margin: '14px 0' }} />

            {/* Iniciar con Google en Login (botón blanco con icono, colores oficiales) */}
            <button onClick={() => alert('Login con Google no implementado')} style={{ width: '100%', padding: 12, borderRadius: 10, border: '1px solid #dadce0', background: '#fff', color: '#000', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <svg width="18" height="18" viewBox="0 0 533.5 544.3" aria-hidden="true">
                <path fill="#4285F4" d="M533.5 278.4c0-18.6-1.6-37-4.8-54.8H272v103.8h146.9c-6.4 34.6-25.9 63.9-55.1 83.5v68h89.1c52.3-48.2 80.6-119.2 80.6-200.5z"/>
                <path fill="#34A853" d="M272 544.3c73.7 0 135.7-24.4 180.9-66.2l-89.1-68c-24.7 16.6-56.2 26-91.8 26-70.5 0-130.2-47.5-151.6-111.2H27.7v69.9C72.7 487.1 165.8 544.3 272 544.3z"/>
                <path fill="#FBBC05" d="M120.4 324.9c-10.2-30.6-10.2-63.8 0-94.4V160.6H27.7c-40.5 80.9-40.5 177.4 0 258.3l92.7-69.9z"/>
                <path fill="#EA4335" d="M272 107.7c38.9-.6 76.3 14.3 104.5 41.9l78.1-78.1C407 24.6 340.5-1.4 272 0 165.8 0 72.7 57.2 27.7 160.6l92.7 69.9C141.8 155.4 201.5 107.7 272 107.7z"/>
              </svg>
              Iniciar con Google
            </button>

            <div style={{ marginTop: 14, fontSize: 12, opacity: 0.9 }}>
              ¿Quiénes Somos <span onClick={() => setView('nosotros')} style={{ color: 'var(--accent)', fontWeight: 800, cursor: 'pointer' }}>nosotros</span>?
            </div>
            <div style={{ marginTop: 6, fontSize: 12 }}>
              <span onClick={() => setView('terms')} style={{ color: 'var(--accent)', fontWeight: 800, cursor: 'pointer' }}>Términos y Condiciones</span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default LoginScreen