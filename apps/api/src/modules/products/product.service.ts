import { ProductRepository } from './product.repository'
import { StoreRepository } from '../stores/store.repository'

export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly storeRepository: StoreRepository
  ) {}

  async create(data: any, ownerId: string) {
    const store = await this.storeRepository.findById(data.storeId)
    
    if (!store || store.ownerId !== ownerId) {
      throw new Error('Loja não encontrada ou permissão insuficiente')
    }

    return this.productRepository.create(data)
  }

  async listActiveByStore(storeId: string) {
    return this.productRepository.findActiveByStoreId(storeId)
  }

  async listByStore(storeId: string) {
    return this.productRepository.findByStoreId(storeId)
  }

  async updateProduct(productId: string, ownerId: string, data: any) {
    const product = await this.productRepository.findById(productId)
    if (!product) throw new Error('Produto não encontrado')

    const store = await this.storeRepository.findById(product.storeId)
    if (!store || store.ownerId !== ownerId) {
      throw new Error('Permissão insuficiente para editar este produto')
    }

    return this.productRepository.update(productId, data)
  }
}
