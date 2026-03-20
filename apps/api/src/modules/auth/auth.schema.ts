import { Type, Static } from '@sinclair/typebox'

export const RegisterSchema = Type.Object({
  email: Type.String({ format: 'email' }),
  password: Type.String({ minLength: 6 }),
  name: Type.String({ minLength: 2 }),
  role: Type.Enum({
    ADMIN: 'ADMIN',
    MERCHANT: 'MERCHANT',
    COURIER: 'COURIER',
    CUSTOMER: 'CUSTOMER'
  })
})

export const LoginSchema = Type.Object({
  email: Type.String({ format: 'email' }),
  password: Type.String()
})

export type RegisterInput = Static<typeof RegisterSchema>
export type LoginInput = Static<typeof LoginSchema>
