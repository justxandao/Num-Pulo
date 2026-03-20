import { StoreRepository } from './store.repository'
import { Prisma, Store } from '@num-pulo/database'

export class StoreService {
  constructor(private readonly storeRepository: StoreRepository) {}

  async create(data: Prisma.StoreCreateInput): Promise<Store> {
    return this.storeRepository.create(data)
  }

  async listByUser(ownerId: string): Promise<Store[]> {
    return this.storeRepository.findByOwnerId(ownerId)
  }

  async listAllApproved(): Promise<Store[]> {
    return this.storeRepository.findAllApproved()
  }

  async findById(id: string): Promise<Store | null> {
    return this.storeRepository.findById(id)
  }

  async update(id: string, ownerId: string, data: any): Promise<Store> {
    const store = await this.storeRepository.findById(id)
    if (!store || store.ownerId !== ownerId) {
      throw new Error('Loja não encontrada ou permissão insuficiente')
    }
    return this.storeRepository.update(id, data)
  }

  // Admin and Internal methods
  async listAll(): Promise<Store[]> {
    return this.storeRepository.findAll()
  }

  async updateStatus(id: string, status: any): Promise<Store> {
    return this.storeRepository.update(id, { status })
  }
}
