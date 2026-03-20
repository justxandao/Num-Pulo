import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Clock, ShoppingBag, ChevronRight, CheckCircle2, Package, Truck, Loader2, Search, User } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useSocket } from '../hooks/useSocket'
import api from '../services/api'

export default function Orders() {
  const { user } = useAuth()
  const { onEvent } = useSocket()
  const navigate = useNavigate()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders/my')
      setOrders(response.data.orders)
    } catch (err) {
      console.error('Erro ao buscar pedidos', err)
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
      case 'CANCELED': return 'Cancelado'
      default: return status
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <Loader2 className="w-10 h-10 text-orange-500 animate-spin mb-4" />
        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Sincronizando seus pedidos...</p>
      </div>
    )
  }

  const activeOrders = orders.filter(o => o.status !== 'DELIVERED' && o.status !== 'CANCELED')
  const pastOrders = orders.filter(o => o.status === 'DELIVERED' || o.status === 'CANCELED')

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <header className="h-20 bg-white border-b border-gray-100 flex items-center px-6 sticky top-0 z-40 justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/app')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6 text-gray-900" />
          </button>
          <h1 className="text-xl font-black text-gray-900 tracking-tighter uppercase italic transform -skew-x-6">Meus Pedidos</h1>
        </div>
      </header>

      <main className="max-w-xl mx-auto p-4 space-y-8 mt-4">
        {/* Active Orders Section */}
        {activeOrders.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Acompanhamento em Tempo Real</h2>
            {activeOrders.map(order => {
              const step = getStatusStep(order.status)
              return (
                <div key={order.id} className="bg-white rounded-[2.5rem] p-8 border border-orange-100 shadow-xl shadow-orange-500/5 overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rotate-45 translate-x-16 -translate-y-16 opacity-30 pointer-events-none" />
                  
                  <div className="flex justify-between items-start mb-8">
                    <div>
                       <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest bg-orange-50 px-3 py-1 rounded-full border border-orange-100 mb-2 inline-block">#{order.id.slice(-4).toUpperCase()}</span>
                       <h3 className="text-xl font-black text-gray-900 tracking-tighter italic uppercase transform -skew-x-6">{order.store?.name}</h3>
                    </div>
                    <div className="text-right">
                       <p className="text-xs font-black text-gray-900 italic">R$ {Number(order.totalAmount).toFixed(2).replace('.', ',')}</p>
                       <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight mt-1">{order.items.length} {order.items.length === 1 ? 'item' : 'itens'}</p>
                    </div>
                  </div>

                  {/* Progress Road */}
                  <div className="relative mb-10 pt-4 px-2">
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 rounded-full" />
                    <div 
                      className="absolute top-1/2 left-0 h-1 bg-orange-500 -translate-y-1/2 rounded-full transition-all duration-1000 ease-out" 
                      style={{ width: `${((step - 1) / 4) * 100}%` }}
                    />
                    
                    <div className="relative flex justify-between">
                       {[
                         { s: 1, i: Clock },
                         { s: 2, i: CheckCircle2 },
                         { s: 3, i: Package },
                         { s: 4, i: Truck },
                         { s: 5, i: ShoppingBag }
                       ].map((icon, idx) => (
                         <div key={idx} className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${step >= icon.s ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/30 scale-110' : 'bg-white border-gray-100 text-gray-300'}`}>
                            <icon.i className="w-4 h-4" />
                         </div>
                       ))}
                    </div>
                  </div>

                  <div className="bg-orange-50 rounded-2xl p-4 flex items-center justify-between group border border-orange-100">
                     <p className="text-xs font-black text-orange-600 uppercase tracking-widest flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                        {getStatusText(order.status)}
                     </p>
                     <ChevronRight className="w-4 h-4 text-orange-300 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              )
            })}
          </section>
        )}

        {/* Categories / History */}
        <section className="space-y-4">
          <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Histórico Anterior</h2>
          {pastOrders.length === 0 ? (
            <div className="bg-white rounded-[2rem] p-12 text-center border border-gray-100">
               <ShoppingBag className="w-12 h-12 text-gray-100 mx-auto mb-4" />
               <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Nenhuma compra finalizada</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pastOrders.map(order => (
                <div key={order.id} className="bg-white rounded-3xl p-6 border border-gray-100 flex items-center justify-between hover:border-gray-200 transition-all cursor-pointer">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-xl grayscale opacity-50">
                         {order.store?.name.toLowerCase().includes('pizza') ? '🍕' : '🍔'}
                      </div>
                      <div>
                         <h4 className="font-black text-gray-900 tracking-tighter uppercase italic">{order.store?.name}</h4>
                         <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight mt-0.5">
                            {new Date(order.createdAt).toLocaleDateString('pt-BR')} • R$ {Number(order.totalAmount).toFixed(2).replace('.', ',')}
                         </p>
                      </div>
                   </div>
                   <div className="flex flex-col items-end">
                      <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-md mb-1 ${order.status === 'DELIVERED' ? 'bg-emerald-50 text-emerald-500 border border-emerald-100' : 'bg-red-50 text-red-500 border border-red-100'}`}>
                         {order.status === 'DELIVERED' ? 'CONCLUÍDO' : 'CANCELADO'}
                      </span>
                      <ChevronRight className="w-4 h-4 text-gray-300" />
                   </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Navigation */}
      <nav className="fixed bottom-0 w-full bg-white/80 backdrop-blur-md border-t border-gray-100 px-6 py-4 pb-10 z-50 flex justify-between items-center shadow-[0_-10px_30px_rgb(0,0,0,0.05)]">
        <Link to="/app" className="flex flex-col items-center gap-1.5 text-gray-300 hover:text-orange-500 transition-all group">
          <Search className="w-6 h-6 transition-transform group-hover:scale-110" />
          <span className="text-[8px] font-black uppercase tracking-widest">Descobrir</span>
        </Link>
        <Link to="/orders" className="flex flex-col items-center gap-1.5 text-orange-500 group">
          <ShoppingBag className="w-6 h-6 transition-transform group-hover:scale-110" />
          <span className="text-[8px] font-black uppercase tracking-widest">Pedidos</span>
          <div className="w-1 h-1 bg-orange-500 rounded-full mt-0.5" />
        </Link>
        <Link to="#" className="flex flex-col items-center gap-1.5 text-gray-300 hover:text-orange-500 transition-all group">
          <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200 transition-transform group-hover:scale-110">
             {user ? user.name.charAt(0) : <User className="w-4 h-4 text-gray-400" />}
          </div>
          <span className="text-[8px] font-black uppercase tracking-widest">Perfil</span>
        </Link>
      </nav>
    </div>
  )
}
