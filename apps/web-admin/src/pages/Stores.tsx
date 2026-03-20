import { useState, useEffect } from 'react'
import { 
  Store, 
  LayoutDashboard,
  LogOut
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import api from '../services/api'

export default function Stores() {
  const { signOut } = useAuth()
  const [stores, setStores] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchStores = async () => {
    try {
      const response = await api.get('/admin/stores')
      setStores(response.data.stores)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStores()
  }, [])

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await api.patch(`/admin/stores/${id}/status`, { status })
      fetchStores()
    } catch (err) {
      alert('Erro ao atualizar status da loja.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Reusing Sidebar pattern from Dashboard for consistency */}
      <aside className="w-80 bg-white border-r border-gray-100 flex flex-col sticky top-0 h-screen">
        <div className="p-10">
           <h1 className="text-2xl font-black text-primary-500 tracking-tighter transform -skew-x-12">ADMIN</h1>
        </div>

        <nav className="flex-1 px-6 space-y-2">
           <a href="/" className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-gray-400 font-bold text-sm hover:bg-gray-50 hover:text-gray-900 transition-all group">
              <LayoutDashboard size={20} />
              <span>DASHBOARD</span>
           </a>
           <button className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl bg-gray-900 text-white font-black text-sm transition-all group">
              <Store size={20} />
              <span>LOJAS</span>
              <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-500" />
           </button>
        </nav>

        <div className="p-6 mt-auto">
           <button 
             onClick={signOut}
             className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl border border-gray-100 text-gray-400 font-black text-xs hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all"
           >
              LOGOUT <LogOut size={16} />
           </button>
        </div>
      </aside>

      <main className="flex-1 p-10">
        <header className="mb-10">
           <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic transform -skew-x-6">Gestão de Lojas</h2>
           <p className="text-gray-400 font-bold text-xs uppercase tracking-[0.2em] mt-2">Aprove ou bloqueie parceiros da plataforma</p>
        </header>

        <div className="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm">
           <table className="w-full text-left">
              <thead>
                 <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Loja</th>
                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Proprietário</th>
                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Ações</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                 {loading ? (
                    <tr>
                       <td colSpan={4} className="px-8 py-10 text-center text-gray-400 font-bold italic">Carregando lojas...</td>
                    </tr>
                 ) : stores.map((store) => (
                    <tr key={store.id} className="hover:bg-gray-50/50 transition-all">
                       <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                             <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-xl">
                                {store.name.toLowerCase().includes('pizza') ? '🍕' : '🍔'}
                             </div>
                             <div>
                                <p className="font-black text-gray-900 uppercase italic transform -skew-x-3">{store.name}</p>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">{store.isOpen ? 'Atualmente Aberta' : 'Atualmente Fechada'}</p>
                             </div>
                          </div>
                       </td>
                       <td className="px-8 py-6">
                          <p className="font-bold text-gray-600">{store.owner?.name}</p>
                          <p className="text-[10px] text-gray-400">{store.owner?.email}</p>
                       </td>
                       <td className="px-8 py-6">
                          <span className={`
                             px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest
                             ${store.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600' : ''}
                             ${store.status === 'PENDING' ? 'bg-amber-50 text-amber-600' : ''}
                             ${store.status === 'BLOCKED' ? 'bg-red-50 text-red-600' : ''}
                          `}>
                             {store.status === 'APPROVED' ? 'APROVADA' : ''}
                             {store.status === 'PENDING' ? 'PENDENTE' : ''}
                             {store.status === 'BLOCKED' ? 'BLOQUEADA' : ''}
                          </span>
                       </td>
                       <td className="px-8 py-6">
                          <div className="flex gap-2">
                             {store.status !== 'APPROVED' && (
                                <button 
                                  onClick={() => handleUpdateStatus(store.id, 'APPROVED')}
                                  className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-600 font-black text-[10px] hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
                                >
                                   APROVAR
                                </button>
                             )}
                             {store.status !== 'BLOCKED' && (
                                <button 
                                  onClick={() => handleUpdateStatus(store.id, 'BLOCKED')}
                                  className="px-4 py-2 rounded-xl bg-red-50 text-red-600 font-black text-[10px] hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                >
                                   BLOQUEAR
                                </button>
                             )}
                          </div>
                       </td>
                    </tr>
                 ))}
              </tbody>
           </table>
        </div>
      </main>
    </div>
  )
}
