import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, ScrollView, RefreshControl, Alert } from 'react-native'
import { useAuth } from '../contexts/AuthContext'
import { LogOut, Package, MapPin, List, CheckCircle2, Navigation } from 'lucide-react-native'
import { orderApi } from '../services/api'
import { io, Socket } from 'socket.io-client'
import * as SecureStore from 'expo-secure-store'

interface OrderItem {
  id: string
  quantity: number
  price: string
  product: {
    name: string
  }
}

interface Order {
  id: string
  status: string
  totalAmount: string
  deliveryFee: string
  store: {
    name: string
  }
  customer: {
    name: string
  }
  items: OrderItem[]
}

export default function Home() {
  const { user, signOut } = useAuth()
  const [availableOrders, setAvailableOrders] = useState<Order[]>([])
  const [activeOrder, setActiveOrder] = useState<Order | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [socket, setSocket] = useState<Socket | null>(null)

  const fetchData = async () => {
    try {
      setRefreshing(true)
      const [availableRes, myRes] = await Promise.all([
        orderApi.getAvailable(),
        orderApi.getMyDeliveries()
      ])

      setAvailableOrders(availableRes.data.orders)
      
      const active = myRes.data.orders.find((o: Order) => 
        o.status === 'DISPATCHED'
      )
      setActiveOrder(active || null)
    } catch (error) {
      console.error('Erro ao buscar dados:', error)
    } finally {
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchData()

    let s: Socket
    const setupSocket = async () => {
      const token = await SecureStore.getItemAsync('num-pulo:courier:token')
      s = io('http://10.0.2.2:3000', {
        auth: { token }
      })

      s.on('order:ready', (data) => {
        Alert.alert('Novo Pedido!', 'Um novo pedido está pronto para coleta.')
        fetchData()
      })

      setSocket(s)
    }

    setupSocket()

    return () => {
      if (s) s.disconnect()
    }
  }, [])

  const handlePickUp = async (orderId: string) => {
    try {
      await orderApi.pickUp(orderId)
      Alert.alert('Sucesso', 'Você assumiu a entrega!')
      fetchData()
    } catch (error: any) {
      Alert.alert('Erro', error.response?.data?.message || 'Erro ao aceitar pedido')
    }
  }

  const handleComplete = async (orderId: string) => {
    try {
      await orderApi.updateStatus(orderId, 'DELIVERED')
      Alert.alert('Parabéns!', 'Entrega finalizada com sucesso.')
      fetchData()
    } catch (error: any) {
      Alert.alert('Erro', error.response?.data?.message || 'Erro ao finalizar entrega')
    }
  }

  const formatCurrency = (value: string) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value))
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Olá, entregador</Text>
          <Text style={styles.name}>{user?.name}</Text>
        </View>
        <TouchableOpacity onPress={signOut} style={styles.logoutButton}>
          <LogOut size={20} color="#ef4444" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchData} tintColor="#fff" />}
      >
        {activeOrder ? (
          <View style={styles.activeContainer}>
            <View style={styles.sectionHeader}>
              <Navigation size={20} color="#3b82f6" />
              <Text style={styles.sectionTitle}>ENTREGA ATUAL</Text>
            </View>
            
            <View style={styles.deliveryCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.storeName}>{activeOrder.store.name}</Text>
                <Text style={styles.statusBadge}>EM TRÂNSITO</Text>
              </View>
              
              <View style={styles.divider} />
              
              <View style={styles.infoRow}>
                <MapPin size={18} color="#94a3b8" />
                <Text style={styles.infoText}>Cliente: {activeOrder.customer.name}</Text>
              </View>

              <View style={styles.infoRow}>
                <Package size={18} color="#94a3b8" />
                <Text style={styles.infoText}>{activeOrder.items.length} itens no pedido</Text>
              </View>

              <TouchableOpacity 
                style={styles.completeButton}
                onPress={() => handleComplete(activeOrder.id)}
              >
                <CheckCircle2 size={20} color="#fff" />
                <Text style={styles.buttonText}>FINALIZAR ENTREGA</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View>
            <View style={styles.sectionHeader}>
              <List size={20} color="#3b82f6" />
              <Text style={styles.sectionTitle}>DISPONÍVEIS AGORA</Text>
            </View>

            {availableOrders.length === 0 ? (
              <View style={styles.emptyState}>
                <Package size={64} color="#334155" />
                <Text style={styles.emptyTitle}>Nenhuma entrega disponível</Text>
                <Text style={styles.emptySubtitle}>Aguarde um momento ou puxe para atualizar.</Text>
              </View>
            ) : (
              availableOrders.map(order => (
                <View key={order.id} style={styles.orderCard}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.storeName}>{order.store.name}</Text>
                    <Text style={styles.priceText}>{formatCurrency(order.deliveryFee)}</Text>
                  </View>
                  
                  <Text style={styles.customerName}>Para: {order.customer.name}</Text>
                  
                  <TouchableOpacity 
                    style={styles.acceptButton}
                    onPress={() => handlePickUp(order.id)}
                  >
                    <Text style={styles.buttonText}>ACEITAR ENTREGA</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>
        )}

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Hoje</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#3b82f6' }]}>
            <Text style={[styles.statValue, { color: '#fff' }]}>R$ 0,00</Text>
            <Text style={[styles.statLabel, { color: '#e2e8f0' }]}>Ganhos</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingTop: 40,
  },
  greeting: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '600',
  },
  name: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '800',
  },
  logoutButton: {
    padding: 12,
    backgroundColor: '#1e293b',
    borderRadius: 12,
  },
  content: {
    padding: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#3b82f6',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  activeContainer: {
    marginBottom: 32,
  },
  deliveryCard: {
    backgroundColor: '#1e293b',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#334155',
  },
  orderCard: {
    backgroundColor: '#1e293b',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  storeName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  },
  statusBadge: {
    backgroundColor: '#1e3a8a',
    color: '#60a5fa',
    fontSize: 10,
    fontWeight: '900',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  priceText: {
    color: '#10b981',
    fontSize: 16,
    fontWeight: '800',
  },
  customerName: {
    color: '#94a3b8',
    fontSize: 14,
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#334155',
    marginVertical: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  infoText: {
    color: '#cbd5e1',
    fontSize: 14,
    fontWeight: '500',
  },
  acceptButton: {
    backgroundColor: '#10b981',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  completeButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 32,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#fff',
  },
  statLabel: {
    fontSize: 10,
    color: '#94a3b8',
    marginTop: 2,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    backgroundColor: '#1e293b',
    borderRadius: 24,
    marginBottom: 24,
  },
  emptyTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
    marginTop: 12,
  },
  emptySubtitle: {
    color: '#94a3b8',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: 24,
  },
})
