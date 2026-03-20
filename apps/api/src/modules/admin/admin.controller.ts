import { FastifyRequest, FastifyReply } from 'fastify'
import { StoreService } from '../stores/store.service'
import { UserService } from '../users/user.service'

export class AdminController {
  constructor(
    private readonly storeService: StoreService,
    private readonly userService: UserService
  ) {}

  async listStores(request: FastifyRequest, reply: FastifyReply) {
    const stores = await this.storeService.listAll()
    return reply.send({ stores })
  }

  async updateStoreStatus(
    request: FastifyRequest<{ Params: { id: string }, Body: { status: string } }>, 
    reply: FastifyReply
  ) {
    const { id } = request.params
    const { status } = request.body
    
    // @ts-ignore - Prisma enum status check
    const store = await this.storeService.updateStatus(id, status)
    return reply.send({ store })
  }

  async listUsers(request: FastifyRequest, reply: FastifyReply) {
    const users = await this.userService.listAll()
    return reply.send({ users })
  }
}
