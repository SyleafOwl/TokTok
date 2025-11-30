// Cliente API mínimo para TokTok-Backend
// Usa únicamente la variable de entorno Vite VITE_API_URL

function getBaseUrl(): string {
  return 'https://toktok-backend-ytga.onrender.com';
}

async function request(path: string, options: RequestInit = {}) {
  const base = getBaseUrl()
  if (!base) {
    throw new Error('VITE_API_URL no está configurada. Define VITE_API_URL en .env (o setea window.__TOKTOK_API_URL__ o localStorage("toktok_api_url"))');
  }
  const url = `${base}${path}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };
  try { 
    const preview = typeof options.body === 'string' ? options.body : undefined;
    console.info('[TokTok API] →', { url, method: (options.method||'GET'), headers, body: preview ? safePreview(preview) : undefined });
  } catch {}
  const res = await fetch(url, { ...options, headers });
  const text = await res.text();
  let data: any;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }
  if (!res.ok) {
    const message = data?.message || res.statusText;
    try { console.warn('[TokTok API] ← error', { status: res.status, message, data }); } catch {}
    throw new Error(message);
  }
  try { console.info('[TokTok API] ← ok', { status: res.status, data }); } catch {}
  return data;
}

function safePreview(bodyStr: string) {
  try {
    const obj = JSON.parse(bodyStr);
    if (obj && typeof obj === 'object') {
      if ('password' in obj) obj.password = '***';
      if ('contrasena' in obj) obj.contrasena = '***';
    }
    return JSON.stringify(obj);
  } catch { return bodyStr }
}

export type Rol = 'viewer' | 'streamer';
export interface Persona {
  id: string;
  nombre: string;
  rol: Rol;
}
export interface AuthResponse { token: string; persona: Persona }

// Registro de usuario nuevo (no login)
export async function registrar(nombre: string, rol: Rol, password: string, contacto?: string): Promise<AuthResponse> {
  // Normalizar rol defensivamente y enviar ambas claves de contraseña por compatibilidad
  const rolNorm = (rol as any) === 'creador' ? 'streamer' : rol;
  const body: any = { nombre, rol: rolNorm, password, contrasena: password };
  if (contacto !== undefined) body.contacto = contacto;
  const resp = await request('/api/autenticacion/registrar', {
    method: 'POST',
    body: JSON.stringify(body),
  });
  return resp;
}

// Login de usuario registrado
export async function loguear(nombre: string, password: string): Promise<AuthResponse> {
  // Enviar ambas variantes de contraseña por compatibilidad
  const body = { nombre, password, contrasena: password } as any;
  const resp = await request('/api/autenticacion/ingresar', {
    method: 'POST',
    body: JSON.stringify(body),
  });
  return resp;
}

// Otras APIs se conectarán más adelante; mantenemos solo auth + storage por ahora.

export const storage = {
  getToken(): string | null { return localStorage.getItem('toktok_token'); },
  setToken(token: string) { localStorage.setItem('toktok_token', token); },
  clear() { localStorage.removeItem('toktok_token'); localStorage.removeItem('toktok_persona'); },
  getPersona(): Persona | null { const v = localStorage.getItem('toktok_persona'); return v ? JSON.parse(v) : null; },
  setPersona(p: Persona) { localStorage.setItem('toktok_persona', JSON.stringify(p)); },
};
