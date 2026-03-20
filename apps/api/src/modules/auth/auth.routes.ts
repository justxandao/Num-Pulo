import { FastifyInstance } from 'fastify'
import { AuthRepository } from './auth.repository'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'

import { RegisterSchema, LoginSchema } from './auth.schema'

export async function authRoutes(server: FastifyInstance) {
  const repository = new AuthRepository()
  const service = new AuthService(repository)
  const controller = new AuthController(service)

  server.post('/register', { schema: { body: RegisterSchema } }, controller.register.bind(controller) as any)
  server.post('/login', { schema: { body: LoginSchema } }, controller.login.bind(controller) as any)
}
