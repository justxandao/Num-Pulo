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

  async findByCustomerId(customerId: string): Promise<Order[]> {
    return prisma.order.findMany({
      where: { customerId },
      include: { 
        items: { include: { product: true } },
        store: true 
      },
      orderBy: { createdAt: 'desc' }
    })
  }

  async findByStoreId(storeId: string): Promise<Order[]> {
    return prisma.order.findMany({
      where: { storeId },
      include: { 
        items: { include: { product: true } },
        customer: true 
      },
      orderBy: { createdAt: 'desc' }
    })
  }

  async findAvailableForPickUp(): Promise<Order[]> {
    return prisma.order.findMany({
      where: { 
        status: 'READY',
        courierId: null
      },
      include: {
        store: true,
        customer: true,
        items: { include: { product: true } }
      },
      orderBy: { updatedAt: 'desc' }
    })
  }

  async assignCourier(id: string, courierId: string): Promise<Order> {
    return prisma.order.update({
      where: { id },
      data: { 
        courierId,
        status: 'DISPATCHED'
      }
    })
  }
}
