import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import router from '@/router'


const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api/',   // replace with your IP
  headers: { 'Content-Type': 'application/json' },
})

// Request interceptor – attach token
apiClient.interceptors.request.use(config => {
  const auth = useAuthStore()
  if (auth.token) {
    config.headers.Authorization = `Bearer ${auth.token}`
  }
  return config
})

// Response interceptor – handle 401
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      const auth = useAuthStore()
      auth.logout()
      router.push('/login')
    }
    return Promise.reject(error)
  }
)

export default apiClient