import { OrderRepository } from './order.repository'
import { ProductRepository } from '../products/product.repository'
import { socketService } from '../../infrastructure/socket/socket.service'
import { StoreRepository } from '../stores/store.repository'

export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly productRepository: ProductRepository,
    private readonly storeRepository: StoreRepository
  ) {}

  async createCheckout(customerId: string, storeId: string, items: { productId: string; quantity: number }[]) {
    if (!items || items.length === 0) {
      throw new Error('O carrinho não pode estar vazio')
    }

    // 1. Validar e Buscar Preços Reais do Banco (Security)
    let subtotal = 0
    const orderItemsData = []

    for (const item of items) {
      const product = await this.productRepository.findById(item.productId)
      
      if (!product || !product.isActive) {
        throw new Error(`Produto ${item.productId} não encontrado ou inativo`)
      }

      if (product.storeId !== storeId) {
        throw new Error(`Produto ${product.name} não pertence a esta loja`)
      }

      const price = Number(product.price)
      subtotal += price * item.quantity

      orderItemsData.push({
        productId: product.id,
        quantity: item.quantity,
        price: product.price
      })
    }

    // 2. Regra de Taxa de Entrega (R$ 5,00 se subtotal < 50)
    const deliveryFee = subtotal >= 50 ? 0 : 5.00
    const totalAmount = subtotal + deliveryFee

    // 3. Criar Pedido Atômico com Itens (Nested Write)
    const order = await this.orderRepository.create({
      status: 'PENDING',
      totalAmount,
      deliveryFee,
      customer: { connect: { id: customerId } },
      store: { connect: { id: storeId } },
      items: {
        create: orderItemsData
      }
    })

    // 4. Notificar Loja em Tempo Real
    const store = await this.storeRepository.findById(storeId)
    if (store) {
      socketService.emitToUser(store.ownerId, 'order:new', { orderId: order.id, customerId })
    }

    return order
  }

  async listCustomerOrders(customerId: string) {
    return this.orderRepository.findByCustomerId(customerId)
  }

  async acceptOrder(orderId: string, storeOwnerId: string) {
    const order = await this.orderRepository.findById(orderId)
    if (!order) throw new Error('Pedido não encontrado')
    
    // Status Machine Check: Apenas PENDING -> ACCEPTED
    if (order.status !== 'PENDING') {
      throw new Error('Processo inválido: O pedido já foi processado ou rejeitado.')
    }

    const updated = await this.orderRepository.updateStatus(orderId, 'ACCEPTED')
    
    // Notificar Cliente em Tempo Real sobre a atualização do status
    socketService.emitToUser(order.customerId, 'order:status_updated', { 
      orderId, 
      status: 'ACCEPTED' 
    })

    return updated
  }

  async updateStatus(orderId: string, status: string) {
    const order = await this.orderRepository.findById(orderId)
    if (!order) throw new Error('Pedido não encontrado')

    const updated = await this.orderRepository.updateStatus(orderId, status)
    
    // Notificar Cliente em Tempo Real
    socketService.emitToUser(order.customerId, 'order:status_updated', { 
      orderId, 
      status 
    })

    // Se o pedido estiver pronto para entrega, notificar todos os entregadores
    if (status === 'READY') {
      socketService.emitToRoom('couriers', 'order:ready', {
        orderId,
        storeName: order.storeId // Idealmente carregar o nome da loja
      })
    }

    return updated
  }

  async listStoreOrders(storeId: string) {
    return this.orderRepository.findByStoreId(storeId)
  }

  async listAvailableOrders() {
    return this.orderRepository.findAvailableForPickUp()
  }

  async acceptOrderForDelivery(orderId: string, courierId: string) {
    const order = await this.orderRepository.findById(orderId)
    
    if (!order) throw new Error('Pedido não encontrado')
    if (order.status !== 'READY' || order.courierId) {
      throw new Error('Este pedido não está disponível para coleta.')
    }

    const updated = await this.orderRepository.assignCourier(orderId, courierId)

    // Notificar Cliente e Loja
    socketService.emitToUser(order.customerId, 'order:dispatched', { orderId, courierId })
    socketService.emitToUser(order.storeId, 'order:dispatched', { orderId, courierId })

    return updated
  }

  async listCourierOrders(courierId: string) {
    return this.orderRepository.findByCourierId(courierId)
  }
}
