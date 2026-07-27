const SESSION_KEY = 'alliance_auth_user'

export function getStoredUser() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function storeUser(user) {
  if (user) {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || null
    }))
  } else {
    sessionStorage.removeItem(SESSION_KEY)
  }
}