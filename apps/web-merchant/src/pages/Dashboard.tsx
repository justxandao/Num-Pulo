import { useState, useEffect } from 'react'
import { 
  ShoppingBag, 
  Package, 
  Store, 
  Settings, 
  LogOut, 
  Clock, 
  Bell, 
  Plus,
  ChevronRight,
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useSocket } from '../hooks/useSocket'
import api from '../services/api'
import Products from './Products'

export default function Dashboard() {
  const { user, signOut } = useAuth()
  const { onEvent } = useSocket()
  
  const [activeTab, setActiveTab] = useState('orders')
  const [stores, setStores] = useState<any[]>([])
  const [selectedStore, setSelectedStore] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [newOrderAlert, setNewOrderAlert] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const loadStores = async () => {
    try {
      const response = await api.get('/stores/my')
      setStores(response.data.stores)
      if (response.data.stores.length > 0) {
        setSelectedStore(response.data.stores[0])
      }
    } catch (err) {
      console.error('Erro ao carregar lojas', err)
    } finally {
      setLoading(false)
    }
  }

  const loadOrders = async (storeId: string) => {
    setOrdersLoading(true)
    try {
      const response = await api.get(`/orders/store/${storeId}`)
      setOrders(response.data.orders)
    } catch (err) {
      console.error('Erro ao carregar pedidos', err)
    } finally {
      setOrdersLoading(false)
    }
  }

  useEffect(() => {
    loadStores()
  }, [])

  useEffect(() => {
    if (selectedStore) {
      loadOrders(selectedStore.id)
    }
  }, [selectedStore])

  useEffect(() => {
    const cleanup = onEvent('order:new', (data: any) => {
      setNewOrderAlert(true)
      if (selectedStore && data.storeId === selectedStore.id) {
         loadOrders(selectedStore.id)
      }
    })
    return cleanup
  }, [onEvent, selectedStore])

  const handleStatusUpdate = async (orderId: string, status: string) => {
    setActionLoading(orderId)
    try {
      await api.patch(`/orders/${orderId}/status`, { status })
      await loadOrders(selectedStore!.id)
    } catch (err) {
      console.error('Erro ao atualizar status', err)
    } finally {
      setActionLoading(null)
    }
  }

  const handleToggleStoreStatus = async () => {
    if (!selectedStore) return
    const newStatus = !selectedStore.isOpen
    try {
      const response = await api.patch(`/stores/${selectedStore.id}`, { isOpen: newStatus })
      setSelectedStore(response.data.store)
    } catch (err) {
      console.error('Erro ao alternar status da loja', err)
    }
  }

  const getStatusInfo = (status: string) => {
    switch(status) {
      case 'PENDING': return { text: 'Pendente', color: 'bg-orange-50 text-orange-600 border-orange-100', next: 'ACCEPTED', nextLabel: 'Aceitar' }
      case 'ACCEPTED': return { text: 'Aceito', color: 'bg-blue-50 text-blue-600 border-blue-100', next: 'PREPARING', nextLabel: 'Preparar' }
      case 'PREPARING': return { text: 'Em Preparo', color: 'bg-yellow-50 text-yellow-600 border-yellow-100', next: 'DISPATCHED', nextLabel: 'Despachar' }
      case 'DISPATCHED': return { text: 'Saiu p/ Entrega', color: 'bg-purple-50 text-purple-600 border-purple-100', next: 'DELIVERED', nextLabel: 'Entregar' }
      case 'DELIVERED': return { text: 'Entregue', color: 'bg-green-50 text-green-600 border-green-100', next: null, nextLabel: '' }
      default: return { text: status, color: 'bg-gray-50 text-gray-500 border-gray-100', next: null, nextLabel: '' }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-400 font-bold uppercase tracking-widest animate-pulse">
        Carregando painel operacional...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col sticky top-0 h-screen overflow-hidden">
        <div className="p-8 pb-4">
          <div className="flex items-center gap-2 text-xl font-black text-slate-900 tracking-tighter italic transform -skew-x-12">
            <div className="w-8 h-8 rounded-lg bg-orange-500 text-white flex items-center justify-center text-sm">NP</div>
            <span>PANEL</span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2">
          {[
            { id: 'orders', icon: ShoppingBag, label: 'Pedidos Ativos' },
            { id: 'products', icon: Package, label: 'Cardápio' },
            { id: 'config', icon: Settings, label: 'Configurações' }
          ].map((tab) => (
             <button 
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); if (tab.id === 'orders') setNewOrderAlert(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-black text-sm uppercase tracking-tighter transition-all group ${activeTab === tab.id ? 'bg-orange-500 text-white shadow-xl shadow-orange-500/20' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`}
              >
                <tab.icon className={`w-5 h-5 transition-transform group-hover:-skew-x-12 ${activeTab === tab.id ? 'text-white' : 'text-slate-300'}`} />
                {tab.label}
                {tab.id === 'orders' && newOrderAlert && <div className="ml-auto w-2 h-2 rounded-full bg-white animate-pulse" />}
             </button>
          ))}
        </nav>

        <div className="p-4 mt-auto">
          <div className="bg-slate-900 rounded-[2rem] p-5 text-white shadow-2xl shadow-slate-900/40">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-500 flex items-center justify-center text-xl font-black transform -rotate-6">
                {user?.name.charAt(0)}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="font-black truncate tracking-tighter uppercase whitespace-nowrap">{user?.name}</p>
                <p className="text-[10px] text-orange-500 font-bold uppercase tracking-widest truncate">{selectedStore?.name || 'Sem Loja'}</p>
              </div>
            </div>
            <button 
              onClick={signOut}
              className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/5"
            >
              <LogOut className="w-3 h-3 text-orange-500" /> Encerrar Sessão
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-24 bg-white/80 backdrop-blur-md border-b border-slate-200 px-12 flex items-center justify-between sticky top-0 z-40">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic transform -skew-x-6">
              {activeTab === 'orders' ? 'PEDIDOS ATIVOS' : activeTab === 'products' ? 'GESTÃO DE CARDÁPIO' : 'CONFIGURAÇÕES'}
            </h1>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">
              Foco na operação: minimize erros, maximize entregas.
            </p>
          </div>

          <div className="flex items-center gap-6">
             {selectedStore && (
               <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border-2 transition-all ${selectedStore.isOpen ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                  <div className={`w-2 h-2 rounded-full ${selectedStore.isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                  {selectedStore.isOpen ? 'Loja aberta' : 'Loja fechada'}
               </div>
             )}
             <button onClick={() => setNewOrderAlert(false)} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl relative transition-all group">
                <Bell className="w-6 h-6 text-slate-400 group-hover:text-slate-900 group-hover:rotate-12 transition-all" />
                {newOrderAlert && <div className="absolute top-2.5 right-2.5 w-3 h-3 bg-orange-500 border-2 border-white rounded-full animate-ping" />}
             </button>
          </div>
        </header>

        <div className="p-12">
          {!selectedStore ? (
            <div className="bg-white rounded-[3rem] p-16 text-center border-4 border-dashed border-slate-100 max-w-2xl mx-auto mt-10">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 text-slate-200">
                <Store className="w-12 h-12" />
              </div>
              <h2 className="text-3xl font-black mb-2 text-slate-900 tracking-tighter uppercase italic">Operação Inativa</h2>
              <p className="text-slate-400 font-bold text-sm mb-10 px-8 uppercase tracking-tight leading-relaxed">Você ainda não possui uma loja configurada. Crie agora sua vitrine digital.</p>
              <button className="bg-orange-500 text-white px-10 py-5 rounded-[2rem] font-black flex items-center gap-4 mx-auto shadow-2xl shadow-orange-500/30 hover:scale-105 active:scale-95 transition-all text-sm uppercase tracking-widest">
                 <Plus className="w-6 h-6" /> Abrir Minha Primeira Loja
              </button>
            </div>
          ) : activeTab === 'products' ? (
            <Products storeId={selectedStore.id} />
          ) : activeTab === 'orders' ? (
            <div className="space-y-8">
              {ordersLoading && orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 opacity-20 filter grayscale">
                   <Loader2 className="w-12 h-12 animate-spin mb-4" />
                   <p className="font-black uppercase tracking-widest text-xs">Sincronizando operação...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-32 bg-white rounded-[3rem] border border-slate-200">
                   <div className="text-5xl mb-6">😴</div>
                   <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic">Nenhum pedido no momento</h3>
                   <p className="text-slate-400 font-bold text-xs mt-2 uppercase tracking-widest">Sua cozinha está em silêncio. Que tal uma promoção?</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-8">
                  {orders.map(order => {
                    const status = getStatusInfo(order.status)
                    return (
                      <div key={order.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 hover:shadow-2xl hover:shadow-orange-100/50 transition-all flex flex-col group overflow-hidden relative">
                         {order.status === 'PENDING' && (
                             <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100 rotate-45 translate-x-16 -translate-y-16 opacity-50 pointer-events-none" />
                         )}
                         
                         <div className="flex justify-between items-start mb-8 relative z-10">
                           <div>
                              <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest bg-orange-50 px-3 py-1.5 rounded-full border border-orange-100">#{order.id.slice(-4).toUpperCase()}</span>
                              <h3 className="text-2xl font-black text-slate-900 mt-4 tracking-tighter italic transform -skew-x-6">{order.customer?.name || 'Cliente'}</h3>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 flex items-center gap-2">
                                <Clock className="w-3 h-3" /> Recebido há {Math.floor((new Date().getTime() - new Date(order.createdAt).getTime()) / 60000)} min
                              </p>
                           </div>
                           <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border-2 ${status.color}`}>
                              {status.text}
                           </div>
                         </div>
                         
                         <div className="space-y-4 mb-10 flex-1 relative z-10">
                            {order.items.map((item: any) => (
                              <div key={item.id} className="flex justify-between items-center text-sm border-b border-slate-50 pb-3 last:border-0">
                                 <div className="flex items-center gap-3">
                                    <span className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center font-black text-xs text-slate-400 border border-slate-100">{item.quantity}x</span>
                                    <span className="text-slate-900 font-bold tracking-tight">{item.product?.name || 'Produto'}</span>
                                 </div>
                                 <span className="text-slate-900 font-black tracking-tight text-xs">R$ {(Number(item.price) * item.quantity).toFixed(2).replace('.', ',')}</span>
                              </div>
                            ))}
                         </div>

                         <div className="flex justify-between items-center mb-8 px-2">
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Total Líquido</span>
                            <span className="text-2xl font-black text-slate-900">R$ {Number(order.totalAmount).toFixed(2).replace('.', ',')}</span>
                         </div>

                         <div className="flex gap-4 relative z-10">
                            {status.next && (
                              <button 
                                onClick={() => handleStatusUpdate(order.id, status.next!)}
                                disabled={actionLoading === order.id}
                                className="flex-1 bg-slate-900 text-white py-5 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 hover:scale-[1.02] active:scale-95 disabled:opacity-50 transition-all shadow-xl shadow-slate-900/20 flex items-center justify-center gap-2"
                              >
                                {actionLoading === order.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <>{status.nextLabel} <ChevronRight className="w-4 h-4" /></>}
                              </button>
                            )}
                            <button className="px-6 bg-slate-50 text-slate-400 hover:text-slate-900 py-5 rounded-3xl font-black text-xs uppercase tracking-widest transition-all hover:bg-slate-100">
                               Recibo
                            </button>
                         </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          ) : (
            <div className="max-w-4xl">
               <div className="bg-white p-12 rounded-[3.5rem] border border-slate-200 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50 -translate-y-32 translate-x-32 rounded-full opacity-50" />
                  
                  <h2 className="text-3xl font-black text-slate-900 mb-10 tracking-tighter italic uppercase transform -skew-x-6 relative z-10 flex items-center gap-4">
                     <AlertCircle className="w-8 h-8 text-orange-500" /> Painel da Loja
                  </h2>

                  <div className="space-y-10 relative z-10">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-4">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Status da Operação</label>
                           <div 
                              onClick={handleToggleStoreStatus}
                              className={`p-6 rounded-3xl border-2 transition-all cursor-pointer flex items-center justify-between group ${selectedStore.isOpen ? 'bg-emerald-50 border-emerald-500' : 'bg-red-50 border-red-500'}`}
                           >
                              <div>
                                 <p className={`text-xl font-black italic tracking-tighter uppercase ${selectedStore.isOpen ? 'text-emerald-700' : 'text-red-700'}`}>{selectedStore.isOpen ? 'LOJA ABERTA' : 'LOJA FECHADA'}</p>
                                 <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tight italic">Clique para alternar o status</p>
                              </div>
                              <div className={`w-14 h-8 rounded-full p-1 relative transition-colors ${selectedStore.isOpen ? 'bg-emerald-500' : 'bg-red-500'}`}>
                                 <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform ${selectedStore.isOpen ? 'translate-x-6' : 'translate-x-0'}`} />
                              </div>
                           </div>
                        </div>

                        <div className="space-y-4 opacity-50 grayscale cursor-not-allowed">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 text-slate-300">Horário de Pico</label>
                           <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-between">
                              <span className="font-black text-slate-200 uppercase tracking-tighter italic">MODO TURBO</span>
                              <span className="text-[10px] font-black text-slate-200 bg-white px-3 py-1 rounded-full border border-slate-100">EM BREVE</span>
                           </div>
                        </div>
                     </div>

                     <div className="pt-10 border-t border-slate-100 space-y-8">
                        <div>
                           <h3 className="text-lg font-black text-slate-900 tracking-tighter italic uppercase flex items-center gap-2 mb-6">
                              <Settings className="w-5 h-5 text-slate-400" /> Informações do Negócio
                           </h3>
                           <div className="space-y-6">
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Identidade da Loja</label>
                                 <input 
                                    type="text" 
                                    value={selectedStore.name}
                                    readOnly
                                    className="w-full bg-slate-50 border-0 rounded-2xl p-5 font-bold text-slate-400 text-sm cursor-not-allowed uppercase tracking-tighter"
                                 />
                                 <p className="text-[9px] font-bold text-slate-300 ml-1 uppercase">Para alterar o nome legal, contate o suporte.</p>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="mt-8 flex gap-4">
                   <div className="flex-1 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between group cursor-pointer hover:border-orange-500 transition-all">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-orange-50 group-hover:text-orange-500 transition-all"><Plus className="w-6 h-6" /></div>
                         <p className="font-black text-xs uppercase tracking-widest text-slate-900">Configurar Pagamento</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-300" />
                   </div>
                   <div className="flex-1 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between group cursor-pointer hover:border-orange-500 transition-all">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-orange-50 group-hover:text-orange-500 transition-all"><CheckCircle className="w-6 h-6" /></div>
                         <p className="font-black text-xs uppercase tracking-widest text-slate-900">Verificar Histórico</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-300" />
                   </div>
               </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
