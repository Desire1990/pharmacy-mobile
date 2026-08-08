import { defineStore } from 'pinia'
import * as api from '@/api/purchases'

export const usePurchaseStore = defineStore('purchase', {
  state: () => ({
    purchases: [],
    loading: false,
    totalCount: 0,
  }),

  actions: {
    async fetchPurchases(params = {}) {
      this.loading = true
      try {
        const { data } = await api.getPurchases(params)
        this.purchases = data.results || data
        this.totalCount = data.count || this.purchases.length
      } catch (err) {
        console.error('Error fetching purchases:', err)
      } finally {
        this.loading = false
      }
    },

    async createPurchase(purchaseData) {
      await api.createPurchase(purchaseData)
      await this.fetchPurchases()
    },
  },
})