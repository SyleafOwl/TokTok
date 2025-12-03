import * as api from '../api'

export type LiveSession = {
  id: string
  user: string
  start: number // epoch ms
  end?: number  // epoch ms
}

export type UserMetrics = {
  user: string
  totalMs: number
  sessions: LiveSession[]
  activeSessionId?: string
}

const KEY = 'toktok_metricas_v1'

type DB = { [user: string]: UserMetrics }

function loadDB(): DB {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : {}
  } catch { return {} }
}

function saveDB(db: DB) {
  try { localStorage.setItem(KEY, JSON.stringify(db)) } catch {}
}

// Sincronizar desde backend si está disponible
export async function syncMetricsFromBackend(userId: string): Promise<UserMetrics | null> {
  try {
    const metrics = await api.getStreamerMetrics(userId)
    const db = loadDB()
    db[userId] = {
      user: userId,
      totalMs: metrics.totalMs,
      sessions: [], // Backend no devuelve sesiones individuales en getStreamerMetrics
    }
    saveDB(db)
    return db[userId]
  } catch (e) {
    console.warn('[metricasStore] Error sincronizando desde backend:', e)
    return null
  }
}

export function getUserMetrics(user: string): UserMetrics {
  const db = loadDB()
  if (!db[user]) db[user] = { user, totalMs: 0, sessions: [] }
  return db[user]
}

export function getAllMetrics(): UserMetrics[] {
  const db = loadDB()
  return Object.values(db).sort((a, b) => (b.totalMs - a.totalMs))
}

export function startSession(user: string): UserMetrics {
  const db = loadDB()
  if (!db[user]) db[user] = { user, totalMs: 0, sessions: [] }
  const m = db[user]
  if (m.activeSessionId) return m // already running
  const id = `s_${Date.now()}`
  const sess: LiveSession = { id, user, start: Date.now() }
  m.sessions.push(sess)
  m.activeSessionId = id
  saveDB(db)
  
  // Enviar al backend si está disponible
  api.startStreamSession(user).catch(e => console.warn('[startStreamSession] Error:', e))
  
  return m
}

export async function stopSession(user: string): Promise<UserMetrics> {
  const db = loadDB()
  const m = db[user] || { user, totalMs: 0, sessions: [] }
  if (!m.activeSessionId) return m
  
  const idx = m.sessions.findIndex(s => s.id === m.activeSessionId)
  let durationMs = 0
  
  if (idx >= 0 && !m.sessions[idx].end) {
    m.sessions[idx].end = Date.now()
    durationMs = Math.max(0, (m.sessions[idx].end! - m.sessions[idx].start))
    m.totalMs += durationMs
  }
  
  m.activeSessionId = undefined
  db[user] = m
  saveDB(db)
  
  // Enviar al backend si está disponible
  try {
    const updated = await api.endStreamSession(user, durationMs)
    // Actualizar desde backend para sincronizar nivel
    db[user].totalMs = updated.totalMs
    saveDB(db)
  } catch (e) {
    console.warn('[stopSession] Error enviando al backend:', e)
  }
  
  return m
}

export function formatDuration(ms: number): string {
  const h = Math.floor(ms / 3600000)
  const m = Math.floor((ms % 3600000) / 60000)
  const s = Math.floor((ms % 60000) / 1000)
  return `${h}h ${m}m ${s}s`
}
