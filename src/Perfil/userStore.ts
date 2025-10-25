export type UserRole = 'viewer' | 'streamer'

export type UserProfile = {
  username: string
  contact?: string
  role: UserRole
}

const KEY = 'toktok_user_v1'

export function saveUserProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(profile))
  } catch {}
}

export function getUserProfile(): UserProfile | null {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as UserProfile) : null
  } catch {
    return null
  }
}

export function clearUserProfile(): void {
  try {
    localStorage.removeItem(KEY)
  } catch {}
}
