import { UserRole } from '@num-pulo/database'

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: { sub: string; email: string; role: UserRole }
    user: { sub: string; email: string; role: UserRole }
  }
}

declare module 'fastify' {
  interface FastifyRequest {
    jwtVerify(): Promise<void>
  }
}
