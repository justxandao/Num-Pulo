import { FastifyRequest, FastifyReply } from 'fastify'
import { UserRole } from '@num-pulo/database'

export function authorize(roles: UserRole[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      // Ensure user is authenticated first
      await request.jwtVerify()
      
      const user = request.user as { role: UserRole } | undefined

      if (!user || !roles.includes(user.role)) {
        return reply.status(403).send({
          success: false,
          message: 'Acesso negado: você não tem permissão para acessar este recurso.'
        })
      }
    } catch (err) {
      return reply.status(401).send({
        success: false,
        message: 'Não autenticado'
      })
    }
  }
}
