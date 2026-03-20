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
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const storagedUser = localStorage.getItem('num-pulo:admin:user')
      const storagedToken = localStorage.getItem('num-pulo:admin:token')

      if (storagedUser && storagedToken) {
        setUser(JSON.parse(storagedUser))
      }
    } catch (err) {
      console.error('Falha ao restaurar sessão:', err)
      localStorage.removeItem('num-pulo:admin:token')
      localStorage.removeItem('num-pulo:admin:user')
    } finally {
      setLoading(false)
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password })
    const { user: userData, token } = response.data

    if (userData.role !== 'ADMIN') {
      throw new Error('Acesso negado: Apenas administradores podem acessar este painel.')
    }

    setUser(userData)
    localStorage.setItem('num-pulo:admin:token', token)
    localStorage.setItem('num-pulo:admin:user', JSON.stringify(userData))
  }

  const signOut = () => {
    localStorage.removeItem('num-pulo:admin:token')
    localStorage.removeItem('num-pulo:admin:user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
