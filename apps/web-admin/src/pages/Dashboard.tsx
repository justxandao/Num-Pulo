import { useState, useEffect } from 'react'
import { 
  Users, 
  Store, 
  ShoppingBag, 
  TrendingUp, 
  LogOut, 
  LayoutDashboard,
  ChevronRight,
  Search,
  CheckCircle,
} from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import api from '../services/api'

export default function Dashboard() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [dashboardStats, setDashboardStats] = useState({
    users: 0,
    stores: 0,
    orders: 0,
    revenue: 0,
    pendingStores: [] as any[]
  })
  const [isInitialStatsLoading, setIsInitialStatsLoading] = useState(true)

  const fetchDashboardData = async () => {
    try {
      const [usersRes, storesRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/stores')
      ])
      
      const stores = storesRes.data.stores
      const pending = stores.filter((s: any) => s.status === 'PENDING')
      
      setDashboardStats({
        users: usersRes.data.users.length,
        stores: stores.length,
        orders: 543, // Mock até ter endpoint de ordens globais
        revenue: 12450.90,
        pendingStores: pending.slice(0, 3)
      })
    } catch (err) {
      console.error(err)
    } finally {
      setIsInitialStatsLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-80 bg-white border-r border-gray-100 flex flex-col sticky top-0 h-screen">
        <div className="p-10">
           <h1 className="text-2xl font-black text-primary-500 tracking-tighter transform -skew-x-12">ADMIN</h1>
        </div>

        <nav className="flex-1 px-6 space-y-2">
           <button 
             onClick={() => navigate('/')}
             className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl bg-gray-900 text-white font-black text-sm transition-all group"
           >
              <LayoutDashboard size={20} />
              <span>DASHBOARD</span>
              <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-500" />
           </button>
           <button 
             onClick={() => navigate('/stores')}
             className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-gray-400 font-bold text-sm hover:bg-gray-50 hover:text-gray-900 transition-all group"
           >
              <Store size={20} />
              <span>LOJAS</span>
           </button>
           <button className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-gray-400 font-bold text-sm hover:bg-gray-50 hover:text-gray-900 transition-all group">
              <Users size={20} />
              <span>USUÁRIOS</span>
           </button>
           <button className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-gray-400 font-bold text-sm hover:bg-gray-50 hover:text-gray-900 transition-all group">
              <ShoppingBag size={20} />
              <span>PEDIDOS</span>
           </button>
        </nav>

        <div className="p-6 mt-auto">
           <div className="bg-gray-50 rounded-3xl p-6 flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-primary-500 flex items-center justify-center text-white font-black text-xl">
                 {user?.name.charAt(0)}
              </div>
              <div className="flex-1 overflow-hidden">
                 <p className="text-sm font-black text-gray-900 truncate uppercase">{user?.name}</p>
                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Master Admin</p>
              </div>
           </div>
           <button 
             onClick={signOut}
             className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl border border-gray-100 text-gray-400 font-black text-xs hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all"
           >
              LOGOUT <LogOut size={16} />
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic transform -skew-x-6">Visão Geral</h2>
            <p className="text-gray-400 font-bold text-xs uppercase tracking-[0.2em] mt-2">Bem-vindo, {user?.name.split(' ')[0]}</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-white rounded-2xl px-6 py-3 border border-gray-100 flex items-center gap-4 shadow-sm">
               <Search size={18} color="#9ca3af" />
               <input type="text" placeholder="Busca global..." className="bg-transparent border-none outline-none text-sm font-bold text-gray-900 w-48 placeholder:text-gray-300" />
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { label: 'USUÁRIOS ATIVOS', value: dashboardStats.users, icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
            { label: 'LOJAS PARCEIRAS', value: dashboardStats.stores, icon: Store, color: 'text-emerald-500', bg: 'bg-emerald-50' },
            { label: 'TOTAL PEDIDOS', value: dashboardStats.orders, icon: ShoppingBag, color: 'text-purple-500', bg: 'bg-purple-50' },
            { label: 'VALOR TRANSACIONADO', value: `R$ ${dashboardStats.revenue.toLocaleString('pt-BR')}`, icon: TrendingUp, color: 'text-primary-500', bg: 'bg-primary-50' }
          ].map((item, i) => (
            <div key={i} className={`bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all group ${isInitialStatsLoading ? 'animate-pulse opacity-50' : ''}`}>
              <div className="flex justify-between items-start mb-6">
                <div className={`p-4 rounded-2xl ${item.bg} ${item.color}`}>
                  <item.icon size={24} />
                </div>
                <div className="flex items-center gap-1 text-emerald-500 text-[10px] font-black">
                   <CheckCircle size={12} /> +12%
                </div>
              </div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{item.label}</p>
              <p className="text-2xl font-black text-gray-900 tracking-tighter">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
           {/* Recent Stores / Pending Approval */}
           <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-10 border border-gray-100">
              <div className="flex justify-between items-center mb-10">
                 <h3 className="text-xl font-black text-gray-900 tracking-tighter uppercase italic transform -skew-x-6">Lojas Pendentes</h3>
                 <Link to="/stores" className="text-primary-500 text-xs font-black uppercase tracking-widest hover:underline">Ver Todas</Link>
              </div>
              
              <div className="space-y-4">
                 {dashboardStats.pendingStores.length === 0 ? (
                    <p className="text-gray-400 font-bold italic text-center py-10 uppercase text-xs">Nenhuma loja aguardando aprovação</p>
                 ) : dashboardStats.pendingStores.map((store: any, i: number) => (
                    <div key={i} className="flex items-center gap-6 p-6 rounded-3xl border border-gray-50 hover:border-gray-100 transition-all group cursor-pointer" onClick={() => navigate('/stores')}>
                       <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                          {store.name.toLowerCase().includes('pizza') ? '🍕' : '🍔'}
                       </div>
                       <div className="flex-1">
                          <h4 className="font-black text-gray-900 text-lg tracking-tight uppercase italic">{store.name}</h4>
                          <p className="text-xs text-gray-400 font-bold uppercase tracking-tight mt-1">{store.owner?.name} • {store.owner?.email}</p>
                       </div>
                       <div className="flex gap-2">
                          <ChevronRight size={20} className="text-gray-300 group-hover:text-primary-500 transition-all" />
                       </div>
                    </div>
                 ))}
              </div>
           </div>

           {/* Global Feed */}
           <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100">
              <h3 className="text-xl font-black text-gray-900 tracking-tighter uppercase italic transform -skew-x-6 mb-10">Atividade Global</h3>
              <div className="space-y-8">
                 {[1, 2, 3, 4].map((_, i) => (
                    <div key={i} className="flex gap-4 relative">
                       {i < 3 && <div className="absolute left-[11px] top-8 w-0.5 h-10 bg-gray-100" />}
                       <div className="w-6 h-6 rounded-full bg-primary-50 border-2 border-white shadow-sm flex items-center justify-center relative z-10">
                          <div className="w-2 h-2 rounded-full bg-primary-500" />
                       </div>
                       <div className="flex-1">
                          <p className="text-xs font-bold text-gray-900 leading-relaxed">Novo pedido realizado em <span className="text-primary-500 font-black italic transform -skew-x-3">Burger do Zé</span> por Alex Souza</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">HÁ 2 MINUTOS</p>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </main>
    </div>
  )
}
