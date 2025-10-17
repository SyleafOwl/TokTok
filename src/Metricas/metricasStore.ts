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
  return m
}

export function stopSession(user: string): UserMetrics {
  const db = loadDB()
  const m = db[user] || { user, totalMs: 0, sessions: [] }
  if (!m.activeSessionId) return m
  const idx = m.sessions.findIndex(s => s.id === m.activeSessionId)
  if (idx >= 0 && !m.sessions[idx].end) {
    m.sessions[idx].end = Date.now()
    const dur = Math.max(0, (m.sessions[idx].end! - m.sessions[idx].start))
    m.totalMs += dur
  }
  m.activeSessionId = undefined
  db[user] = m
  saveDB(db)
  return m
}

export function formatDuration(ms: number): string {
  const h = Math.floor(ms / 3600000)
  const m = Math.floor((ms % 3600000) / 60000)
  const s = Math.floor((ms % 60000) / 1000)
  return `${h}h ${m}m ${s}s`
}
