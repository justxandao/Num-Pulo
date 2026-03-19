import { OrderRepository } from './order.repository'

// Service contem REGRA DE NEGÓCIO PURA. Zero referências ao Fastify ou Protocolos HTTP.
export class OrderService {
  constructor(private readonly orderRepository: OrderRepository) {}

  async createCheckout(data: any) {
    // 1. Regra: Somente cobrar taxa em pedidos abaixo de 50 (Exemplo de regra)
    const baseTotal = data.items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0)
    const deliveryFee = baseTotal > 50 ? 0 : 5.00
    const finalAmount = baseTotal + deliveryFee

    // 2. Persistência: Criar pedido com status PENDING inicializando a máquina de estado
    const order = await this.orderRepository.create({
      status: 'PENDING',
      totalAmount: finalAmount,
      deliveryFee,
      customer: { connect: { id: data.customerId } },
      store: { connect: { id: data.storeId } }
    })

    // 3. Dispatch Event: Aqui emitiríamos o evento "order:created" via Socket.io/Redis 
    //    para a loja aceitar.
    return order
  }

  async acceptOrder(orderId: string, storeOwnerId: string) {
    const order = await this.orderRepository.findById(orderId)
    if (!order) throw new Error('Pedido não encontrado')
    
    // Regra de ABAC (Validação de propriedade do lojista) deve acontecer aqui em produção
    // if(order.store.ownerId !== storeOwnerId) throw ForbiddenException()

    // Regra da Máquina de Estado: Apenas PENDING pode ir para ACCEPTED
    if (order.status !== 'PENDING') {
      throw new Error('Processo inválido: O pedido já foi processado ou rejeitado.')
    }

    // Avança o status
    const updated = await this.orderRepository.updateStatus(orderId, 'ACCEPTED')
    
    // Dispatch Event: "order:accepted" notifica o Cliente que preparo iniciou.
    return updated
  }
}
