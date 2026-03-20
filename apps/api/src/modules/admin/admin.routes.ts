import { FastifyInstance } from 'fastify'
import { AdminController } from './admin.controller'
import { StoreService } from '../stores/store.service'
import { StoreRepository } from '../stores/store.repository'
import { UserService } from '../users/user.service'
import { UserRepository } from '../users/user.repository'
import { requireAuth } from '../../shared/middlewares/require-auth'
import { requireAdmin } from '../../shared/middlewares/require-admin'

export async function adminRoutes(fastify: FastifyInstance) {
  const storeRepository = new StoreRepository()
  const storeService = new StoreService(storeRepository)
  
  const userRepository = new UserRepository()
  const userService = new UserService(userRepository)
  
  const controller = new AdminController(storeService, userService)

  fastify.addHook('preHandler', requireAuth)
  fastify.addHook('preHandler', requireAdmin)

  fastify.get('/stores', controller.listStores.bind(controller))
  fastify.patch('/stores/:id/status', controller.updateStoreStatus.bind(controller))
  fastify.get('/users', controller.listUsers.bind(controller))
}
