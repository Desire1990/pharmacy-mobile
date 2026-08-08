import apiClient from './axios'

export const getPurchases = (params) => apiClient.get('/purchases/', { params })
export const createPurchase = (data) => apiClient.post('/purchases/', data)
export const updatePurchase = (id, data) => apiClient.put(`/purchases/${id}/`, data)
export const deletePurchase = (id) => apiClient.delete(`/purchases/${id}/`)