import { FastifyRequest, FastifyReply } from 'fastify'
import { ProductService } from './product.service'

export class ProductController {
  constructor(private readonly productService: ProductService) {}

  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { sub: userId } = request.user
      const product = await this.productService.create(request.body, userId)
      return reply.code(201).send({ success: true, product })
    } catch (error: any) {
      return reply.code(400).send({ success: false, message: error.message })
    }
  }

  async list(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { storeId } = request.params as { storeId: string }
      const products = await this.productService.listByStore(storeId)
      return reply.send({ success: true, products })
    } catch (error: any) {
      return reply.code(400).send({ success: false, message: error.message })
    }
  }

  async update(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string }
      const { sub: userId } = request.user
      const product = await this.productService.updateProduct(id, userId, request.body)
      return reply.send({ success: true, product })
    } catch (error: any) {
      return reply.code(400).send({ success: false, message: error.message })
    }
  }
}
