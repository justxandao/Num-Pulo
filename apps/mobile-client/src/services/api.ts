import axios from 'axios'
import * as SecureStore from 'expo-secure-store'

// Nota: Use o seu IP local se estiver testando em dispositivo físico
// 10.0.2.2 é o alias para localhost no emulador Android
const API_URL = 'http://10.0.2.2:3000'

const api = axios.create({
  baseURL: API_URL
})

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('num-pulo:token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
