import { useState } from 'react'
import { Bell, Search, Menu, Package, LayoutGrid, Clock, CheckCircle2, XCircle, LogOut } from 'lucide-react'

// Mock Data
const orders = [
  { id: '1042', customer: 'João Silva', items: '1x Pizza de Calabresa, 1x Guaraná 2L', total: 'R$ 65,00', status: 'pending', time: '10 min atrás' },
  { id: '1043', customer: 'Maria Oliveira', items: '2x X-Bacon, 1x Fritas M', total: 'R$ 54,90', status: 'preparing', time: '5 min atrás' },
  { id: '1041', customer: 'Carlos Mendes', items: '1x Combo Casal Sushi', total: 'R$ 120,00', status: 'ready', time: '20 min atrás' }
]

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('orders')

  return (
    <div className="min-h-screen bg-merchant-100 flex flex-col md:flex-row">
      {/* Sidebar (Desktop) */}
      <aside className="w-64 bg-merchant-900 text-merchant-100 hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-merchant-800">
          <div className="flex items-center gap-2 text-xl font-black">
            <div className="w-6 h-6 rounded bg-primary-500 text-white flex items-center justify-center text-xs -skew-x-12">NP</div>
            Menu <span className="text-gray-400 font-medium">Lojista</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors \${activeTab === 'orders' ? 'bg-primary-500 text-white' : 'text-gray-400 hover:bg-merchant-800 hover:text-white'}`}
          >
            <Clock className="w-5 h-5" /> Pedidos
            <span className="ml-auto bg-white/20 px-2 py-0.5 rounded text-xs">2</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('catalog')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors \${activeTab === 'catalog' ? 'bg-primary-500 text-white' : 'text-gray-400 hover:bg-merchant-800 hover:text-white'}`}
          >
            <LayoutGrid className="w-5 h-5" /> Cardápio
          </button>
        </nav>

        <div className="p-4 border-t border-merchant-800">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-gray-400 hover:text-red-400 hover:bg-merchant-800 transition-colors">
            <LogOut className="w-5 h-5" /> Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-gray-500">
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-lg font-bold text-merchant-900">Gestão de Pedidos (Live)</h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <span className="text-emerald-600 hidden sm:block">Loja Aberta</span>
            </div>
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-6 overflow-auto">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 border-l-4 border-l-yellow-500">
              <div className="w-12 h-12 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-500">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Novos (Aceitar)</p>
                <h3 className="text-2xl font-bold text-gray-900">1</h3>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 border-l-4 border-l-blue-500">
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Em Preparo</p>
                <h3 className="text-2xl font-bold text-gray-900">1</h3>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 border-l-4 border-l-emerald-500">
              <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Prontos</p>
                <h3 className="text-2xl font-bold text-gray-900">1</h3>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-bold text-gray-800">Fila de Pedidos</h3>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="Buscar pedido #..." className="pl-9 pr-4 py-1.5 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
            </div>

            <div className="divide-y divide-gray-100">
              {orders.map(order => (
                <div key={order.id} className="p-6 hover:bg-gray-50/50 transition-colors flex flex-col md:flex-row gap-6 md:items-center justify-between">
                  <div className="flex gap-4 items-start">
                    <div className={`p-3 rounded-lg font-bold text-xl 
                      \${order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : ''}
                      \${order.status === 'preparing' ? 'bg-blue-100 text-blue-700' : ''}
                      \${order.status === 'ready' ? 'bg-emerald-100 text-emerald-700' : ''}
                    `}>
                      #{order.id}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 flex items-center gap-2">
                        {order.customer} 
                        <span className="text-xs font-medium px-2 py-0.5 bg-gray-100 text-gray-500 rounded">{order.time}</span>
                      </h4>
                      <p className="text-sm text-gray-500 mt-1 max-w-md">{order.items}</p>
                      <p className="font-bold text-gray-900 mt-1">{order.total}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 w-full md:w-auto mt-4 md:mt-0">
                    {order.status === 'pending' && (
                      <>
                        <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-xl transition-colors shadow-sm shadow-primary-500/20">
                          <CheckCircle2 className="w-5 h-5" /> Aceitar
                        </button>
                        <button className="flex-1 md:flex-none px-5 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl transition-colors">
                          Recusar
                        </button>
                      </>
                    )}
                    {order.status === 'preparing' && (
                      <button className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-colors shadow-sm shadow-emerald-500/20">
                        <Package className="w-5 h-5" /> Marcar como Pronto
                      </button>
                    )}
                    {order.status === 'ready' && (
                      <div className="w-full md:w-auto flex flex-col items-center justify-center px-5 py-2.5 bg-gray-100 text-gray-500 font-bold rounded-xl border border-gray-200 border-dashed">
                        <span className="text-xs">Aguardando Entregador...</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
