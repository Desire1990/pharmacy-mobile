import apiClient from './axios'

export const getDashboard = () => apiClient.get('/dashboard/')