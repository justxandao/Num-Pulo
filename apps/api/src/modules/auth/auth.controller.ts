import { FastifyRequest, FastifyReply } from 'fastify'
import { AuthService } from './auth.service'
import { Prisma } from '@num-pulo/database'

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  async register(request: FastifyRequest, reply: FastifyReply) {
    try {
      const data = request.body as Prisma.UserCreateInput
      const user = await this.authService.register(data)
      
      const token = await reply.jwtSign({
        sub: user.id,
        email: user.email,
        role: user.role
      })

      return reply.code(201).send({ success: true, user, token })
    } catch (error: any) {
      return reply.code(400).send({ success: false, message: error.message })
    }
  }

  async login(request: FastifyRequest, reply: FastifyReply) {
    try {
      const body = request.body as Record<string, string>
      const email = body?.email
      const password = body?.password
      if (!email || !password) {
        throw new Error('O e-mail e a senha são obrigatórios')
      }

      const user = await this.authService.login(email, password)

      const token = await reply.jwtSign({
        sub: user.id,
        email: user.email,
        role: user.role
      })

      return reply.send({ success: true, user, token })
    } catch (error: any) {
      return reply.code(401).send({ success: false, message: error.message })
    }
  }
}
