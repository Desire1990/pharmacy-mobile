// stores/user.js
import { defineStore } from 'pinia'
import apiClient from '@/api/axios'

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [],
    loading: false,
    totalCount: 0,
    error: null,
  }),
  actions: {
    async fetchUsers(params = {}) {
      this.loading = true
      this.error = null
      try {
        const { data } = await apiClient.get('/auth/users/', { params })
        // Djoser returns paginated response: { results, count }
        this.users = data.results || data
        this.totalCount = data.count || this.users.length
      } catch (err) {
        this.error = err.response?.data?.detail || 'Failed to load users'
        console.error(err)
      } finally {
        this.loading = false
      }
    },
    async createUser(userData) {
      await apiClient.post('/auth/users/', userData)
      await this.fetchUsers({ page: 1 })
    },
    async updateUser(id, data) {
      await apiClient.put(`/auth/users/${id}/`, data)
      await this.fetchUsers({ page: 1 })  // you might want to keep current page, adjust accordingly
    },
    async deleteUser(id) {
      await apiClient.delete(`/auth/users/${id}/`)
      await this.fetchUsers({ page: 1 })  // refresh
    },
  },
})