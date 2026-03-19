# Documentação de Arquitetura Inicial: Plataforma "Num Pulo"

## 1. Visão Geral da Arquitetura

A plataforma **Num Pulo** será iniciada utilizando o padrão **Monólito Modular** (Modular Monolith). Esta abordagem permite a simplicidade de desenvolvimento e deploy de um monólito nos estágios iniciais da startup, mantendo as fronteiras de domínio estritas. Isso garante que, quando for necessário escalar (transição para microserviços), a extração dos módulos seja feita de forma natural e com baixo acoplamento.

### Componentes de Alto Nível
- **API Central (Backend):** Responsável por consolidar todos os módulos de negócio (Catálogo, Pedidos, Usuários, etc.).
- **Aplicações Cliente (Frontend):**
  - Web App (Cliente final - React)
  - Mobile App (Cliente final / Entregador - React Native/Expo)
  - Painel do Comerciante (Web - React)
  - Painel Administrativo (Web - React)
- **Camada de Dados:** PostgreSQL (Persistência Principal).
- **Camada de Cache e Mensageria Inicial:** Redis (Sessões, Cache de Catálogo, Pub/Sub interno).
- **Comunicação em Tempo Real:** Socket.io acoplado à API, delegando estados temporários ao Redis.

---

## 2. Estrutura Completa de Monorepo

O projeto utilizará **npm/yarn workspaces** em conjunto com **Turborepo** para orquestrar as dependências e scripts.

Esta estrutura garante que regras de negócio de banco de dados (`packages/database`) e contratos de API (`packages/types`) sejam estritamente compartilhados, tipando o sistema de ponta a ponta.

---

## 3. Módulos do Backend (Monólito Modular)

A `apps/api` será dividida em módulos (Domain-Driven Design focado em contextos limitados). Um módulo se comunica com o outro através de injeção de dependência ou eventos locais, NUNCA acessando o banco de dados de outro módulo diretamente.

1. **Módulo de Identidade (IAM):** Autenticação (JWT + Refresh Tokens na tabela/Redis), gerenciamento de usuários e RBAC.
2. **Módulo de Catálogo:** Lojas, categorias, produtos e variações (adicionais).
3. **Módulo de Pedidos (Order Core):** Carrinho, checkout, cálculo de taxas e máquina de estado do pedido (Criado -> Aceito -> Preparando -> Rota -> Entregue).
4. **Módulo de Logística:** Alocação de entregadores, tracking de posição e repasses.
5. **Módulo Financeiro:** Pagamentos (simulação/integração de gateway), carteiras de lojas/entregadores, split de pagamento.
6. **Módulo de Notificações:** Hub para envios de push notifications, emails e gerenciamento das conexões Socket.io.

---

## 4. Modelagem de Banco de Dados Inicial (Prisma)

A modelagem focará na flexibilidade mas sem perder a integridade transacional.

```prisma
// Exemplo Conceitual (packages/database/schema.prisma)

model User {
  id        String   @id @default(uuid())
  role      UserRole // ADMIN, MERCHANT, COURIER, CUSTOMER
  email     String   @unique
  password  String
  name      String
  phone     String?
  stores    Store[]  // Se for MERCHANT
  orders    Order[]  @relation("CustomerOrders")
  deliveries Order[] @relation("CourierDeliveries")
}

model Store {
  id          String   @id @default(uuid())
  ownerId     String
  name        String
  isOpen      Boolean  @default(false)
  catalog     Product[]
  orders      Order[]
  owner       User     @relation(fields: [ownerId], references: [id])
}

model Product {
  id          String   @id @default(uuid())
  storeId     String
  name        String
  price       Decimal
  isActive    Boolean  @default(true)
  store       Store    @relation(fields: [storeId], references: [id])
  orderItems  OrderItem[]
}

model Order {
  id             String      @id @default(uuid())
  customerId     String
  storeId        String
  courierId      String?
  status         OrderStatus // PENDING, ACCEPTED, PREPARING, READY, DISPATCHED, DELIVERED, CANCELED
  totalAmount    Decimal
  deliveryFee    Decimal
  createdAt      DateTime    @default(now())
  
  customer       User        @relation("CustomerOrders", fields: [customerId], references: [id])
  courier        User?       @relation("CourierDeliveries", fields: [courierId], references: [id])
  store          Store       @relation(fields: [storeId], references: [id])
  items          OrderItem[]
}

model OrderItem {
  id        String  @id @default(uuid())
  orderId   String
  productId String
  quantity  Int
  price     Decimal // Preço no momento da compra
  order     Order   @relation(fields: [orderId], references: [id])
  product   Product @relation(fields: [productId], references: [id])
}
```

---

## 5. Fluxos Principais de Pedidos

A máquina de estados dos pedidos é o coração do sistema, definindo como o ecossistema interage.

1. **Checkout (Cliente):** HTTP POST `/orders`. Valida estoque/disponibilidade e precifica. O status inicial é `PENDING`.
2. **Notificação de Nova Venda (Loja):** Evento via Socket.io é emitido para a sala (Room) do comerciante alertando novo pedido.
3. **Aceite (Comerciante):** HTTP PATCH `/orders/:id/status` (status -> `ACCEPTED` -> `PREPARING`). Socket.io avisa o cliente.
4. **Despacho (Logística/Loja):** Status muda para `READY`. Sistema de *broadcast* notifica entregadores num raio xKM (usando PostGIS ou queries de localização).
5. **Aceite de Corrida (Entregador):** Entregador faz claim do pedido. Status vai para `DISPATCHED`. Notifica cliente e loja.
6. **Entrega Concluída (Entregador):** Confirmação via código ou GPS local. Status de pedido muda para `DELIVERED`. Dispara o hook do serviço financeiro para lançamento de saldo na carteira da Loja e Entregador.

---

## 6. Sistema de Roles e Permissões (RBAC / ABAC)

Utilizaremos claims de JWT focadas na natureza multilocatário (multi-tenant) da plataforma.

* **Customer (Cliente):** Acesso padrão restrito apenas aos seus próprios recursos.
* **Merchant (Comerciante):** O JWT deve conter um claim de `storeId` ou `stores: [id1, id2]`. Ele só pode ler/escrever pedidos da sua loja.
* **Courier (Entregador):** Acesso a corridas públicas e ações da sua rota.
* **Admin:** Acesso irrestrito focado em backoffice.

---

## 7. Comunicação em Tempo Real

* **Autenticação no Socket:** O handshake inicial exige o envio do Token JWT.
* **Rooms (Salas):** Clientes ingressam no room `order:{orderId}`. Lojas ingressam no room `store:{storeId}`.
* **Redis Adapter (@socket.io/redis-adapter):** Fundamental para coordenar os sockets quando houver replicações da API.

---

## 8. Padrões de Código e Organização

* **Controllers:** Recepcionam requests HTTP, validam schemas com Zod.
* **Services / Use Cases:** Contêm regras puras de negócio isoladas.
* **Repositories:** As abstrações sobre o Prisma (para facilitar mock tests).

---

## 9. Plano de Escalabilidade Futura

1. **Separação Rápida de Worker:** Filas corporativas com Redis BullMQ para processamentos assíncronos.
2. **Separação de Serviço WS:** Extrair o Socket.io da API principal para um mini-projeto.
3. **Extração de Microserviços:** Extrair partes muito sobrecarregadas para clusters paralelos do Monólito.
4. **Replicação de Banco:** Consultas (Read) na Réplica e Escritas (Write) na Master.

---

## 10. Como Rodar o Projeto

Este ecossistema utiliza **Turborepo** para orquestrar os pacotes Node.js isoladamente.

Para inicializar a plataforma de ponta-a-ponta, siga o guia:

1. Na raiz do projeto, instale as dependências:
```bash
npm install
```

2. Para levantar todos os servidores (`apps/api`, `apps/web-client`, `apps/web-merchant` e `apps/mobile-client`) sincronizadamente:
```bash
npx turbo run dev
```
