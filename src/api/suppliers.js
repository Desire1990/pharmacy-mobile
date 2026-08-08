import apiClient from './axios'

export const getSuppliers = (params) => apiClient.get('/suppliers/', { params })
export const createSupplier = (data) => apiClient.post('/suppliers/', data)
export const updateSupplier = (id, data) => apiClient.put(`/suppliers/${id}/`, data)
export const deleteSupplier = (id) => apiClient.delete(`/suppliers/${id}/`)