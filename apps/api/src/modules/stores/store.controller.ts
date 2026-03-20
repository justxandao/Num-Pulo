import { FastifyRequest, FastifyReply } from 'fastify'
import { StoreService } from './store.service'

export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { name } = request.body as { name: string }
      const { sub: ownerId } = request.user

      if (!name) {
        throw new Error('O nome da loja é obrigatório')
      }

      const store = await this.storeService.create({
        name,
        owner: { connect: { id: ownerId } }
      })
      return reply.code(201).send({ success: true, store })
    } catch (error: any) {
      return reply.code(400).send({ success: false, message: error.message })
    }
  }

  async list(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { sub: ownerId } = request.user
      const stores = await this.storeService.listByUser(ownerId)
      return reply.send({ success: true, stores })
    } catch (error: any) {
      return reply.code(400).send({ success: false, message: error.message })
    }
  }

  async listAll(request: FastifyRequest, reply: FastifyReply) {
    try {
      const stores = await this.storeService.listAllApproved()
      return reply.send({ success: true, stores })
    } catch (error: any) {
      return reply.code(400).send({ success: false, message: error.message })
    }
  }

  async update(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string }
      const { sub: userId } = request.user
      const store = await this.storeService.update(id, userId, request.body)
      return reply.send({ success: true, store })
    } catch (error: any) {
      return reply.code(400).send({ success: false, message: error.message })
    }
  }
}
