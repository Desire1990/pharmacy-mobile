import { defineStore } from 'pinia'
import * as api from '@/api/medicines'

export const useMedicineStore = defineStore('medicine', {
  state: () => ({
    medicines: [],
    loading: false,
    error: null,
    totalCount: 0,
  }),

  actions: {
    async fetchMedicines(params = {}) {
      this.loading = true
      try {
        const { data } = await api.getMedicines(params)
        this.medicines = data.results || data
        this.totalCount = data.count || this.medicines.length
      } catch (err) {
        this.error = err.response?.data?.detail || 'Failed to load medicines'
        throw err
      } finally {
        this.loading = false
      }
    },

    async createMedicine(medicine) {
      await api.createMedicine(medicine)
      await this.fetchMedicines()
    },

    async updateMedicine(id, data) {
      await api.updateMedicine(id, data)
      await this.fetchMedicines()
    },

    async deleteMedicine(id) {
      await api.deleteMedicine(id)
      await this.fetchMedicines()
    },
  },
})