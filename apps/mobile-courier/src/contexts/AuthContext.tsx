import React, { createContext, useContext, useState, useEffect } from 'react'
import * as SecureStore from 'expo-secure-store'
import api from '../services/api'

interface User {
  id: string
  name: string
  email: string
  role: 'ADMIN' | 'COURIER' | 'MERCHANT' | 'CUSTOMER'
}

interface AuthContextData {
  user: User | null
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  loading: boolean
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStorageData() {
      const storagedUser = await SecureStore.getItemAsync('num-pulo:courier:user')
      const storagedToken = await SecureStore.getItemAsync('num-pulo:courier:token')

      if (storagedUser && storagedToken) {
        setUser(JSON.parse(storagedUser))
      }
      setLoading(false)
    }

    loadStorageData()
  }, [])

  const signIn = async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password })
    const { user: userData, token } = response.data

    if (userData.role !== 'COURIER' && userData.role !== 'ADMIN') {
      throw new Error('Acesso permitido apenas para entregadores.')
    }

    setUser(userData)
    await SecureStore.setItemAsync('num-pulo:courier:token', token)
    await SecureStore.setItemAsync('num-pulo:courier:user', JSON.stringify(userData))
  }

  const signOut = async () => {
    await SecureStore.deleteItemAsync('num-pulo:courier:token')
    await SecureStore.deleteItemAsync('num-pulo:courier:user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
