import { ComputedRef } from "vue"

export interface User {
  id: number
  name: string
  email: string
  avatar?: string 
  role?: 'user' | 'admin'
}

export interface LoginCredentials {
  email: string
  password: string
  remember?: boolean  
}

export interface RegisterCredentials extends LoginCredentials {
  name: string
  termsAccepted?: boolean 
}

export interface AuthResponse {
  token: string
  user: User
  expiresIn?: number  
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean | ComputedRef<boolean> 
  loading: boolean
  error: AuthError | null
}

export interface AuthError {
  message: string
  code?: string  
  fields?: Record<string, string>  
}

export interface AuthForm {
  valid: boolean
  showPassword: boolean  
  errors: string[]
}