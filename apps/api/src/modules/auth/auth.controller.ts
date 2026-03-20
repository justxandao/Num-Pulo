import { FastifyRequest, FastifyReply } from 'fastify'
import { AuthService } from './auth.service'
import { RegisterInput, LoginInput } from './auth.schema'

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  async register(request: FastifyRequest<{ Body: RegisterInput }>, reply: FastifyReply) {
    try {
      const data = request.body
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

  async login(request: FastifyRequest<{ Body: LoginInput }>, reply: FastifyReply) {
    try {
      const { email, password } = request.body

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
