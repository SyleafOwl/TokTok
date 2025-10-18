import { addPoints, getUserXP } from '../Perfil/xpStore'

export type PetState = {
  user: string
  size: number // grows with feeding
  hearts: number // total fed counts for fun
  lastFed?: number
}

const KEY = 'toktok_pet_v1'

type DB = { [user: string]: PetState }

function loadDB(): DB {
  try { const raw = localStorage.getItem(KEY); return raw ? JSON.parse(raw) as DB : {} } catch { return {} }
}
function saveDB(db: DB) { try { localStorage.setItem(KEY, JSON.stringify(db)) } catch {}
}

export function getPet(user: string): PetState {
  const db = loadDB()
  if (!db[user]) db[user] = { user, size: 1, hearts: 0 }
  return db[user]
}

export function feedPet(user: string, cost: number): { ok: boolean; pet: PetState; reason?: string } {
  if (!user) return { ok: false, pet: { user: '', size: 1, hearts: 0 }, reason: 'no-user' }
  const xp = getUserXP(user)
  if (xp.points < cost) return { ok: false, pet: getPet(user), reason: 'no-points' }
  // Deduct points from viewer XP as "food"
  addPoints(user, -cost)
  const db = loadDB()
  const pet = db[user] || { user, size: 1, hearts: 0 }
  // Growth logic: small diminishing returns
  const growth = Math.max(0.1, Math.log10(cost + 9)) // 10->1, 50->~1.7, 100->~2
  pet.size = Math.min(10, pet.size + growth)
  pet.hearts += 1
  pet.lastFed = Date.now()
  db[user] = pet
  saveDB(db)
  return { ok: true, pet }
}
