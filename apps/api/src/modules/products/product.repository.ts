import { prisma, Product, Prisma } from '@num-pulo/database'

export class ProductRepository {
  async create(data: Prisma.ProductCreateInput): Promise<Product> {
    return prisma.product.create({ data })
  }

  async findActiveByStoreId(storeId: string): Promise<Product[]> {
    return prisma.product.findMany({ 
      where: { storeId, isActive: true } 
    })
  }

  async findByStoreId(storeId: string): Promise<Product[]> {
    return prisma.product.findMany({ 
      where: { storeId } 
    })
  }

  async findById(id: string): Promise<Product | null> {
    return prisma.product.findUnique({ where: { id } })
  }

  async update(id: string, data: Prisma.ProductUpdateInput): Promise<Product> {
    return prisma.product.update({ 
      where: { id },
      data 
    })
  }

  async delete(id: string): Promise<Product> {
    return prisma.product.update({
      where: { id },
      data: { isActive: false }
    })
  }
}
