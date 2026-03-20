import { Server } from 'socket.io'
import { FastifyInstance } from 'fastify'
import { UserRole } from '@num-pulo/database'

export class SocketService {
  private static instance: SocketService
  private io?: Server

  private constructor() {}

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService()
    }
    return SocketService.instance
  }

  public setup(fastify: FastifyInstance) {
    this.io = new Server(fastify.server, {
      cors: {
        origin: '*', // Ajustar em produção
        methods: ['GET', 'POST']
      }
    })

    // Middleware de Autenticação JWT
    this.io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token || socket.handshake.headers['authorization']?.split(' ')[1]
        
        if (!token) {
          return next(new Error('Autenticação necessária'))
        }

        // Usamos o plugin JWT do Fastify para verificar
        const decoded = await fastify.jwt.verify(token) as { sub: string, role: string }
        
        // Atacha dados do usuário ao socket
        socket.data.userId = decoded.sub
        socket.data.role = decoded.role
        
        next()
      } catch (err) {
        next(new Error('Token inválido'))
      }
    })

    this.io.on('connection', (socket) => {
      const { userId } = socket.data
      
      // Entra na sala privada do usuário para notificações diretas
      socket.join(`user:${userId}`)
      
      console.log(`Socket conectado: ${socket.id} (Usuário: ${userId})`)

      socket.on('disconnect', () => {
        console.log(`Socket desconectado: ${socket.id}`)
      })
    })
  }

  public emitToUser(userId: string, event: string, data: any) {
    if (!this.io) return
    this.io.to(`user:${userId}`).emit(event, data)
  }

  public emitToRoom(roomName: string, event: string, data: any) {
    if (!this.io) return
    this.io.to(roomName).emit(event, data)
  }
}

export const socketService = SocketService.getInstance()
