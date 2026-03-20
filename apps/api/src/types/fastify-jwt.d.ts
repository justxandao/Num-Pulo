import { UserRole } from '@num-pulo/database'

declare module 'fastify' {
  interface FastifyRequest {
    user: {
      sub: string
      email: string
      role: UserRole
    }
  }
}
