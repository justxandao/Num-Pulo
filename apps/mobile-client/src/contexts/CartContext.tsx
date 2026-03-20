import React, { createContext, useContext, useState } from 'react'

interface Product {
  id: string
  name: string
  price: number
  storeId: string
}

interface CartItem extends Product {
  quantity: number
}

interface CartContextData {
  items: CartItem[]
  addToCart: (product: Product) => void
  removeFromCart: (productId: string) => void
  clearCart: () => void
  total: number
}

const CartContext = createContext<CartContextData>({} as CartContextData)

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([])

  const addToCart = (product: Product) => {
    setItems(current => {
      const exists = current.find(i => i.id === product.id)
      if (exists) {
        return current.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i)
      }
      // Regra de negócio: Mesma loja
      if (current.length > 0 && current[0].storeId !== product.storeId) {
        alert('Você só pode adicionar itens de uma mesma loja por vez.')
        return current
      }
      return [...current, { ...product, quantity: 1 }]
    })
  }

  const removeFromCart = (productId: string) => {
    setItems(current => current.filter(i => i.id !== productId))
  }

  const clearCart = () => setItems([])

  const total = items.reduce((acc, item) => acc + (Number(item.price) * item.quantity), 0)

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, total }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
