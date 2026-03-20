import { UserRepository } from './user.repository'
import { User } from '@num-pulo/database'

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async listAll(): Promise<User[]> {
    return this.userRepository.findAll()
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findById(id)
  }
}
