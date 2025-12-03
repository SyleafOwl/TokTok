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

/**
 * getPetRemote: intenta obtener la mascota desde /api/pets/:id.
 * - Si existe, mapea la respuesta a PetState y la guarda en localStorage.
 * - Si 404, intenta crearla vía POST /api/pets.
 * - Si falla, cae al getPet(local).
 */
export async function getPetRemote(user: string, signal?: AbortSignal): Promise<PetState> {
  if (!user) return getPet(user)
  try {
    const url = `/api/pets/${encodeURIComponent(user)}`
    const res = await fetch(url, { signal })
    if (res.status === 404) {
      const createRes = await fetch('/api/pets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ size: 1, hearts: 0, userId: user }),
        signal
      })
      if (!createRes.ok) throw new Error('No se pudo crear mascota en servidor')
      const created = await createRes.json()
      const pet: PetState = { user: user, size: created.size ?? 1, hearts: created.hearts ?? 0, lastFed: created.lastFed ?? undefined }
      const db = loadDB(); db[user] = pet; saveDB(db)
      return pet
    }
    if (!res.ok) throw new Error('Error al obtener mascota')
    const data = await res.json()
    const petSize = (typeof data.size === 'number') ? data.size : (data.pet?.size ?? 1)
    const petHearts = (typeof data.hearts === 'number') ? data.hearts : (data.pet?.hearts ?? 0)
    const lastFed = data.lastFed ?? data.pet?.lastFed
    const pet: PetState = { user, size: petSize, hearts: petHearts, lastFed }
    const db = loadDB(); db[user] = pet; saveDB(db)
    return pet
  } catch (e) {
    if ((e as any)?.name === 'AbortError') {
      // request was cancelled — rethrow or return cached
      throw e
    }
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
