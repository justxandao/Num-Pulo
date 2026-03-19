import { FastifyInstance } from 'fastify'
import { OrderRepository } from './order.repository'
import { OrderService } from './order.service'
import { OrderController } from './order.controller'

export async function orderRoutes(server: FastifyInstance) {
  // Dependency Injection Setup
  const repository = new OrderRepository()
  const service = new OrderService(repository)
  const controller = new OrderController(service)

  // API Endpoints
  // Em produção, deve haver ganchos (preHandler) de autenticação do Fastify JWT.
  server.post('/', controller.create.bind(controller))
  server.patch('/:id/accept', controller.accept.bind(controller))
}
