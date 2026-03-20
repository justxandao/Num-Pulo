import React, { useState } from 'react'
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native'
import { ArrowLeft, CheckCircle2, ShoppingBag, Banknote } from 'lucide-react-native'
import api from '../services/api'
import { useCart } from '../contexts/CartContext'

export default function Checkout({ navigation }: any) {
  const { items, total, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleCheckout = async () => {
    if (items.length === 0) return
    setLoading(true)
    try {
      await api.post('/orders', {
        storeId: items[0].storeId,
        items: items.map(i => ({
          productId: i.id,
          quantity: i.quantity
        }))
      })
      setSuccess(true)
      clearCart()
      setTimeout(() => {
        navigation.navigate('Orders')
      }, 3000)
    } catch (err) {
      alert('Erro ao finalizar pedido. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <View style={styles.successContainer}>
        <View style={styles.successIcon}>
          <CheckCircle2 size={60} color="#10b981" />
        </View>
        <Text style={styles.successTitle}>PEDIDO REALIZADO!</Text>
        <Text style={styles.successSubtitle}>Agora é só relaxar que o lojista já está preparando.</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Finalizar Pedido</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ShoppingBag size={20} color="#f97316" />
            <Text style={styles.sectionTitle}>Revisar Itens</Text>
          </View>
          <View style={styles.itemList}>
            {items.map(item => (
              <View key={item.id} style={styles.itemRow}>
                <Text style={styles.itemQuantity}>{item.quantity}x</Text>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>R$ {(Number(item.price) * item.quantity).toFixed(2).replace('.', ',')}</Text>
              </View>
            ))}
          </View>
          <View style={styles.totalRow}>
             <Text style={styles.totalLabel}>TOTAL</Text>
             <Text style={styles.totalValue}>R$ {total.toFixed(2).replace('.', ',')}</Text>
          </View>
        </View>

        <View style={styles.section}>
           <Text style={styles.sectionTitle}>Pagamento</Text>
           <View style={styles.paymentMethod}>
              <Banknote size={24} color="#f97316" />
              <View>
                 <Text style={styles.paymentName}>Dinheiro / Pix</Text>
                 <Text style={styles.paymentMeta}>Na entrega</Text>
              </View>
           </View>
        </View>
      </ScrollView>

      <TouchableOpacity 
        style={styles.payButton}
        onPress={handleCheckout}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.payButtonText}>REALIZAR PEDIDO</Text>
        )}
      </TouchableOpacity>
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
  section: {
    marginBottom: 32,
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#111827',
    textTransform: 'uppercase',
  },
  itemList: {
    gap: 12,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemQuantity: {
    fontSize: 12,
    fontWeight: '900',
    color: '#f97316',
    width: 30,
  },
  itemName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '900',
    color: '#111827',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    marginTop: 20,
    paddingTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: '#9ca3af',
  },
  totalValue: {
    fontSize: 24,
    fontWeight: '900',
    color: '#111827',
    transform: [{ skewX: '-6deg' }],
  },
  paymentMethod: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: '#f9f9fb',
    padding: 20,
    borderRadius: 20,
  },
  paymentName: {
    fontSize: 14,
    fontWeight: '900',
    color: '#111827',
  },
  paymentMeta: {
    fontSize: 10,
    fontWeight: '800',
    color: '#f97316',
    textTransform: 'uppercase',
  },
  payButton: {
    backgroundColor: '#111827',
    margin: 20,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
  },
  payButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 2,
  },
  successContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  successIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#ecfdf5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#111827',
    marginBottom: 12,
    textAlign: 'center',
    transform: [{ skewX: '-6deg' }],
  },
  successSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 22,
  }
})
