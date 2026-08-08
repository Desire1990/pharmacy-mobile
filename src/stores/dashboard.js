import { defineStore } from 'pinia'
import { getDashboard } from '@/api/dashboard'

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    data: null,
    loading: false,
  }),
  actions: {
    async fetch() {
      this.loading = true
      try {
        const { data } = await getDashboard()
        this.data = data
      } finally {
        this.loading = false
      }
    },
  },
})