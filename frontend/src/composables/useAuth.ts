import { computed, reactive } from 'vue'

interface UserSession {
  username: string
  nombre: string
  role: 'admin' | 'viewer'
}

const state = reactive({
  user: null as UserSession | null,
  token: '' as string,
  error: '',
  loading: false,
  initialized: false
})

const STORAGE_KEY = 'inventario-auth'

const persistSession = () => {
  if (state.user && state.token) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: state.user, token: state.token }))
  } else {
    localStorage.removeItem(STORAGE_KEY)
  }
}

const clearSession = () => {
  state.user = null
  state.token = ''
  persistSession()
  window.dispatchEvent(new CustomEvent('session-updated'))
}

const restoreSession = () => {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) return
  try {
    const parsed = JSON.parse(stored)
    state.user = parsed.user
    state.token = parsed.token
  } catch (err) {
    console.warn('No se pudo restaurar la sesión', err)
  }
}

const performLogout = () => {
  if (state.token) {
    fetch('http://localhost:3000/auth/logout', {
      method: 'POST',
      headers: { Authorization: `Bearer ${state.token}` }
    }).catch(() => {})
  }
  clearSession()
}

const verifySession = async () => {
  if (!state.token) return
  try {
    const res = await fetch('http://localhost:3000/auth/me', {
      headers: { Authorization: `Bearer ${state.token}` }
    })
    if (!res.ok) {
      performLogout()
      return
    }
    const data = await res.json()
    state.user = data.user
    persistSession()
  } catch (err) {
    console.error('Error al verificar la sesión', err)
    performLogout()
  }
}

export const useAuth = () => {
  const login = async (username: string, password: string) => {
    state.loading = true
    state.error = ''
    try {
      const res = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.message || 'No se pudo iniciar sesión')
      }

      const data = await res.json()
      state.user = data.user
      state.token = data.token
      persistSession()
      window.dispatchEvent(new CustomEvent('session-updated'))
    } catch (err: any) {
      state.error = err.message || 'Error al iniciar sesión'
      throw err
    } finally {
      state.loading = false
    }
  }

  const initialize = async () => {
    if (state.initialized) return
    restoreSession()
    await verifySession()
    state.initialized = true
  }

  return {
    user: computed(() => state.user),
    token: computed(() => state.token),
    error: computed(() => state.error),
    loading: computed(() => state.loading),
    isAdmin: computed(() => state.user?.role === 'admin'),
    login,
    logout: performLogout,
    initialize
  }
}
