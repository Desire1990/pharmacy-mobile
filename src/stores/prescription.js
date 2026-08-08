import { defineStore } from 'pinia'
import * as api from '@/api/prescriptions'

export const usePrescriptionStore = defineStore('prescription', {
  state: () => ({
    prescriptions: [],
    loading: false,
    totalCount: 0,
  }),

  actions: {
    async fetchPrescriptions(params = {}) {
      this.loading = true
      try {
        const { data } = await api.getPrescriptions(params)
        this.prescriptions = data.results || data
        this.totalCount = data.count || this.prescriptions.length
      } catch (err) {
        console.error('Error fetching prescriptions:', err)
      } finally {
        this.loading = false
      }
    },

    async createPrescription(formData) {
      await api.createPrescription(formData)
      await this.fetchPrescriptions()
    },

    async verifyPrescription(id) {
      await api.verifyPrescription(id)
      await this.fetchPrescriptions()
    },
  },
})