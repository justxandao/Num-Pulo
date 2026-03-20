import { Type, Static } from '@sinclair/typebox'

export const CreateStoreSchema = Type.Object({
  name: Type.String({ minLength: 3 })
})

export const UpdateStoreSchema = Type.Object({
  name: Type.Optional(Type.String({ minLength: 3 })),
  isOpen: Type.Optional(Type.Boolean()),
  status: Type.Optional(Type.Enum({
    PENDING: 'PENDING',
    APPROVED: 'APPROVED',
    BLOCKED: 'BLOCKED'
  }))
})

export type CreateStoreInput = Static<typeof CreateStoreSchema>
export type UpdateStoreInput = Static<typeof UpdateStoreSchema>
