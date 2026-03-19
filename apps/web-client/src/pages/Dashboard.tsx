import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, MapPin, Bell, ChevronDown, User, ShoppingBag } from 'lucide-react'

// Mock Data
const categories = [
  { id: 1, name: 'Mercados', icon: '🛒', color: 'bg-emerald-100/50 text-emerald-600' },
  { id: 2, name: 'Lanches', icon: '🍔', color: 'bg-yellow-100/50 text-yellow-600' },
  { id: 3, name: 'Pizzas', icon: '🍕', color: 'bg-primary-100/50 text-primary-600' },
  { id: 4, name: 'Farmácias', icon: '💊', color: 'bg-blue-100/50 text-blue-600' },
  { id: 5, name: 'Bebidas', icon: '🍻', color: 'bg-purple-100/50 text-purple-600' }
]

const restaurants = [
  { id: 1, name: 'Pizzaria do Zé', type: 'Pizza', time: '20-30 min', fee: 'Grátis', score: 4.9 },
  { id: 2, name: 'Burger House', type: 'Lanches', time: '15-25 min', fee: 'R$ 3,00', score: 4.8 },
  { id: 3, name: 'Açaí da Esquina', type: 'Doces', time: '10-20 min', fee: 'Grátis', score: 4.7 }
]

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Top App Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 md:hidden">
            <img src="/icone.svg" alt="Num Pulo" className="w-8 h-8" />
          </Link>
          
          <div className="hidden md:flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-3 py-1.5 rounded-lg transition-colors">
            <MapPin className="w-5 h-5 text-primary-500" />
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 font-medium leading-none">Entregar em</span>
              <span className="text-sm font-bold text-gray-900 leading-tight flex items-center gap-1">
                Rua das Flores, 123 <ChevronDown className="w-4 h-4 text-gray-400" />
              </span>
            </div>
          </div>

          <div className="flex-1 max-w-xl">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
              </div>
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-4 py-2 bg-gray-100 border-transparent rounded-full text-gray-900 focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none md:text-sm text-base" 
                placeholder="Busque por item ou loja"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors relative">
              <Bell className="w-6 h-6" />
              <span className="absolute top-1 right-2 w-2.5 h-2.5 bg-primary-500 border-2 border-white rounded-full"></span>
            </button>
            <div className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center border border-gray-300 ml-2 overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary-500 hover:ring-offset-2 transition-all">
              <User className="w-5 h-5 text-gray-500" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-5xl mx-auto w-full px-4 pt-6 pb-24 md:pb-8">
        {/* Mobile Address Banner */}
        <div className="md:hidden flex items-center gap-2 cursor-pointer bg-white p-3 rounded-xl shadow-sm border border-gray-100 mb-6 active:scale-[0.98] transition-transform">
          <MapPin className="w-5 h-5 text-primary-500" />
          <div className="flex flex-col flex-1">
            <span className="text-xs text-gray-500 font-medium">Entregar em</span>
            <span className="text-sm font-bold text-gray-900 truncate">Rua das Flores, 123</span>
          </div>
          <ChevronDown className="w-5 h-5 text-gray-400" />
        </div>

        {/* Categories Banner */}
        <section className="mb-8 overflow-hidden">
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
            {categories.map((cat) => (
              <div key={cat.id} className="snap-start flex min-w-[80px] flex-col items-center gap-2 cursor-pointer group">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-sm group-hover:scale-105 transition-transform \${cat.color}`}>
                  {cat.icon}
                </div>
                <span className="text-xs font-semibold text-gray-700 group-hover:text-primary-600 transition-colors">{cat.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Promo Wrapper */}
        <section className="mb-10">
          <div className="bg-gradient-to-r from-primary-600 to-primary-400 rounded-2xl p-6 text-white shadow-lg shadow-primary-500/20 relative overflow-hidden flex justify-between items-center cursor-pointer hover:shadow-primary-500/40 transition-shadow">
            <div className="relative z-10 w-2/3">
              <span className="bg-white/20 text-white text-xs font-bold px-2 py-1 rounded-md mb-2 inline-block">PROMOÇÃO</span>
              <h3 className="text-2xl font-black mb-1 leading-tight">Ganha até R$20 Off</h3>
              <p className="text-primary-100 text-sm">Em restaurantes selecionados</p>
            </div>
            <div className="text-6xl absolute right-0 translate-x-4 opacity-50 transform -rotate-12">🍔</div>
          </div>
        </section>

        {/* Feed / Restaurants */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4 px-1">Lojas perto de você</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {restaurants.map(rest => (
              <div key={rest.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:border-primary-200 hover:shadow-md cursor-pointer transition-all flex gap-4 group">
                <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center text-3xl group-hover:scale-105 transition-transform overflow-hidden shadow-inner">
                   {rest.type === 'Pizza' ? '🍕' : rest.type === 'Lanches' ? '🍔' : '🍦'}
                </div>
                <div className="flex flex-col justify-center flex-1">
                  <h3 className="font-bold text-gray-900 leading-tight group-hover:text-primary-600 transition-colors">{rest.name}</h3>
                  <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                    <span className="font-bold text-yellow-500 flex items-center gap-0.5">★ {rest.score}</span>
                    <span>•</span>
                    <span>{rest.type}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium text-gray-500 mt-2">
                    <span>{rest.time}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                    <span className={rest.fee === 'Grátis' ? 'text-emerald-500 font-bold' : ''}>{rest.fee}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 w-full bg-white border-t border-gray-100 px-6 py-3 pb-8 z-50 flex justify-between items-center shadow-[0_-4px_6px_-1px_rgb(0,0,0,0.05)]">
        <Link to="/app" className="flex flex-col items-center gap-1 text-primary-500">
          <Search className="w-6 h-6" />
          <span className="text-[10px] font-bold">Início</span>
        </Link>
        <Link to="#" className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-900 transition-colors">
          <ShoppingBag className="w-6 h-6" />
          <span className="text-[10px] font-medium">Pedidos</span>
        </Link>
        <Link to="#" className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-900 transition-colors">
          <User className="w-6 h-6" />
          <span className="text-[10px] font-medium">Perfil</span>
        </Link>
      </nav>
    </div>
  )
}
