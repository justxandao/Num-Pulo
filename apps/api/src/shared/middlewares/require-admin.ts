import { FastifyRequest, FastifyReply } from 'fastify'

export async function requireAdmin(request: FastifyRequest, reply: FastifyReply) {
  const user = request.user as { role: string } | undefined

  if (!user || user.role !== 'ADMIN') {
    return reply.status(403).send({ 
      error: 'Forbidden',
      message: 'Acesso restrito: Apenas administradores podem realizar esta ação.' 
    })
  }
}
