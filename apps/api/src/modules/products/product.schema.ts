import { Type, Static } from '@sinclair/typebox'

export const CreateProductSchema = Type.Object({
  name: Type.String({ minLength: 2 }),
  price: Type.Number({ minimum: 0 }),
  storeId: Type.String({ format: 'uuid' }),
  isActive: Type.Optional(Type.Boolean())
})

export const UpdateProductSchema = Type.Object({
  name: Type.Optional(Type.String({ minLength: 2 })),
  price: Type.Optional(Type.Number({ minimum: 0 })),
  isActive: Type.Optional(Type.Boolean())
})

export type CreateProductInput = Static<typeof CreateProductSchema>
export type UpdateProductInput = Static<typeof UpdateProductSchema>
