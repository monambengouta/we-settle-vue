import axios from 'axios'
import router from '@/router'
import type { LoginCredentials, AuthState } from '@/types'
import { api } from '@/utils/axios-backend'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: localStorage.getItem('token') || null,
  }),
  getters: {
    isAuthenticated: (state): boolean => !!state.token,
  },
  actions: {
    async login(credentials: LoginCredentials): Promise<void> {
      try {
        const { data } = await api.post('/users/login', credentials)
        if (!data.success) {
          throw new Error(data.message || 'Login failed')
        }

        const responseObject = data.responseObject
        this.token = responseObject.accessToken
        if (this.token) {
          localStorage.setItem('token', this.token)
        }
        this.user = responseObject

        router.push({ name: 'validation' })
      } catch (error) {
        console.log('🚀 ~ login ~ error:', error)
        if (axios.isAxiosError(error)) {
          throw error.response?.data?.message || 'Login failed'
        }
        throw new Error('Login failed')
      }
    },
    logout(): void {
      this.token = null
      this.user = null
      localStorage.removeItem('token')
      router.push({ name: 'login' })
    },
  },
  persist: true,
})
