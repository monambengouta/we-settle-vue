import axios, { type AxiosInstance } from 'axios'
import type { Inscription } from '@/types'

export const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// Add a request interceptor to include the token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const useApi = () => {
  const getInscriptions = async (): Promise<Inscription[]> => {
    try {
      const { data } = await api.get('/inscriptions/all')

      if (data.statusCode !== 200) {
        throw new Error(data.message || 'Failed to fetch inscriptions')
      }

      return data.responseObject
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data?.message || 'Failed to fetch inscriptions'
      }
      throw new Error('Failed to fetch inscriptions')
    }
  }

  const validateInscription = async (subId: string): Promise<Inscription> => {
    try {
      const response = await api.post(`/inscriptions/validate/${subId}`)

      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data?.message || 'Validation failed'
      }
      throw new Error('Validation failed')
    }
  }

  const generateToken = async (subId: string): Promise<{ message: string }> => {
    try {
      const response = await api.post(`/inscriptions/g-token/${subId}`)
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data?.message || 'Token generation failed'
      }
      throw new Error('Token generation failed')
    }
  }

  return {
    getInscriptions,
    validateInscription,
    generateToken,
  }
}
