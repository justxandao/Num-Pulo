import { FastifyRequest, FastifyReply } from 'fastify'
import { StoreService } from './store.service'
import { CreateStoreInput, UpdateStoreInput } from './store.schema'

export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  async create(request: FastifyRequest<{ Body: CreateStoreInput }>, reply: FastifyReply) {
    try {
      const { name } = request.body
      const { sub: ownerId } = request.user

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

  async update(request: FastifyRequest<{ Body: UpdateStoreInput; Params: { id: string } }>, reply: FastifyReply) {
    try {
      const { id } = request.params
      const { sub: userId } = request.user
      const store = await this.storeService.update(id, userId, request.body)
      return reply.send({ success: true, store })
    } catch (error: any) {
      return reply.code(400).send({ success: false, message: error.message })
    }
  }
}
