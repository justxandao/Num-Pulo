import { FastifyRequest, FastifyReply } from 'fastify'
import { OrderService } from './order.service'

export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      // Idealmente, usaríamos TypeBox ou Zod no Fastify schema para validar a request.
      const data = request.body as any
      
      const order = await this.orderService.createCheckout(data)
      return reply.code(201).send({ success: true, order })
    } catch (error: any) {
      return reply.code(400).send({ success: false, message: error.message })
    }
  }

  async accept(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const { id } = request.params
      // Extrair o ID do lojista autenticado (request.user.sub) preenchido via middleware JWT
      const mockStoreOwnerId = 'mock-loja-123' 
      
      const order = await this.orderService.acceptOrder(id, mockStoreOwnerId)
      return reply.send({ success: true, order })
    } catch (error: any) {
      return reply.code(400).send({ success: false, message: error.message })
    }
  }
}
