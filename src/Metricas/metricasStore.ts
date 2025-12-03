import * as api from '../api'

export type LiveSession = {
  id: string
  user: string
  start: number // epoch ms
  end?: number  // epoch ms
}

export type StreamSession = {
  id: string
  start: number
  end?: number | null
  paused?: boolean
  pausedAt?: number | null
  pausedAccumMs?: number
}

export type UserMetrics = {
  user: string
  sessions: StreamSession[]
  activeSessionId?: string | null
  totalMs?: number
}

const STORAGE_KEY = 'toktok_metricas'

function loadAll(): UserMetrics[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

function saveAll(list: UserMetrics[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

export function getAllMetrics(): UserMetrics[] {
  const list = loadAll()
  return list.map(calcTotals)
}

export function getUserMetrics(user: string): UserMetrics {
  const list = loadAll()
  const found = list.find((u) => u.user === user)
  if (!found) {
    const empty: UserMetrics = { user, sessions: [], activeSessionId: null, totalMs: 0 }
    return empty
  }
  return calcTotals(found)
}

function calcTotals(u: UserMetrics): UserMetrics {
  const now = Date.now()
  let total = 0
  const sessions = (u.sessions || []).map((s) => {
    const pausedAccum = s.pausedAccumMs || 0
    const extraPaused = s.paused && s.pausedAt ? now - (s.pausedAt || 0) : 0
    const endTime = s.end ?? now
    const duration = Math.max(0, endTime - s.start - (pausedAccum + extraPaused))
    total += duration
    return s
  })
  return { ...u, sessions, totalMs: total }
}

function ensureUser(user: string): UserMetrics {
  const list = loadAll()
  let u = list.find((x) => x.user === user)
  if (!u) {
    u = { user, sessions: [], activeSessionId: null, totalMs: 0 }
    list.push(u)
    saveAll(list)
  }
  return u
}

export async function startSession(user: string): Promise<StreamSession> {
  const list = loadAll()
  let u = list.find((x) => x.user === user)
  if (!u) {
    u = { user, sessions: [], activeSessionId: null, totalMs: 0 }
    list.push(u)
  }
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  const session: StreamSession = { id, start: Date.now(), end: null, paused: false, pausedAt: null, pausedAccumMs: 0 }
  u.sessions = u.sessions || []
  u.sessions.push(session)
  u.activeSessionId = id
  saveAll(list)
  return session
}

export async function stopSession(user: string): Promise<void> {
  const list = loadAll()
  const u = list.find((x) => x.user === user)
  if (!u || !u.activeSessionId) return
  const s = u.sessions.find((ss) => ss.id === u.activeSessionId)
  if (!s) return
  // if paused, finalize pausedAccum
  if (s.paused && s.pausedAt) {
    s.pausedAccumMs = (s.pausedAccumMs || 0) + (Date.now() - s.pausedAt)
    s.paused = false
    s.pausedAt = null
  }
  s.end = Date.now()
  u.activeSessionId = null
  saveAll(list)
}

export async function pauseSession(user: string): Promise<void> {
  const list = loadAll()
  const u = list.find((x) => x.user === user)
  if (!u || !u.activeSessionId) return
  const s = u.sessions.find((ss) => ss.id === u.activeSessionId)
  if (!s) return
  if (s.paused) return
  s.paused = true
  s.pausedAt = Date.now()
  saveAll(list)
}

export async function resumeSession(user: string): Promise<void> {
  const list = loadAll()
  const u = list.find((x) => x.user === user)
  if (!u || !u.activeSessionId) return
  const s = u.sessions.find((ss) => ss.id === u.activeSessionId)
  if (!s || !s.paused) return
  const now = Date.now()
  const delta = (s.pausedAt ? now - s.pausedAt : 0)
  s.pausedAccumMs = (s.pausedAccumMs || 0) + delta
  s.paused = false
  s.pausedAt = null
  saveAll(list)
}

export function formatDuration(ms: number): string {
  const h = Math.floor(ms / 3600000)
  const m = Math.floor((ms % 3600000) / 60000)
  const s = Math.floor((ms % 60000) / 1000)
  return `${h}h ${m}m ${s}s`
}
