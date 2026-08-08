import apiClient from './axios'

export const getMedicines = (params) => apiClient.get('/medicines/', { params })
export const getMedicine = (id) => apiClient.get(`/medicines/${id}/`)
export const createMedicine = (data) => apiClient.post('/medicines/', data)
export const updateMedicine = (id, data) => apiClient.put(`/medicines/${id}/`, data)
export const deleteMedicine = (id) => apiClient.delete(`/medicines/${id}/`)
export const bulkCreateMedicines = (data) => apiClient.post('/medicines/bulk/', data)