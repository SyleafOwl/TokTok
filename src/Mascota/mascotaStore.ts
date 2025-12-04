import { addPoints, getUserXP } from '../Perfil/xpStore'
import { createPet, fetchPet } from '../api'

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

/**
 * createPetRemote: crea una mascota en /api/pets y guarda en cache local.
 * Nota: el endpoint verifica size, hearts y userId; enviamos hearts=1 por defecto
 * porque el endpoint actual rechaza valores falsy (0).
 */
export async function createPetRemote(user: string, size = 1, hearts = 1, signal?: AbortSignal): Promise<PetState> {
  if (!user) throw new Error('no-user')
  // Nota: las funciones de api.ts no aceptan AbortSignal directamente; si se requiere, se puede extender.
  const data = await createPet(user, size, hearts)
  const pet: PetState = {
    user,
    size: typeof data.size === 'number' ? data.size : size,
    hearts: typeof data.hearts === 'number' ? data.hearts : hearts,
    lastFed: data.lastFed ? Date.parse(data.lastFed) : undefined
  }
  const db = loadDB(); db[user] = pet; saveDB(db)
  return pet
}

export async function getPetRemote(user: string, signal?: AbortSignal): Promise<PetState> {
  if (!user) return getPet(user)
  try {
    const data = await fetchPet(user)
    const petSize = (typeof data.size === 'number') ? data.size : 1
    const petHearts = (typeof data.hearts === 'number') ? data.hearts : 0
    const lastFedMs = data.lastFed ? Date.parse(data.lastFed) : undefined
    const pet: PetState = { user, size: petSize, hearts: petHearts, lastFed: lastFedMs }
    const db = loadDB(); db[user] = pet; saveDB(db)
    return pet
  } catch (e) {
    if ((e as any)?.name === 'AbortError') throw e
    console.warn('getPetRemote fallo, usando cache local:', e)
    return getPet(user)
  }
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
