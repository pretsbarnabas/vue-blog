// stores/auth.ts
import { defineStore } from 'pinia'
import { reactive, computed, toRefs } from 'vue'
import api from "@/main"
import type {
  LoginCredentials,
  RegisterCredentials,
  AuthResponse,
  AuthState,
} from '@/types/auth'

export const useAuthStore = defineStore('auth', () => {
  const state = reactive<AuthState>({
    user: null,
    token: null,
    isAuthenticated: computed(() => !!state.token),
    loading: false,
    error: null
  })

  const setToken = (newToken: string | null) => {
    state.token = newToken
    if (newToken) {
      localStorage.setItem('token', newToken)
      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
    } else {
      localStorage.removeItem('token')
      delete api.defaults.headers.common['Authorization']
    }
  }

  const initializeAuth = () => {
    const savedToken = localStorage.getItem('token')
    if (savedToken) setToken(savedToken)
  }

  const authAction = async <T>(
    url: string,
    credentials: T,
    successMessage: string
  ) => {
    state.loading = true
    state.error = null
    
    try {
      const { data } = await api.post<AuthResponse>(url, credentials)
      setToken(data.token)
      state.user = data.user
      
      return { 
        success: true, 
        message: successMessage,
        user: data.user
      }
    } catch (error: any) {
      state.error = {
        message: error.response?.data?.message || 'Authentication failed',
        fields: error.response?.data?.errors
      }
      return { success: false }
    } finally {
      state.loading = false
    }
  }

  const updateProfile = async (updateData: { name: string; email: string }) => {
    state.loading = true
    state.error = null
    
    try {
      const userId = state.user?.id
      if (!userId) throw new Error('User not authenticated')
  
      console.log('Sending profile update:', {
        id: userId, 
        name: updateData.name,
        email: updateData.email
      })
  
      const { data } = await api.put('/profile/update', {
        id: userId, 
        name: updateData.name,
        email: updateData.email
      })
  
      if (state.user) {
        state.user.name = data.user.name
        state.user.email = data.user.email
      }
  
      return { 
        success: true,
        user: data.user,
        message: 'Profile updated successfully'
      }
    } catch (error: any) {
      console.error('Profile update error:', error.response?.data)
      state.error = {
        message: error.response?.data?.message || 'Profile update failed',
        fields: error.response?.data?.errors
      }
      return { success: false }
    } finally {
      state.loading = false
    }
  }
  const changePassword = async (passwords: { 
    currentPassword: string; 
    newPassword: string 
  }) => {
    state.loading = true
    state.error = null
    
    try {
      const userId = state.user?.id
      if (!userId) throw new Error('User not authenticated')
      console.log('Password change payload:', {
        id: userId,
        currentPassword: '***', 
        newPassword: '***'
      })

      const { data } = await api.put('/profile/change-password', {
        id: userId,
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      })

      return { 
        success: true,
        message: 'Password changed successfully'
      }
    } catch (error: any) {
      console.error('Password change error:', error.response?.data)
      state.error = {
        message: error.response?.data?.message || 'Password change failed',
        fields: error.response?.data?.errors
      }
      return { 
        success: false,
        error: error.response?.data 
      }
    } finally {
      state.loading = false
    }
  }

  return {
    ...toRefs(state),
    initializeAuth,
    login: (credentials: LoginCredentials) => 
      authAction('/login', credentials, 'Successfully logged in'),
    register: (credentials: RegisterCredentials) => 
      authAction('/register', credentials, 'Registration successful'),
    logout: () => {
      state.user = null
      setToken(null)
    },
    updateProfile,
    changePassword
  }
})