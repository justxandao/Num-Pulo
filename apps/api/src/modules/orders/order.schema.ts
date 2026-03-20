import { Type, Static } from '@sinclair/typebox'

export const CreateOrderSchema = Type.Object({
  storeId: Type.String({ format: 'uuid' }),
  items: Type.Array(Type.Object({
    productId: Type.String({ format: 'uuid' }),
    quantity: Type.Integer({ minimum: 1 })
  }))
})

export const UpdateOrderStatusSchema = Type.Object({
  status: Type.Enum({
    PENDING: 'PENDING',
    ACCEPTED: 'ACCEPTED',
    PREPARING: 'PREPARING',
    READY: 'READY',
    DISPATCHED: 'DISPATCHED',
    DELIVERED: 'DELIVERED',
    CANCELED: 'CANCELED'
  })
})

export type CreateOrderInput = Static<typeof CreateOrderSchema>
export type UpdateOrderStatusInput = Static<typeof UpdateOrderStatusSchema>
