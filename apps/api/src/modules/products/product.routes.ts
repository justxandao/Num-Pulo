import { FastifyInstance } from 'fastify'
import { ProductController } from './product.controller'
import { ProductService } from './product.service'
import { ProductRepository } from './product.repository'
import { StoreRepository } from '../stores/store.repository'
import { authorize } from '../../shared/middlewares/authorize'
import { CreateProductSchema, UpdateProductSchema } from './product.schema'
import { requireAuth } from '../../shared/middlewares/require-auth'

export async function productRoutes(server: FastifyInstance) {
  const productRepository = new ProductRepository()
  const storeRepository = new StoreRepository()
  const productService = new ProductService(productRepository, storeRepository)
  const controller = new ProductController(productService)

  server.post('/', { 
    schema: { body: CreateProductSchema },
    preHandler: [authorize(['MERCHANT', 'ADMIN'])] 
  }, controller.create.bind(controller) as any)
  
  server.get('/store/:storeId', controller.list.bind(controller))
  
  server.patch('/:id', { 
    schema: { body: UpdateProductSchema },
    preHandler: [authorize(['MERCHANT', 'ADMIN'])] 
  }, controller.update.bind(controller) as any)
}
