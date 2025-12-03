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
      if ('clave' in obj) (obj as any).clave = '***';
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
  // Normalizar rol defensivamente y usar las claves solicitadas por el usuario
  const rolNorm = (rol as any) === 'creador' ? 'streamer' : rol;
  // Mapeo: Usuario, Correo, Clave, Rol
  const body: any = { usuario: nombre, correo: contacto, clave: password, rol: rolNorm };
  // Nota: eliminamos 'password', 'contrasena' y cualquier campo no usado
  const resp = await request('/api/autenticacion/registrar', {
    method: 'POST',
    body: JSON.stringify(body),
  });
  return resp;
}

// Login de usuario registrado
export async function loguear(nombre: string, password: string): Promise<AuthResponse> {
  // Login: Usuario y Clave
  const body = { usuario: nombre, clave: password } as any;
  const resp = await request('/api/autenticacion/ingresar', {
    method: 'POST',
    body: JSON.stringify(body),
  });
  return resp;
}

// ---- MÉTRICAS DE STREAMER ----

export interface StreamerMetrics {
  id: string;
  userId: string;
  totalMs: number;
  totalSessions: number;
  currentLevel: number;
  lastLevelUpAt?: string; // ISO DateTime o null
  createdAt: string;
  updatedAt: string;
}

export interface StreamSession {
  id: string;
  userId: string;
  startTime: string; // ISO DateTime
  endTime?: string; // ISO DateTime o null
  durationMs: number;
  createdAt: string;
  updatedAt: string;
}

export interface AudienceLevel {
  id: string;
  userId: string;
  level: number;
  name: string;
  description?: string;
  viewPermissions?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface Gift {
  id: string;
  name: string;
  emoji: string;
  coins: number;
  receiverId: string;
  senderId?: string;
  streamSessionId?: string;
  message?: string;
  quantity: number;
  createdAt: string;
}

export interface Comment {
  id: string;
  userId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

// Obtener métricas del streamer
export async function getStreamerMetrics(userId: string): Promise<StreamerMetrics> {
  return request(`/api/metrics/${userId}`, { method: 'GET' });
}

// Finalizar sesión de transmisión: actualiza totalMs, totalSessions y detecta level-up
export async function endStreamSession(userId: string, durationMs: number): Promise<StreamerMetrics> {
  return request(`/api/metrics/${userId}/session-end`, {
    method: 'POST',
    body: JSON.stringify({ durationMs }),
  });
}

// Recalcular métricas desde todas las StreamSession del usuario
export async function recalculateMetrics(userId: string): Promise<StreamerMetrics> {
  return request(`/api/metrics/${userId}/recalculate`, {
    method: 'POST',
    body: JSON.stringify({}),
  });
}

// Crear una nueva sesión de transmisión
export async function startStreamSession(userId: string): Promise<StreamSession> {
  return request(`/api/stream-session`, {
    method: 'POST',
    body: JSON.stringify({ userId, startTime: new Date().toISOString() }),
  });
}

// Obtener todas las sesiones de un streamer
export async function getStreamSessions(userId: string): Promise<StreamSession[]> {
  return request(`/api/stream-session/${userId}`, { method: 'GET' });
}

// Configurar niveles de audiencia para un streamer
export async function setAudienceLevel(userId: string, level: number, name: string, description?: string, viewPermissions?: Record<string, any>): Promise<AudienceLevel> {
  return request(`/api/audience-level`, {
    method: 'POST',
    body: JSON.stringify({ userId, level, name, description, viewPermissions }),
  });
}

// Obtener niveles de audiencia de un streamer
export async function getAudienceLevels(userId: string): Promise<AudienceLevel[]> {
  return request(`/api/audience-level/${userId}`, { method: 'GET' });
}

// Enviar un regalo
export async function sendGift(receiverId: string, name: string, emoji: string, coins: number, senderId?: string, message?: string, streamSessionId?: string): Promise<Gift> {
  return request(`/api/gift`, {
    method: 'POST',
    body: JSON.stringify({ receiverId, name, emoji, coins, senderId, message, streamSessionId }),
  });
}

// Obtener regalos recibidos por un streamer
export async function getReceivedGifts(receiverId: string): Promise<Gift[]> {
  return request(`/api/gift/received/${receiverId}`, { method: 'GET' });
}

// Crear comentario
export async function createComment(userId: string, content: string): Promise<Comment> {
  return request(`/api/comment`, {
    method: 'POST',
    body: JSON.stringify({ userId, content }),
  });
}

// Obtener comentarios
export async function getComments(limit: number = 50): Promise<Comment[]> {
  return request(`/api/comment?limit=${limit}`, { method: 'GET' });
}

export const storage = {
  getToken(): string | null { return localStorage.getItem('toktok_token'); },
  setToken(token: string) { localStorage.setItem('toktok_token', token); },
  clear() { localStorage.removeItem('toktok_token'); localStorage.removeItem('toktok_persona'); },
  getPersona(): Persona | null { const v = localStorage.getItem('toktok_persona'); return v ? JSON.parse(v) : null; },
  setPersona(p: Persona) { localStorage.setItem('toktok_persona', JSON.stringify(p)); },
};
