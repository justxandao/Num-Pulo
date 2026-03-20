import { Server } from 'socket.io'
import { FastifyInstance } from 'fastify'
import { createAdapter } from '@socket.io/redis-adapter'
import Redis from 'ioredis'

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

  public async setup(fastify: FastifyInstance) {
    this.io = new Server(fastify.server, {
      cors: {
        origin: '*', // Ajustar em produção
        methods: ['GET', 'POST']
      }
    })

    // Configuração do Adaptador Redis para Escalabilidade Horizontal
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379'
    const pubClient = new Redis(redisUrl)
    const subClient = pubClient.duplicate()

    this.io.adapter(createAdapter(pubClient, subClient))

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
      const { userId, role } = socket.data
      
      // Entra na sala privada do usuário para notificações diretas
      socket.join(`user:${userId}`)

      // Entra na sala de entregadores se tiver a role
      if (role === 'COURIER' || role === 'ADMIN') {
        socket.join('couriers')
      }
      
      console.log(`Socket conectado: ${socket.id} (Usuário: ${userId}, Role: ${role})`)

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
