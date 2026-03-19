import { prisma, Order, Prisma } from '@num-pulo/database'

// Camada de Isolamento com o Prisma ORM (Design Pattern: Data Mapper/Repository)
export class OrderRepository {
  async create(data: Prisma.OrderCreateInput): Promise<Order> {
    return prisma.order.create({ data })
  }

  async findById(id: string): Promise<Order | null> {
    return prisma.order.findUnique({ where: { id } })
  }

  async updateStatus(id: string, status: Prisma.EnumOrderStatusFieldUpdateOperationsInput | any): Promise<Order> {
    return prisma.order.update({
      where: { id },
      data: { status }
    })
  }
}
