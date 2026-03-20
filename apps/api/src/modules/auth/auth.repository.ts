import { prisma, User, Prisma } from '@num-pulo/database'

export class AuthRepository {
  async create(data: Prisma.UserCreateInput): Promise<User> {
    return prisma.user.create({ data })
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } })
  }
}
