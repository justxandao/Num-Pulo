import { FastifyInstance } from 'fastify'
import { AuthRepository } from './auth.repository'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'

export async function authRoutes(server: FastifyInstance) {
  const repository = new AuthRepository()
  const service = new AuthService(repository)
  const controller = new AuthController(service)

  server.post('/register', controller.register.bind(controller))
  server.post('/login', controller.login.bind(controller))
}
