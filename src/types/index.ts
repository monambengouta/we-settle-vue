export interface Inscription {
  id: string
  user_id: string
  name: string
  lastname: string
  email: string
  validated: boolean
  bearer_token: string | null
  validation_date: string | null
}

export interface User {
  user_id: string
  email: string
  firstName: string
  lastName: string
  password: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthState {
  user: User | null
  token: string | null
}
