import { AuthRepository } from './auth.repository'
import { hashPassword, verifyPassword } from '../../shared/utils/hash'
import { Prisma } from '@num-pulo/database'

export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  async register(data: Prisma.UserCreateInput) {
    const existingUser = await this.authRepository.findByEmail(data.email)
    if (existingUser) {
      throw new Error('E-mail já está em uso')
    }

    const hashedPassword = hashPassword(data.password)

    const user = await this.authRepository.create({
      ...data,
      password: hashedPassword
    })

    const { password, ...userWithoutPassword } = user
    return userWithoutPassword
  }

  async login(email: string, passwordInput: string) {
    const user = await this.authRepository.findByEmail(email)
    
    if (!user) {
      throw new Error('Credenciais inválidas')
    }

    const isValid = verifyPassword(passwordInput, user.password)
    
    if (!isValid) {
      throw new Error('Credenciais inválidas')
    }

    const { password, ...userWithoutPassword } = user
    return userWithoutPassword
  }
}
