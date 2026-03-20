import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { ActivityIndicator, View } from 'react-native'

import { AuthProvider, useAuth } from './src/contexts/AuthContext'
import { CartProvider } from './src/contexts/CartContext'

import Login from './src/screens/Login'
import Home from './src/screens/Home'
import StoreDetail from './src/screens/StoreDetail'
import Checkout from './src/screens/Checkout'
import Orders from './src/screens/Orders'

const Stack = createStackNavigator()

function AppContent() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#f97316" />
      </View>
    )
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <Stack.Screen name="Login" component={Login} />
        ) : (
          <>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="StoreDetail" component={StoreDetail} />
            <Stack.Screen name="Checkout" component={Checkout} />
            <Stack.Screen name="Orders" component={Orders} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
        <StatusBar style="dark" />
      </CartProvider>
    </AuthProvider>
  )
}
