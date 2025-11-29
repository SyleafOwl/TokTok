// Minimal API client for TokTok-Backend
// Chooses BASE_URL based on environment (localhost vs GitHub Pages)

const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
// Permite configurar el backend en producción vía variable de entorno Vite
const ENV_BASE = (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_BACKEND_URL) || ''
const PROD_BASE = ENV_BASE || 'https://<tu-backend-en-render>'; // Reemplaza cuando tengas tu dominio
export const BASE_URL = isLocal ? 'http://localhost:3000' : PROD_BASE;

async function request(path: string, options: RequestInit = {}) {
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

export async function salud() {
  return request('/api/salud');
}

export async function ingresar(nombre: string, rol: Rol): Promise<{ token: string; persona: Persona; }> {
  const body = { nombre, rol };
  const resp = await request('/api/autenticacion/ingresar', {
    method: 'POST',
    body: JSON.stringify(body),
  });
  return resp;
}

export async function listarPersonas(limite = 10, cursor?: string): Promise<{ personas: Persona[]; siguienteCursor?: string; }> {
  const qp = new URLSearchParams();
  qp.set('limite', String(limite));
  if (cursor) qp.set('cursor', cursor);
  return request(`/api/personas?${qp.toString()}`);
}

export async function obtenerPersona(id: string): Promise<Persona> {
  return request(`/api/personas/${id}`);
}

export async function crearPersona(nombre: string, rol: Rol, token: string): Promise<Persona> {
  return request('/api/personas', {
    method: 'POST',
    body: JSON.stringify({ nombre, rol }),
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export const storage = {
  getToken(): string | null { return localStorage.getItem('toktok_token'); },
  setToken(token: string) { localStorage.setItem('toktok_token', token); },
  clear() { localStorage.removeItem('toktok_token'); localStorage.removeItem('toktok_persona'); },
  getPersona(): Persona | null { const v = localStorage.getItem('toktok_persona'); return v ? JSON.parse(v) : null; },
  setPersona(p: Persona) { localStorage.setItem('toktok_persona', JSON.stringify(p)); },
};
