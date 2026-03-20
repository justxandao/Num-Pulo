import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, MapPin, Bell, ChevronDown, User, ShoppingBag, Loader2, Star } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useSocket } from '../hooks/useSocket'
import api from '../services/api'

const categories = [
  { id: '1', name: 'Mercados', icon: '🛒', color: 'bg-emerald-100/50 text-emerald-600' },
  { id: '2', name: 'Lanches', icon: '🍔', color: 'bg-yellow-100/50 text-yellow-600' },
  { id: '3', name: 'Pizzas', icon: '🍕', color: 'bg-orange-100/50 text-orange-600' },
  { id: '4', name: 'Doces', icon: '🍦', color: 'bg-pink-100/50 text-pink-600' },
  { id: '5', name: 'Bebidas', icon: '🍻', color: 'bg-purple-100/50 text-purple-600' }
]

export default function Dashboard() {
  const { user } = useAuth()
  const { onEvent } = useSocket()
  const [searchTerm, setSearchTerm] = useState('')
  const [stores, setStores] = useState<any[]>([])
  const [activeOrders, setActiveOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      const [storesRes, ordersRes] = await Promise.all([
        api.get('/stores'),
        api.get('/orders/my')
      ])
      setStores(storesRes.data.stores)
      const inProgress = ordersRes.data.orders.filter((o: any) => 
        o.status !== 'DELIVERED' && o.status !== 'CANCELED'
      )
      setActiveOrders(inProgress)
    } catch (err) {
      console.error('Erro ao buscar dados', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    const cleanup = onEvent('order:status', () => {
      fetchData()
    })
    return cleanup
  }, [onEvent])

  const filteredStores = stores.filter(store => 
    store.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Top App Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 md:hidden">
            <img src="/icone.svg" alt="Num Pulo" className="w-8 h-8" />
          </Link>
          
          <div className="hidden md:flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-3 py-1.5 rounded-lg transition-colors">
            <MapPin className="w-5 h-5 text-orange-500" />
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 font-medium leading-none">Entregar em</span>
              <span className="text-sm font-bold text-gray-900 leading-tight flex items-center gap-1">
                Localização Atual <ChevronDown className="w-4 h-4 text-gray-400" />
              </span>
            </div>
          </div>

          <div className="flex-1 max-w-xl">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
              </div>
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-4 py-2 bg-gray-100 border-transparent rounded-full text-gray-900 focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none md:text-sm text-base" 
                placeholder="Busque por restaurante ou prato"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors relative">
              <Bell className="w-6 h-6" />
            </button>
            <div className="w-9 h-9 bg-orange-500 rounded-full flex items-center justify-center border border-white shadow-sm ml-2 overflow-hidden cursor-pointer hover:scale-105 transition-all text-white font-bold text-sm">
              {user ? user.name.charAt(0) : <User className="w-5 h-5" />}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-5xl mx-auto w-full px-4 pt-6 pb-24 md:pb-8">
        {/* Mobile Address Banner */}
        <div className="md:hidden flex items-center gap-2 cursor-pointer bg-white p-3 rounded-xl shadow-sm border border-gray-100 mb-6 active:scale-[0.98] transition-transform">
          <MapPin className="w-5 h-5 text-orange-500" />
          <div className="flex flex-col flex-1">
            <span className="text-xs text-gray-500 font-medium">Entregar em</span>
            <span className="text-sm font-bold text-gray-900 truncate">Sua Localização</span>
          </div>
          <ChevronDown className="w-5 h-5 text-gray-400" />
        </div>

        {/* Active Order Banner */}
        {activeOrders.length > 0 && (
          <Link to="/orders" className="mb-8 block">
            <div className="bg-slate-900 rounded-[2rem] p-6 text-white shadow-2xl shadow-slate-900/20 flex items-center justify-between border border-white/5 group relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500 rotate-45 translate-x-16 -translate-y-16 opacity-10 pointer-events-none" />
               <div className="flex items-center gap-5 relative z-10">
                  <div className="w-14 h-14 bg-orange-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-500/20 transform -rotate-6 group-hover:rotate-0 transition-transform">
                     <ShoppingBag className="w-7 h-7" />
                  </div>
                  <div>
                     <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-1">Pedido em andamento</p>
                     <h3 className="text-xl font-black tracking-tighter uppercase italic">{activeOrders[0].store?.name}</h3>
                     <p className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-tight italic">Toque para acompanhar a entrega</p>
                  </div>
               </div>
               <div className="flex flex-col items-end gap-2 relative z-10">
                  <div className="flex gap-1">
                     {[1,2,3,4].map(i => (
                        <div key={i} className={`w-1.5 h-1.5 rounded-full ${i <= 2 ? 'bg-orange-500' : 'bg-slate-700'} animate-pulse`} />
                     ))}
                  </div>
                  <ChevronDown className="w-5 h-5 text-slate-500 -rotate-90 group-hover:translate-x-1 transition-transform" />
               </div>
            </div>
          </Link>
        )}

        {/* Categories Carousel */}
        <section className="mb-8 overflow-hidden">
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
            {categories.map((cat) => (
              <div key={cat.id} className="snap-start flex min-w-[80px] flex-col items-center gap-2 cursor-pointer group">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 transition-transform ${cat.color}`}>
                  {cat.icon}
                </div>
                <span className="text-xs font-bold text-gray-600 group-hover:text-orange-600 transition-colors uppercase tracking-tighter">{cat.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Promo Banner */}
        <section className="mb-10">
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl p-8 text-white shadow-xl shadow-orange-500/20 relative overflow-hidden flex justify-between items-center cursor-pointer hover:scale-[1.01] transition-transform">
            <div className="relative z-10">
              <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-black px-3 py-1 rounded-full mb-3 inline-block uppercase tracking-widest">Oferta da Semana</span>
              <h3 className="text-3xl font-black mb-1 leading-tight italic transform -skew-x-6">GANHE R$20 OFF</h3>
              <p className="text-orange-100 text-sm font-medium">Na sua primeira compra acima de R$50</p>
            </div>
            <div className="text-8xl absolute right-0 bottom-0 translate-x-4 translate-y-4 opacity-20 transform -rotate-12 select-none">🍔</div>
          </div>
        </section>

        {/* Feed / Restaurants */}
        <section>
          <div className="flex justify-between items-center mb-6 px-1">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Lojas perto de você</h2>
            <button className="text-orange-500 text-sm font-bold hover:underline">Ver todas</button>
          </div>

          {loading ? (
             <div className="flex flex-col items-center justify-center py-20 grayscale opacity-50">
                <Loader2 className="w-12 h-12 text-orange-500 animate-spin mb-4" />
                <p className="text-gray-400 font-bold">Procurando as melhores lojas...</p>
             </div>
          ) : filteredStores.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
               <div className="text-5xl mb-4">🔍</div>
               <h3 className="text-xl font-bold text-gray-900">Nenhuma loja encontrada</h3>
               <p className="text-gray-400 text-sm mt-1">Tente buscar por outro termo ou categoria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStores.map(store => (
                <Link to={`/store/${store.id}`} key={store.id} className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 hover:border-orange-200 hover:shadow-2xl hover:shadow-orange-100 transition-all flex flex-col gap-4 group cursor-pointer">
                  <div className="w-full h-40 bg-gray-50 rounded-2xl flex items-center justify-center text-4xl group-hover:scale-[1.02] transition-transform overflow-hidden relative border border-gray-50">
                     {store.name.toLowerCase().includes('pizza') ? '🍕' : store.name.toLowerCase().includes('burger') ? '🍔' : '🏪'}
                     {!store.isOpen && (
                         <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
                            <span className="bg-gray-900 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">Fechado</span>
                         </div>
                     )}
                  </div>
                  <div className="flex flex-col">
                    <div className="flex justify-between items-start">
                        <h3 className="font-black text-gray-900 text-xl leading-tight group-hover:text-orange-500 transition-colors">{store.name}</h3>
                        <span className="text-sm font-bold text-yellow-500 flex items-center gap-1"><Star className="w-4 h-4 fill-yellow-500" /> 4.9</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-400 mt-2">
                      <span className="bg-gray-100 px-2 py-1 rounded-md">20-30 min</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-200"></span>
                      <span className="text-emerald-500">Entrega Grátis</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 w-full bg-white border-t border-gray-100 px-6 py-3 pb-8 z-50 flex justify-between items-center shadow-[0_-4px_10px_rgb(0,0,0,0.05)]">
        <Link to="/app" className="flex flex-col items-center gap-1 text-orange-500">
          <Search className="w-6 h-6" />
          <span className="text-[10px] font-black uppercase tracking-tighter">Início</span>
        </Link>
        <Link to="/orders" className="flex flex-col items-center gap-1 text-gray-400 hover:text-orange-500 transition-colors">
          <ShoppingBag className="w-6 h-6" />
          <span className="text-[10px] font-black uppercase tracking-tighter">Pedidos</span>
        </Link>
        <Link to="#" className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-900 transition-colors">
          <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
             {user ? user.name.charAt(0) : <User className="w-4 h-4" />}
          </div>
          <span className="text-[10px] font-bold uppercase tracking-tighter">Perfil</span>
        </Link>
      </nav>
    </div>
  )
}
