import { FastifyRequest, FastifyReply } from 'fastify'
import { OrderService } from './order.service'

export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { storeId, items } = request.body as { storeId: string; items: any[] }
      const { sub: customerId } = request.user
      
      const order = await this.orderService.createCheckout(customerId, storeId, items)
      return reply.code(201).send({ success: true, order })
    } catch (error: any) {
      return reply.code(400).send({ success: false, message: error.message })
    }
  }

  async listMyOrders(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { sub: customerId } = request.user
      const orders = await this.orderService.listCustomerOrders(customerId)
      return reply.send({ success: true, orders })
    } catch (error: any) {
      return reply.code(400).send({ success: false, message: error.message })
    }
  }

  async accept(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string }
      const { sub: storeOwnerId } = request.user
      
      const order = await this.orderService.acceptOrder(id, storeOwnerId)
      return reply.send({ success: true, order })
    } catch (error: any) {
      return reply.code(400).send({ success: false, message: error.message })
    }
  }

  async updateStatus(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string }
      const { status } = request.body as { status: string }
      const order = await this.orderService.updateStatus(id, status)
      return reply.send({ success: true, order })
    } catch (error: any) {
      return reply.code(400).send({ success: false, message: error.message })
    }
  }

  async listByStore(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { storeId } = request.params as { storeId: string }
      const orders = await this.orderService.listStoreOrders(storeId)
      return reply.send({ success: true, orders })
    } catch (error: any) {
      return reply.code(400).send({ success: false, message: error.message })
    }
  }
}
