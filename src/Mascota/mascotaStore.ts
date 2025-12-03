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
  if (!db[user]) db[user] = { user, size: 0, hearts: 0 } // inicializar en 0
  return db[user]
}

/**
 * createPetRemote: crea una mascota en /api/pets y guarda en cache local.
 * Nota: el endpoint verifica size, hearts y userId; enviamos hearts=1 por defecto
 * porque el endpoint actual rechaza valores falsy (0).
 */
export async function createPetRemote(user: string, size = 1, hearts = 1, signal?: AbortSignal): Promise<PetState> {
  if (!user) throw new Error('no-user')
  const res = await fetch('/api/pets', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ size, hearts, userId: user }),
    signal
  })
  if (!res.ok) {
    // intentar obtener texto/JSON para diagnóstico más claro
    const text = await res.text().catch(() => '')
    let msg = text
    try { msg = JSON.parse(text)?.error ?? text } catch {}
    throw new Error(msg || `Error creando mascota: ${res.status}`)
  }
  const data = await res.json()
  const pet: PetState = {
    user,
    size: typeof data.size === 'number' ? data.size : size,
    hearts: typeof data.hearts === 'number' ? data.hearts : hearts,
    lastFed: data.lastFed ?? undefined
  }
  const db = loadDB(); db[user] = pet; saveDB(db)
  return pet
}

export async function getPetRemote(user: string, signal?: AbortSignal): Promise<PetState> {
  if (!user) return getPet(user)
  try {
    const url = `/api/pets/${encodeURIComponent(user)}`
    const res = await fetch(url, { signal })
    if (res.status === 404) {
      const created = await createPetRemote(user, 1, 1, signal)
      return created
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
