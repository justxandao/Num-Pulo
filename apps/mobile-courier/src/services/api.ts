import axios from 'axios'
import * as SecureStore from 'expo-secure-store'

// Nota: 10.0.2.2 é o alias para localhost no emulador Android
// Para iOS ou dispositivo físico, use o IP da sua máquina
const API_URL = 'http://10.0.2.2:3000/api/v1'

const api = axios.create({
  baseURL: API_URL
})

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('num-pulo:courier:token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
