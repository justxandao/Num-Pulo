import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native'
import { Search, MapPin, Bell, Star, ShoppingBag } from 'lucide-react-native'
import api from '../services/api'
import { useAuth } from '../contexts/AuthContext'

const categories = [
  { id: '1', name: 'Mercados', icon: '🛒' },
  { id: '2', name: 'Lanches', icon: '🍔' },
  { id: '3', name: 'Pizzas', icon: '🍕' },
  { id: '4', name: 'Bebidas', icon: '🍻' },
]

export default function Home({ navigation }: any) {
  const { user, signOut } = useAuth()
  const [stores, setStores] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchStores = async () => {
    try {
      const response = await api.get('/stores')
      setStores(response.data.stores)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStores()
  }, [])

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.topRow}>
          <TouchableOpacity style={styles.addressBox}>
            <MapPin size={18} color="#f97316" />
            <Text style={styles.addressText} numberOfLines={1}>Rua do Exemplo, 123</Text>
          </TouchableOpacity>
          <View style={styles.headerIcons}>
             <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Orders')}>
                <ShoppingBag size={24} color="#111827" />
             </TouchableOpacity>
             <TouchableOpacity style={styles.avatar} onPress={signOut}>
                <Text style={styles.avatarText}>{user?.name.charAt(0)}</Text>
             </TouchableOpacity>
          </View>
        </View>

        <View style={styles.searchContainer}>
           <Search size={20} color="#9ca3af" style={styles.searchIcon} />
           <TextInput 
              placeholder="Buscar por loja ou prato"
              style={styles.searchInput}
              placeholderTextColor="#9ca3af"
           />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.categories}>
          {categories.map((cat) => (
            <TouchableOpacity key={cat.id} style={styles.catBox}>
              <Text style={{ fontSize: 24 }}>{cat.icon}</Text>
              <Text style={styles.catText}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.promoBanner}>
           <View>
              <Text style={styles.promoTag}>OFERTA DO DIA</Text>
              <Text style={styles.promoTitle}>GANHE R$20 OFF</Text>
              <Text style={styles.promoSubtitle}>Acima de R$50</Text>
           </View>
           <Text style={{ fontSize: 60 }}>🍔</Text>
        </View>

        <Text style={styles.sectionTitle}>Lojas Próximas</Text>

        {loading ? (
          <ActivityIndicator color="#f97316" size="large" style={{ marginTop: 40 }} />
        ) : (
          <View style={styles.storeList}>
            {stores.map((store) => (
              <TouchableOpacity 
                key={store.id} 
                style={styles.storeCard}
                onPress={() => navigation.navigate('StoreDetail', { store })}
              >
                <View style={[styles.storeImage, { opacity: store.isOpen ? 1 : 0.5 }]}>
                   <Text style={{ fontSize: 32 }}>
                      {store.name.toLowerCase().includes('pizza') ? '🍕' : '🍔'}
                   </Text>
                   {!store.isOpen && (
                     <View style={styles.closedOverlay}>
                        <Text style={styles.closedText}>FECHADO</Text>
                     </View>
                   )}
                </View>
                <View style={styles.storeInfo}>
                   <View style={styles.storeHeader}>
                      <Text style={styles.storeName}>{store.name}</Text>
                      <View style={styles.ratingBox}>
                         <Star size={12} color="#fbbf24" fill="#fbbf24" />
                         <Text style={styles.ratingText}>4.9</Text>
                      </View>
                   </View>
                   <Text style={styles.storeMeta}>20-30 min • Entrega Grátis</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
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
    backgroundColor: '#fff',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  addressBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#f3f4f6',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 100,
    maxWidth: '65%',
  },
  addressText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#111827',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconButton: {
    padding: 4,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f97316',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 16,
  },
  searchContainer: {
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  content: {
    padding: 20,
  },
  categories: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  catBox: {
    alignItems: 'center',
    gap: 8,
  },
  catText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#6b7280',
    textTransform: 'uppercase',
  },
  promoBanner: {
    backgroundColor: '#111827',
    borderRadius: 24,
    padding: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  promoTag: {
    color: '#f97316',
    fontSize: 10,
    fontWeight: '900',
    marginBottom: 4,
  },
  promoTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '900',
    transform: [{ skewX: '-6deg' }],
  },
  promoSubtitle: {
    color: '#9ca3af',
    fontSize: 12,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#111827',
    marginBottom: 16,
    transform: [{ skewX: '-6deg' }],
    textTransform: 'uppercase',
  },
  storeList: {
    gap: 16,
    paddingBottom: 40,
  },
  storeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  storeImage: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  closedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closedText: {
    backgroundColor: '#111827',
    color: '#fff',
    fontSize: 8,
    fontWeight: '900',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  storeInfo: {
    flex: 1,
  },
  storeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  storeName: {
    fontSize: 16,
    fontWeight: '900',
    color: '#111827',
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#fbbf24',
  },
  storeMeta: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9ca3af',
  }
})
