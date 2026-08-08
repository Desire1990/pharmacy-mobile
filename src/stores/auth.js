import { defineStore } from 'pinia'
import { login as apiLogin, getUser, refreshToken } from '@/api/auth'
import router from '@/router'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null,
    refresh: null,
    user: null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.user?.role === 'admin',
  },
  actions: {
    async login(credentials) {
      const { data } = await apiLogin(credentials)
      this.token = data.access
      this.refresh = data.refresh
      const userRes = await getUser()
      this.user = userRes.data
      router.push('/')
    },
    logout() {
      this.token = null
      this.refresh = null
      this.user = null
      router.push('/login')
    },
    async fetchUser() {
      try {
        const { data } = await getUser()
        this.user = data
      } catch {
        this.logout()
      }
    },
  },
  persist: true, // uses localStorage
})