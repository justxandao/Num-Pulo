import { FastifyRequest, FastifyReply } from 'fastify'
import { OrderService } from './order.service'
import { CreateOrderInput, UpdateOrderStatusInput } from './order.schema'

export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  async create(request: FastifyRequest<{ Body: CreateOrderInput }>, reply: FastifyReply) {
    try {
      const { storeId, items } = request.body
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

  async updateStatus(request: FastifyRequest<{ Body: UpdateOrderStatusInput; Params: { id: string } }>, reply: FastifyReply) {
    try {
      const { id } = request.params
      const { status } = request.body
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

  async listAvailable(request: FastifyRequest, reply: FastifyReply) {
    try {
      const orders = await this.orderService.listAvailableOrders()
      return reply.send({ success: true, orders })
    } catch (error: any) {
      return reply.code(400).send({ success: false, message: error.message })
    }
  }

  async pickUp(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string }
      const { sub: courierId } = request.user
      
      const order = await this.orderService.acceptOrderForDelivery(id, courierId)
      return reply.send({ success: true, order })
    } catch (error: any) {
      return reply.code(400).send({ success: false, message: error.message })
    }
  }

  async listMyDeliveries(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { sub: courierId } = request.user
      const orders = await this.orderService.listCourierOrders(courierId)
      return reply.send({ success: true, orders })
    } catch (error: any) {
      return reply.code(400).send({ success: false, message: error.message })
    }
  }
}
