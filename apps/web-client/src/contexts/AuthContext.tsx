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
  token: string | null
  signIn(credentials: any): Promise<void>
  signOut(): void
  loading: boolean
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedToken = localStorage.getItem('@NumPulo:token')
    const storedUser = localStorage.getItem('@NumPulo:user')

    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const signIn = async (credentials: any) => {
    const response = await api.post('/auth/login', credentials)
    const { user, token } = response.data

    localStorage.setItem('@NumPulo:token', token)
    localStorage.setItem('@NumPulo:user', JSON.stringify(user))

    setToken(token)
    setUser(user)
  }

  const signOut = () => {
    localStorage.removeItem('@NumPulo:token')
    localStorage.removeItem('@NumPulo:user')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, signIn, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
