import { PrismaClient, UserRole, StoreStatus, OrderStatus } from '@prisma/client'
import { randomUUID } from 'crypto'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Limpar tabelas (ordem de dependência)
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.product.deleteMany()
  await prisma.store.deleteMany()
  await prisma.user.deleteMany()

  // 1. Criar Usuários: Admin, Cliente e Entregador
  const senhaPadrao = '$2a$10$gV271zO975D8s.u5eYf0F.M1K1f0W/Z.wG2vj.U6A95q/3XQ.g/.a' // (123456 com bcrypt ou mock)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@numpulo.com.br' },
    update: {},
    create: {
      email: 'admin@numpulo.com.br',
      name: 'Administrador Pulo',
      password: senhaPadrao,
      role: UserRole.ADMIN,
      phone: '11999999999',
    },
  })

  // Criar Donos de Restaurantes (Merchants)
  const merchantsData = [
    { email: 'dono1@restaurante.com', name: 'João Silva', role: UserRole.MERCHANT, phone: '11988887777', password: senhaPadrao },
    { email: 'dono2@pizzaria.com', name: 'Maria Souza', role: UserRole.MERCHANT, phone: '11977776666', password: senhaPadrao },
    { email: 'dono3@hamburgueria.com', name: 'Carlos Oliveira', role: UserRole.MERCHANT, phone: '11966665555', password: senhaPadrao },
    { email: 'dono4@sushi.com', name: 'Ana Costa', role: UserRole.MERCHANT, phone: '11955554444', password: senhaPadrao },
    { email: 'dono5@doceria.com', name: 'Pedro Santos', role: UserRole.MERCHANT, phone: '11944443333', password: senhaPadrao },
  ]
  const merchants = []
  for (const merchantData of merchantsData) {
    merchants.push(
      await prisma.user.create({ data: merchantData })
    )
  }

  const cliente = await prisma.user.upsert({
    where: { email: 'cliente@teste.com.br' },
    update: {},
    create: {
      email: 'cliente@teste.com.br',
      name: 'Cliente Teste Roberto',
      password: senhaPadrao,
      role: UserRole.CUSTOMER,
      phone: '11933332222',
    },
  })

  const entregador = await prisma.user.upsert({
    where: { email: 'entregador@teste.com.br' },
    update: {},
    create: {
      email: 'entregador@teste.com.br',
      name: 'Entregador Teste Motorizado',
      password: senhaPadrao,
      role: UserRole.COURIER,
      phone: '11922221111',
    },
  })

  console.log('✅ Users created')

  // 2. Criar Estabelecimentos
  const storesData = [
    { name: 'Restaurante do João', ownerId: merchants[0].id, isOpen: true, status: StoreStatus.APPROVED },
    { name: 'Pizzaria Bella Napoli', ownerId: merchants[1].id, isOpen: true, status: StoreStatus.APPROVED },
    { name: 'Hamburgueria Smash', ownerId: merchants[2].id, isOpen: true, status: StoreStatus.APPROVED },
    { name: 'Sushi Tokyo Express', ownerId: merchants[3].id, isOpen: false, status: StoreStatus.APPROVED },
    { name: 'Doceria Sonho Doce', ownerId: merchants[4].id, isOpen: true, status: StoreStatus.APPROVED },
  ]

  const stores = []
  for (const store of storesData) {
    stores.push(
      await prisma.store.create({ data: store })
    )
  }

  console.log('✅ Establishments created')

  // 3. Criar Produtos Exemplo
  const produtosRestaurante = [
    { name: 'Prato Feito Tradicional', price: 25.90 },
    { name: 'Bife com Fritas', price: 32.50 },
    { name: 'Filé de Frango Grelhado', price: 22.90 },
    { name: 'Feijoada Completa (Serve 2)', price: 65.00 },
    { name: 'Suco de Laranja Natural', price: 8.50 },
    { name: 'Refrigerante Lata 350ml', price: 6.00 },
    { name: 'Porção de Batata Frita', price: 18.00 },
    { name: 'Pudim de Leite Condensado', price: 12.00 }
  ]

  const produtosPizzaria = [
    { name: 'Pizza Margherita Grande', price: 45.00 },
    { name: 'Pizza Calabresa Grande', price: 42.00 },
    { name: 'Pizza Portuguesa Grande', price: 48.00 },
    { name: 'Pizza Quatro Queijos Grande', price: 55.00 },
    { name: 'Pizza Frango com Catupiry', price: 49.00 },
    { name: 'Refrigerante 2L', price: 14.00 },
    { name: 'Borda Recheada Catupiry', price: 10.00 },
    { name: 'Pizza Doce Brigadeiro Peq', price: 35.00 }
  ]

  const produtosHamburgueria = [
    { name: 'Smash Burger Simples', price: 19.90 },
    { name: 'Smash Burger Duplo Bacon', price: 28.90 },
    { name: 'Cheese Salada Classic', price: 22.90 },
    { name: 'Combo Smash + Batata + Refri', price: 35.90 },
    { name: 'Batata Rústica c/ Cheddar', price: 21.00 },
    { name: 'Milkshake de Morango', price: 18.00 },
    { name: 'Milkshake de Chocolate', price: 18.00 },
    { name: 'Onion Rings', price: 15.00 }
  ]

  const produtosSushi = [
    { name: 'Combo Salmão 20 Peças', price: 59.90 },
    { name: 'Combinado Especial 40 Peças', price: 110.00 },
    { name: 'Temaki Salmão Completo', price: 26.50 },
    { name: 'Temaki Skin', price: 21.00 },
    { name: 'Sunomono Tradicional', price: 14.00 },
    { name: 'Hot Roll (10 unidades)', price: 25.00 },
    { name: 'Sashimi Salmão (10 fatias)', price: 38.00 },
    { name: 'Refrigerante Lata', price: 6.00 }
  ]

  const produtosDoceria = [
    { name: 'Fatia de Bolo de Chocolate', price: 15.00 },
    { name: 'Fatia Bolo Red Velvet', price: 18.00 },
    { name: 'Brigadeiro Gourmet (Unid)', price: 4.50 },
    { name: 'Caixa 6 Brigadeiros', price: 25.00 },
    { name: 'Torta de Limão (Fatia)', price: 14.00 },
    { name: 'Brownie c/ Sorvete', price: 22.00 },
    { name: 'Café Expresso', price: 5.50 },
    { name: 'Cappuccino', price: 9.00 }
  ]

  const todosProdutosMap = [produtosRestaurante, produtosPizzaria, produtosHamburgueria, produtosSushi, produtosDoceria]
  
  const createdProducts: any[] = []

  for (let i = 0; i < stores.length; i++) {
    const store = stores[i]
    const produtos = todosProdutosMap[i]
    for (const prod of produtos) {
      const dbProd = await prisma.product.create({
        data: {
          storeId: store.id,
          name: prod.name,
          price: prod.price,
          isActive: true
        }
      })
      createdProducts.push(dbProd)
    }
  }

  console.log('✅ Products created')

  // 4. Criar Pedidos
  const orders = [
    { storeId: stores[0].id, products: [0, 4], status: OrderStatus.PENDING }, // Pendente na restaurante
    { storeId: stores[1].id, products: [8, 13], status: OrderStatus.PREPARING }, // Preparando na pizzaria
    { storeId: stores[2].id, products: [16, 19], status: OrderStatus.DISPATCHED }, // Em entrega na hamburgueria
    { storeId: stores[3].id, products: [24, 26], status: OrderStatus.DELIVERED }, // Concluído no sushi
    { storeId: stores[4].id, products: [32, 33], status: OrderStatus.CANCELED }, // Cancelado na doceria
    { storeId: stores[0].id, products: [1], status: OrderStatus.READY }, // Aguardando entregador
  ]

  for (const orderInfo of orders) {
    const isDispatchedOrCompleted = orderInfo.status === OrderStatus.DISPATCHED || orderInfo.status === OrderStatus.DELIVERED
    
    // Calcula o total do pedido com base nos produtos selecionados
    const selectedProducts = orderInfo.products.map(index => createdProducts[index])
    const totalAmount = selectedProducts.reduce((sum, p) => sum + Number(p.price), 0)
    const deliveryFee = 5.99

    const order = await prisma.order.create({
      data: {
        customerId: cliente.id,
        storeId: orderInfo.storeId,
        courierId: isDispatchedOrCompleted ? entregador.id : null,
        status: orderInfo.status,
        totalAmount,
        deliveryFee,
        items: {
          create: selectedProducts.map(p => ({
            productId: p.id,
            quantity: 1,
            price: p.price
          }))
        }
      }
    })
  }

  console.log('✅ Orders created')
  console.log('🌱 Seed finished')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
