import type { Regalo } from './RegalosPanel'

const STORAGE_KEY = 'toktok_regalos_v1'

export const REGALOS_BASE: Regalo[] = [
  { id: 'owl', emoji: '🦉', name: 'Búho', cost: 5 },
  { id: 'rose', emoji: '🌹', name: 'Rosa', cost: 10 },
  { id: 'lion', emoji: '🦁', name: 'León', cost: 25 },
  { id: 'confetti', emoji: '🎉', name: 'Confetti', cost: 50 },
  { id: 'mic', emoji: '🎤', name: 'Micrófono', cost: 75 },
  { id: 'gem', emoji: '💎', name: 'Diamante', cost: 100 },
]

export function loadRegalos(): Regalo[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return REGALOS_BASE
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return REGALOS_BASE
    return parsed
  } catch {
    return REGALOS_BASE
  }
}

export function saveRegalos(list: Regalo[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  } catch { /* noop */ }
}

export function addRegalo(item: Regalo): Regalo[] {
  const current = loadRegalos()
  const next = [...current, item]
  saveRegalos(next)
  return next
}
