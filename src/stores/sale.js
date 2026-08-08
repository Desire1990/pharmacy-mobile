import { defineStore } from 'pinia'
import * as api from '@/api/sales'
import { useAuthStore } from '@/stores/auth'

export const useSaleStore = defineStore('sale', {
  state: () => ({
    sales: [],
    loading: false,
    totalCount: 0,
  }),

  actions: {
    async fetchSales(params = {}) {
      this.loading = true
      try {
        const auth = useAuthStore()
        // If not admin, only fetch own sales
        if (!auth.isAdmin) {
          params.user = auth.user.id
        }
        const { data } = await api.getSales(params)
        this.sales = data.results || data
        this.totalCount = data.count || this.sales.length
      } catch (err) {
        console.error('Error fetching sales:', err)
      } finally {
        this.loading = false
      }
    },

    async createSale(saleData) {
      const { data } = await api.createSale(saleData)
      return data
    },
  },
})