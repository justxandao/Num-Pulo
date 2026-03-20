import { useEffect, useCallback } from 'react'
import { io, Socket } from 'socket.io-client'

let socket: Socket

export const useSocket = () => {
  useEffect(() => {
    if (!socket) {
      socket = io('http://10.0.2.2:3000')
    }

    return () => {
      // Manter socket aberto durante a sessão do app
    }
  }, [])

  const emit = useCallback((event: string, data: any) => {
    socket.emit(event, data)
  }, [])

  const onEvent = useCallback((event: string, callback: (data: any) => void) => {
    socket.on(event, callback)
    return () => {
      socket.off(event, callback)
    }
  }, [])

  return { emit, onEvent }
}
