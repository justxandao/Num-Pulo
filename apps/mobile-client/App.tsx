import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>NUM PULO</Text>
        <Text style={styles.subLogo}>Sua cidade, seu delivery.</Text>
      </View>
      
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.addressBar}>
          <Text style={styles.addressLabel}>Entregar em</Text>
          <Text style={styles.addressDesc}>Casa: R. Exemplo, 123</Text>
        </View>

        <Text style={styles.title}>O que vamos pedir hoje?</Text>
        
        <View style={styles.categories}>
          {['Lanches', 'Pizzas', 'Saudável', 'Açaí'].map((cat, i) => (
            <TouchableOpacity key={i} style={styles.catBox}>
              <Text style={styles.catText}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Lojas Perto de Você</Text>
        
        <View style={styles.restaurantCard}>
          <View style={styles.restImagePlaceholder} />
          <View>
            <Text style={styles.restName}>Pizzaria Exemplo</Text>
            <Text style={styles.restInfo}>⭐ 4.9 • 20-30 min • Custo Média R$30</Text>
          </View>
        </View>
      </ScrollView>
      <StatusBar style="light" backgroundColor="#ea580c" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  header: {
    padding: 24,
    backgroundColor: '#f97316',
    borderBottomWidth: 1,
    borderBottomColor: '#ea580c',
    alignItems: 'center',
    paddingTop: 48, // safearea mockup for visual standard
  },
  logo: {
    fontSize: 28,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: -1,
    transform: [{ skewX: '-10deg' }]
  },
  subLogo: {
    color: '#ffedd5',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 2
  },
  content: {
    padding: 16,
  },
  addressBar: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  addressLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '600'
  },
  addressDesc: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '700'
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 16,
    color: '#111827',
  },
  categories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  catBox: {
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  catText: {
    fontWeight: '700',
    color: '#4b5563',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 12,
    color: '#111827',
  },
  restaurantCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  restImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#fce7f3', // rosa claro
  },
  restName: {
    fontWeight: '800',
    fontSize: 16,
    color: '#111827',
    marginBottom: 4,
  },
  restInfo: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500'
  }
});
