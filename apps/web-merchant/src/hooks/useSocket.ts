import { useEffect, useCallback } from 'react'
import { io, Socket } from 'socket.io-client'
import { useAuth } from '../contexts/AuthContext'

let socket: Socket

export const useSocket = () => {
  const { user } = useAuth()

  useEffect(() => {
    if (!user) return

    const token = localStorage.getItem('@num-pulo:token')
    
    socket = io('http://localhost:3000', {
      auth: { token }
    })

    socket.on('connect', () => {
      console.log('Socket conectado ao servidor')
    })

    return () => {
      socket.disconnect()
    }
  }, [user])

  const onEvent = useCallback((event: string, callback: (data: any) => void) => {
    if (!socket) return
    socket.on(event, callback)
    
    return () => {
      socket.off(event, callback)
    }
  }, [])

  return { onEvent }
}
