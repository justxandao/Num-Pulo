import { FastifyInstance } from 'fastify'
import { OrderController } from './order.controller'
import { OrderService } from './order.service'
import { OrderRepository } from './order.repository'
import { ProductRepository } from '../products/product.repository'
import { StoreRepository } from '../stores/store.repository'
import { requireAuth } from '../../shared/middlewares/require-auth'

export async function orderRoutes(server: FastifyInstance) {
  const orderRepository = new OrderRepository()
  const productRepository = new ProductRepository()
  const storeRepository = new StoreRepository()
  const orderService = new OrderService(orderRepository, productRepository, storeRepository)
  const controller = new OrderController(orderService)

  server.post('/', { preHandler: [requireAuth] }, controller.create.bind(controller))
  server.get('/my', { preHandler: [requireAuth] }, controller.listMyOrders.bind(controller))
  server.get('/store/:storeId', { preHandler: [requireAuth] }, controller.listByStore.bind(controller))
  server.patch('/:id/status', { preHandler: [requireAuth] }, controller.updateStatus.bind(controller))
  server.patch('/:id/accept', { preHandler: [requireAuth] }, controller.accept.bind(controller))
}
