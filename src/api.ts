// Cliente API mínimo para TokTok-Backend
// Usa únicamente la variable de entorno Vite VITE_API_URL

const ENV_API = (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_URL) || ''
export const BASE_URL = ENV_API;

async function request(path: string, options: RequestInit = {}) {
  if (!BASE_URL) {
    throw new Error('VITE_API_URL no está configurada. Define VITE_API_URL en .env');
  }
  const url = `${BASE_URL}${path}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };
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
    throw new Error(message);
  }
  return data;
}

export type Rol = 'visitante' | 'creador';
export interface Persona {
  id: string;
  nombre: string;
  rol: Rol;
}
export interface AuthResponse { token: string; persona: Persona }

// Registro de usuario nuevo (no login)
export async function registrar(nombre: string, rol: Rol, password: string, contacto?: string): Promise<AuthResponse> {
  const body = { nombre, rol, password, contacto };
  const resp = await request('/api/autenticacion/registrar', {
    method: 'POST',
    body: JSON.stringify(body),
  });
  return resp;
}

// Login de usuario registrado
export async function loguear(nombre: string, password: string): Promise<AuthResponse> {
  const body = { nombre, password };
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
