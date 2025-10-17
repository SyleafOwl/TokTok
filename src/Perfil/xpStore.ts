export type UserXP = {
  user: string
  points: number
}

const KEY = 'toktok_xp_v1'

type DB = { [user: string]: UserXP }

function loadDB(): DB {
  try { const raw = localStorage.getItem(KEY); return raw ? JSON.parse(raw) : {} } catch { return {} }
}
function saveDB(db: DB) { try { localStorage.setItem(KEY, JSON.stringify(db)) } catch {} }

export function addPoints(user: string, delta: number): UserXP {
  if (!user) return { user: '', points: 0 }
  const db = loadDB()
  const curr = db[user] || { user, points: 0 }
  curr.points = Math.max(0, curr.points + Math.floor(delta))
  db[user] = curr
  saveDB(db)
  return curr
}

export function addWatchSeconds(user: string, seconds: number): UserXP {
  return addPoints(user, Math.max(0, Math.floor(seconds)))
}

export function getUserXP(user: string): { user: string; points: number; level: number; pct: number; currBase: number; nextBase: number } {
  const db = loadDB()
  const curr = db[user] || { user, points: 0 }
  const perLevel = 100
  const level = Math.floor(curr.points / perLevel) + 1
  const currBase = Math.floor((level - 1) * perLevel)
  const nextBase = level * perLevel
  const within = curr.points - currBase
  const pct = Math.max(0, Math.min(100, Math.floor((within / perLevel) * 100)))
  return { user, points: curr.points, level, pct, currBase, nextBase }
}
