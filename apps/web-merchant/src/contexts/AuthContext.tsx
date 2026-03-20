import React, { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

interface User {
  id: string
  name: string
  email: string
  role: string
}

interface AuthContextData {
  user: User | null
  signIn(credentials: any): Promise<void>
  signOut(): void
  loading: boolean
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedToken = localStorage.getItem('@num-pulo:token')
    const storedUser = localStorage.getItem('@num-pulo:user')

    if (storedToken && storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const signIn = async ({ email, password }: any) => {
    const response = await api.post('/auth/login', { email, password })
    const { user, token } = response.data

    localStorage.setItem('@num-pulo:token', token)
    localStorage.setItem('@num-pulo:user', JSON.stringify(user))

    setUser(user)
  }

  const signOut = () => {
    localStorage.removeItem('@num-pulo:token')
    localStorage.removeItem('@num-pulo:user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
