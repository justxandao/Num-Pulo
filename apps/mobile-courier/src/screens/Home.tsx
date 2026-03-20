import React from 'react'
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native'
import { useAuth } from '../contexts/AuthContext'
import { LogOut, Package, MapPin, List } from 'lucide-react-native'

export default function Home() {
  const { user, signOut } = useAuth()

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

      <ScrollView contentContainerStyle={styles.content}>
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

        <View style={styles.emptyState}>
          <Package size={64} color="#334155" />
          <Text style={styles.emptyTitle}>Nenhuma entrega ativa</Text>
          <Text style={styles.emptySubtitle}>Fique de olho! Novos pedidos podem aparecer no Pulo.</Text>
        </View>

        <TouchableOpacity style={styles.actionButton}>
          <List size={20} color="#fff" />
          <Text style={styles.actionButtonText}>VER HISTÓRICO DE PEDIDOS</Text>
        </TouchableOpacity>
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
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 20,
    justifyContent: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#fff',
  },
  statLabel: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 4,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    backgroundColor: '#1e293b',
    borderRadius: 32,
    marginBottom: 24,
  },
  emptyTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    marginTop: 16,
  },
  emptySubtitle: {
    color: '#94a3b8',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 40,
  },
  actionButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1,
  }
})
