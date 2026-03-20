import { prisma, Store, Prisma } from '@num-pulo/database'

export class StoreRepository {
  async create(data: Prisma.StoreCreateInput): Promise<Store> {
    return prisma.store.create({ data })
  }

  async findByOwnerId(ownerId: string): Promise<Store[]> {
    return prisma.store.findMany({ where: { ownerId } })
  }

  async findById(id: string): Promise<Store | null> {
    return prisma.store.findUnique({ where: { id } })
  }

  async findAllApproved(): Promise<Store[]> {
    return prisma.store.findMany({ 
      where: { 
        isOpen: true,
        status: 'APPROVED'
      }
    })
  }

  async findAll(): Promise<Store[]> {
    return prisma.store.findMany({
      orderBy: { createdAt: 'desc' }
    })
  }

  async update(id: string, data: Prisma.StoreUpdateInput): Promise<Store> {
    return prisma.store.update({ where: { id }, data })
  }
}
