import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native'
import { ArrowLeft, Clock, ShoppingBag, ChevronRight, CheckCircle2, Package, Truck, Loader2 } from 'lucide-react-native'
import api from '../services/api'
import { useSocket } from '../hooks/useSocket'

export default function Orders({ navigation }: any) {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { onEvent } = useSocket()

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders/my')
      setOrders(response.data.orders)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  useEffect(() => {
    const cleanup = onEvent('order:status', () => {
      fetchOrders()
    })
    return cleanup
  }, [onEvent])

  const getStatusStep = (status: string) => {
    switch(status) {
      case 'PENDING': return 1
      case 'ACCEPTED': return 2
      case 'PREPARING': return 3
      case 'DISPATCHED': return 4
      case 'DELIVERED': return 5
      default: return 1
    }
  }

  const getStatusText = (status: string) => {
    switch(status) {
      case 'PENDING': return 'Aguardando Aprovação'
      case 'ACCEPTED': return 'Pedido Confirmado'
      case 'PREPARING': return 'Sendo Preparado'
      case 'DISPATCHED': return 'Saiu para Entrega'
      case 'DELIVERED': return 'Entregue'
      default: return status
    }
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#f97316" />
      </View>
    )
  }

  const activeOrders = orders.filter(o => o.status !== 'DELIVERED' && o.status !== 'CANCELED')
  const pastOrders = orders.filter(o => o.status === 'DELIVERED' || o.status === 'CANCELED')

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meus Pedidos</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {activeOrders.length > 0 && (
          <View style={styles.activeSection}>
            <Text style={styles.label}>EM ANDAMENTO</Text>
            {activeOrders.map(order => {
              const step = getStatusStep(order.status)
              return (
                <View key={order.id} style={styles.activeCard}>
                  <View style={styles.activeHeader}>
                     <View>
                        <Text style={styles.storeNameSmall}>{order.store?.name}</Text>
                        <Text style={styles.orderId}>Pedido #{order.id.slice(-4).toUpperCase()}</Text>
                     </View>
                     <Text style={styles.statusTextBadge}>{getStatusText(order.status)}</Text>
                  </View>

                  <View style={styles.progressRoad}>
                     <View style={styles.progressLine} />
                     <View style={[styles.progressLineActive, { width: `${((step - 1) / 4) * 100}%` }]} />
                     
                     <View style={styles.stepsRow}>
                        {[Clock, CheckCircle2, Package, Truck, ShoppingBag].map((Icon, i) => (
                           <View key={i} style={[styles.stepCircle, step >= i + 1 && styles.stepCircleActive]}>
                              <Icon size={12} color={step >= i + 1 ? '#fff' : '#d1d5db'} />
                           </View>
                        ))}
                     </View>
                  </View>
                </View>
              )
            })}
          </View>
        )}

        <View style={styles.historySection}>
           <Text style={styles.label}>HISTÓRICO</Text>
           {pastOrders.map(order => (
             <TouchableOpacity key={order.id} style={styles.historyCard}>
                <View style={styles.historyIcon}>
                   {order.store?.name.toLowerCase().includes('pizza') ? <Text>🍕</Text> : <Text>🍔</Text>}
                </View>
                <View style={styles.historyInfo}>
                   <Text style={styles.historyStore}>{order.store?.name}</Text>
                   <Text style={styles.historyMeta}>
                      {new Date(order.createdAt).toLocaleDateString('pt-BR')} • R$ {Number(order.totalAmount).toFixed(2).replace('.', ',')}
                   </Text>
                </View>
                <ChevronRight size={16} color="#d1d5db" />
             </TouchableOpacity>
           ))}
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
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
  label: {
    fontSize: 10,
    fontWeight: '900',
    color: '#9ca3af',
    marginBottom: 16,
    letterSpacing: 2,
  },
  activeSection: {
    marginBottom: 40,
  },
  activeCard: {
    backgroundColor: '#111827',
    borderRadius: 32,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
  },
  activeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 32,
  },
  storeNameSmall: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '900',
    transform: [{ skewX: '-6deg' }],
    textTransform: 'uppercase',
  },
  orderId: {
    color: '#6b7280',
    fontSize: 10,
    fontWeight: '700',
    marginTop: 2,
  },
  statusTextBadge: {
    color: '#f97316',
    fontSize: 8,
    fontWeight: '900',
    backgroundColor: 'rgba(249, 115, 22, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    textTransform: 'uppercase',
  },
  progressRoad: {
    height: 32,
    justifyContent: 'center',
  },
  progressLine: {
    height: 4,
    backgroundColor: '#374151',
    borderRadius: 2,
  },
  progressLineActive: {
    position: 'absolute',
    height: 4,
    backgroundColor: '#f97316',
    borderRadius: 2,
  },
  stepsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    width: '100%',
  },
  stepCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#1f2937',
    borderWidth: 2,
    borderColor: '#374151',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircleActive: {
    backgroundColor: '#f97316',
    borderColor: '#f97316',
  },
  historySection: {
    paddingBottom: 40,
  },
  historyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  historyIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#f9f9fb',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  historyInfo: {
    flex: 1,
  },
  historyStore: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 2,
  },
  historyMeta: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9ca3af',
  }
})
