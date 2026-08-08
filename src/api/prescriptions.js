import apiClient from './axios'

export const getPrescriptions = (params) => apiClient.get('/prescriptions/', { params })
export const createPrescription = (formData) =>
  apiClient.post('/prescriptions/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
export const verifyPrescription = (id) => apiClient.post(`/prescriptions/${id}/verify/`)