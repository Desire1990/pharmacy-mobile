import apiClient from './axios'

export const login = (credentials) => apiClient.post('/auth/jwt/create/', credentials)
export const register = (userData) => apiClient.post('/auth/users/', userData)
export const getUser = () => apiClient.get('/auth/users/me/')
export const refreshToken = (refresh) => apiClient.post('/auth/jwt/refresh/', { refresh })