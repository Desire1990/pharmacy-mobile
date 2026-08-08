import apiClient from './axios'

export const getSales = (params) => apiClient.get('/sales/', { params })
export const createSale = (saleData) => apiClient.post('/sales/', saleData)