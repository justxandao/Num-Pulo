import React, { createContext, useContext, useState } from 'react'

interface Product {
  id: string
  name: string
  price: number
  imageUrl?: string
  quantity: number
  storeId: string
}

interface CartContextData {
  items: Product[]
  addToCart(product: Omit<Product, 'quantity'>): void
  removeFromCart(productId: string): void
  clearCart(): void
  total: number
}

const CartContext = createContext<CartContextData>({} as CartContextData)

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<Product[]>([])

  const addToCart = (product: Omit<Product, 'quantity'>) => {
    setItems(prevItems => {
      // Regra de negócio: Carrinho só pode ter itens de uma mesma loja
      if (prevItems.length > 0 && prevItems[0].storeId !== product.storeId) {
        if (!confirm('Seu carrinho possui itens de outra loja. Deseja limpar o carrinho e adicionar este item?')) {
          return prevItems
        }
        return [{ ...product, quantity: 1 }]
      }

      const existingItem = prevItems.find(item => item.id === product.id)
      if (existingItem) {
        return prevItems.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prevItems, { ...product, quantity: 1 }]
    })
  }

  const removeFromCart = (productId: string) => {
    setItems(prevItems => 
      prevItems.reduce((acc, item) => {
        if (item.id === productId) {
          if (item.quantity > 1) {
            acc.push({ ...item, quantity: item.quantity - 1 })
          }
        } else {
          acc.push(item)
        }
        return acc
      }, [] as Product[])
    )
  }

  const clearCart = () => setItems([])

  const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0)

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, total }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
