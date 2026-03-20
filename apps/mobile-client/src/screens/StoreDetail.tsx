import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Image } from 'react-native'
import { ArrowLeft, ShoppingBag, Plus } from 'lucide-react-native'
import api from '../services/api'
import { useCart } from '../contexts/CartContext'

export default function StoreDetail({ route, navigation }: any) {
  const { store } = route.params
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { items, addToCart, total } = useCart()

  const fetchProducts = async () => {
    try {
      const response = await api.get(`/products/store/${store.id}`)
      setProducts(response.data.products)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{store.name}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.storeHero}>
           <Text style={{ fontSize: 80 }}>{store.name.toLowerCase().includes('pizza') ? '🍕' : '🍔'}</Text>
           <Text style={styles.storeNameLg}>{store.name}</Text>
           <Text style={styles.storeStatus}>{store.isOpen ? '🟢 ABERTO AGORA' : '🔴 FECHADO'}</Text>
        </View>

        <Text style={styles.sectionTitle}>Cardápio</Text>

        {loading ? (
          <ActivityIndicator color="#f97316" size="large" />
        ) : (
          <View style={styles.productList}>
            {products.map((product) => (
              <View key={product.id} style={styles.productCard}>
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{product.name}</Text>
                  <Text style={styles.productPrice}>R$ {Number(product.price).toFixed(2).replace('.', ',')}</Text>
                </View>
                <TouchableOpacity 
                  style={styles.addButton}
                  onPress={() => addToCart({ ...product, storeId: store.id })}
                >
                  <Plus size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {items.length > 0 && (
        <TouchableOpacity 
          style={styles.cartButton}
          onPress={() => navigation.navigate('Checkout')}
        >
          <View style={styles.cartBadge}>
             <Text style={styles.cartBadgeText}>{items.length}</Text>
          </View>
          <Text style={styles.cartButtonText}>VER CARRINHO</Text>
          <Text style={styles.cartTotalText}>R$ {total.toFixed(2).replace('.', ',')}</Text>
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  backButton: {
    padding: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#111827',
    textTransform: 'uppercase',
  },
  content: {
    padding: 20,
  },
  storeHero: {
    alignItems: 'center',
    marginBottom: 40,
  },
  storeNameLg: {
    fontSize: 32,
    fontWeight: '900',
    color: '#111827',
    marginTop: 12,
    transform: [{ skewX: '-6deg' }],
  },
  storeStatus: {
    fontSize: 10,
    fontWeight: '800',
    color: '#6b7280',
    marginTop: 4,
    letterSpacing: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#111827',
    marginBottom: 20,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  productList: {
    gap: 16,
    paddingBottom: 100,
  },
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f9f9fb',
    padding: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '900',
    color: '#f97316',
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  cartButton: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    backgroundColor: '#f97316',
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    shadowColor: '#f97316',
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  cartBadge: {
    width: 24,
    height: 24,
    borderRadius: 8,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cartBadgeText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#f97316',
  },
  cartButtonText: {
    flex: 1,
    color: '#fff',
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 1,
  },
  cartTotalText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 16,
  }
})
