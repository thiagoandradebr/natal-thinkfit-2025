/**
 * Utilitários para persistência de dados no navegador
 * Suporta localStorage, sessionStorage e cookies
 */

// Chaves de storage
export const STORAGE_KEYS = {
  CART: 'thinkfit-cart',
  CHECKOUT_FORM: 'thinkfit-checkout-form',
  LAST_SECTION: 'thinkfit-last-section',
  USER_PREFERENCES: 'thinkfit-user-preferences',
} as const

// ===== LOCALSTORAGE =====
export const storage = {
  // Salvar no localStorage
  set: (key: string, value: any): void => {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(`Erro ao salvar no localStorage (${key}):`, error)
    }
  },

  // Ler do localStorage
  get: <T = any>(key: string, defaultValue: T | null = null): T | null => {
    if (typeof window === 'undefined') return defaultValue
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.error(`Erro ao ler do localStorage (${key}):`, error)
      return defaultValue
    }
  },

  // Remover do localStorage
  remove: (key: string): void => {
    if (typeof window === 'undefined') return
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error(`Erro ao remover do localStorage (${key}):`, error)
    }
  },

  // Limpar tudo
  clear: (): void => {
    if (typeof window === 'undefined') return
    try {
      localStorage.clear()
    } catch (error) {
      console.error('Erro ao limpar localStorage:', error)
    }
  },
}

// ===== SESSIONSTORAGE =====
export const session = {
  // Salvar no sessionStorage
  set: (key: string, value: any): void => {
    if (typeof window === 'undefined') return
    try {
      sessionStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(`Erro ao salvar no sessionStorage (${key}):`, error)
    }
  },

  // Ler do sessionStorage
  get: <T = any>(key: string, defaultValue: T | null = null): T | null => {
    if (typeof window === 'undefined') return defaultValue
    try {
      const item = sessionStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.error(`Erro ao ler do sessionStorage (${key}):`, error)
      return defaultValue
    }
  },

  // Remover do sessionStorage
  remove: (key: string): void => {
    if (typeof window === 'undefined') return
    try {
      sessionStorage.removeItem(key)
    } catch (error) {
      console.error(`Erro ao remover do sessionStorage (${key}):`, error)
    }
  },
}

// ===== COOKIES =====
export const cookies = {
  // Salvar cookie
  set: (name: string, value: string, days: number = 30): void => {
    if (typeof document === 'undefined') return
    try {
      const date = new Date()
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
      const expires = `expires=${date.toUTCString()}`
      document.cookie = `${name}=${value};${expires};path=/;SameSite=Lax`
    } catch (error) {
      console.error(`Erro ao salvar cookie (${name}):`, error)
    }
  },

  // Ler cookie
  get: (name: string): string | null => {
    if (typeof document === 'undefined') return null
    try {
      const nameEQ = `${name}=`
      const ca = document.cookie.split(';')
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i]
        while (c.charAt(0) === ' ') c = c.substring(1, c.length)
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
      }
      return null
    } catch (error) {
      console.error(`Erro ao ler cookie (${name}):`, error)
      return null
    }
  },

  // Remover cookie
  remove: (name: string): void => {
    if (typeof document === 'undefined') return
    try {
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`
    } catch (error) {
      console.error(`Erro ao remover cookie (${name}):`, error)
    }
  },
}

// ===== HELPERS ESPECÍFICOS =====

// Salvar dados do formulário de checkout
export const saveCheckoutForm = (formData: any): void => {
  storage.set(STORAGE_KEYS.CHECKOUT_FORM, formData)
}

// Recuperar dados do formulário de checkout
export const getCheckoutForm = (): any | null => {
  return storage.get(STORAGE_KEYS.CHECKOUT_FORM)
}

// Limpar dados do formulário de checkout
export const clearCheckoutForm = (): void => {
  storage.remove(STORAGE_KEYS.CHECKOUT_FORM)
}

// Salvar última seção visitada
export const saveLastSection = (section: string): void => {
  storage.set(STORAGE_KEYS.LAST_SECTION, section)
}

// Recuperar última seção visitada
export const getLastSection = (): string | null => {
  return storage.get<string>(STORAGE_KEYS.LAST_SECTION)
}

// Salvar preferências do usuário
export const saveUserPreferences = (preferences: {
  theme?: string
  language?: string
  [key: string]: any
}): void => {
  storage.set(STORAGE_KEYS.USER_PREFERENCES, preferences)
}

// Recuperar preferências do usuário
export const getUserPreferences = (): any | null => {
  return storage.get(STORAGE_KEYS.USER_PREFERENCES)
}

