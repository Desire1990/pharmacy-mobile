import { defineStore } from 'pinia'
import * as api from '@/api/suppliers'

export const useSupplierStore = defineStore('supplier', {
  state: () => ({
    suppliers: [],
    loading: false,
    totalCount: 0,
  }),

  actions: {
    async fetchSuppliers(params = {}) {
      this.loading = true
      try {
        const { data } = await api.getSuppliers(params)
        this.suppliers = data.results || data
        this.totalCount = data.count || this.suppliers.length
      } catch (err) {
        console.error('Error fetching suppliers:', err)
      } finally {
        this.loading = false
      }
    },

    async createSupplier(supplierData) {
      await api.createSupplier(supplierData)
      await this.fetchSuppliers()
    },

    async updateSupplier(id, data) {
      await api.updateSupplier(id, data)
      await this.fetchSuppliers()
    },

    async deleteSupplier(id) {
      await api.deleteSupplier(id)
      await this.fetchSuppliers()
    },
  },
})