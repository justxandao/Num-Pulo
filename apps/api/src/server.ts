import Fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import { prisma } from '@num-pulo/database'
import { orderRoutes } from './modules/orders/order.routes'

const server = Fastify({
  logger: true
})

// Plugins
server.register(cors, {
  origin: '*' // Modificar em produção
})

server.register(jwt, {
  secret: process.env.JWT_SECRET || 'super-secret-jwt-dev-key'
})

// Modulos Padrão (DDD)
server.register(orderRoutes, { prefix: '/api/v1/orders' })

// Rotas de Teste e Healthcheck
server.get('/health', async (request, reply) => {
  try {
    // Testa a conexão básica do banco
    await prisma.$queryRaw`SELECT 1`
    return { status: 'ok', database: 'connected', version: '1.0.0' }
  } catch (err) {
    return reply.status(500).send({ status: 'error', database: 'disconnected', error: err })
  }
})

// Inicialização
const start = async () => {
  try {
    await server.listen({ port: 3000, host: '0.0.0.0' })
    server.log.info(`Servidor Num Pulo rodando na porta 3000`)
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

start()
