import { FastifyInstance } from 'fastify'
import { StoreRepository } from './store.repository'
import { StoreService } from './store.service'
import { StoreController } from './store.controller'
import { authorize } from '../../shared/middlewares/authorize'
import { requireAuth } from '../../shared/middlewares/require-auth'

export async function storeRoutes(server: FastifyInstance) {
  const repository = new StoreRepository()
  const service = new StoreService(repository)
  const controller = new StoreController(service)

  server.post('/', { preHandler: [authorize(['MERCHANT', 'ADMIN'])] }, controller.create.bind(controller))
  server.get('/my', { preHandler: [requireAuth] }, controller.list.bind(controller))
  server.get('/', controller.listAll.bind(controller))
  server.patch('/:id', { preHandler: [authorize(['MERCHANT', 'ADMIN'])] }, controller.update.bind(controller))
}
