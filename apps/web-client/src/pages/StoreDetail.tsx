import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, ShoppingCart, Plus, Minus, Star, Clock, Loader2, Info } from 'lucide-react'
import api from '../services/api'
import { useCart } from '../contexts/CartContext'

export default function StoreDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart, items, total, removeFromCart } = useCart()
  
  const [store, setStore] = useState<any>(null)
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [storeRes, productsRes] = await Promise.all([
          api.get(`/stores/${id}`), // Precisamos que esse endpoint retorne a loja específica
          api.get(`/products/store/${id}`)
        ])
        setStore(storeRes.data.store)
        setProducts(productsRes.data.products)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  const getItemQuantity = (productId: string) => {
    return items.find(i => i.id === productId)?.quantity || 0
  }

  if (loading) return (
     <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
     </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* Hero Header */}
      <div className="h-48 bg-gray-900 relative">
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-all z-10"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="absolute inset-x-0 bottom-0 translate-y-1/2 max-w-5xl mx-auto px-4 w-full">
           <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 flex flex-col md:flex-row gap-6 items-center">
              <div className="w-24 h-24 bg-orange-100/50 rounded-2xl flex items-center justify-center text-5xl shrink-0">
                {store?.name.toLowerCase().includes('pizza') ? '🍕' : '🏪'}
              </div>
              <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center gap-3 justify-center md:justify-start mb-1">
                    <h1 className="text-3xl font-black text-gray-900">{store?.name}</h1>
                    <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest">{store?.isOpen ? 'Aberto' : 'Fechado'}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm font-bold text-gray-400 justify-center md:justify-start">
                     <span className="flex items-center gap-1 text-yellow-500"><Star className="w-4 h-4 fill-yellow-500" /> 4.9 (500+)</span>
                     <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> 20-30 min</span>
                     <span className="flex items-center gap-1 text-orange-500 font-black italic underline decoration-2 decoration-orange-200 underline-offset-4 cursor-pointer hover:text-orange-600 transition-colors"><Info className="w-4 h-4" /> Informações</span>
                  </div>
              </div>
           </div>
        </div>
      </div>

      {/* Product List */}
      <main className="max-w-5xl mx-auto px-4 mt-24">
        <h2 className="text-2xl font-black text-gray-900 mb-8 px-1 underline decoration-orange-500 decoration-4 underline-offset-4">Cardápio Sugerido</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {products.map(product => (
            <div key={product.id} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex gap-5 hover:shadow-xl hover:shadow-gray-200/50 transition-all group">
              <div className="w-32 h-32 bg-gray-50 rounded-2xl shrink-0 overflow-hidden flex items-center justify-center text-4xl group-hover:scale-105 transition-transform">
                {product.imageUrl ? <img src={product.imageUrl} className="w-full h-full object-cover" /> : '🍽️'}
              </div>
              <div className="flex-1 flex flex-col justify-between py-1">
                <div>
                  <h3 className="font-bold text-lg text-gray-900 leading-tight">{product.name}</h3>
                  <p className="text-xs text-gray-400 mt-2 line-clamp-2">{product.description}</p>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <span className="font-black text-gray-900">R$ {product.price.toFixed(2).replace('.', ',')}</span>
                  
                  <div className="flex items-center gap-1">
                    {getItemQuantity(product.id) > 0 ? (
                       <div className="flex items-center bg-gray-100 rounded-full px-1">
                          <button onClick={() => removeFromCart(product.id)} className="p-2 hover:bg-gray-200 rounded-full transition-colors"><Minus className="w-4 h-4 text-gray-600" /></button>
                          <span className="w-8 text-center font-black text-sm">{getItemQuantity(product.id)}</span>
                          <button onClick={() => addToCart({ ...product, storeId: id! })} className="p-2 hover:bg-gray-200 rounded-full transition-colors"><Plus className="w-4 h-4 text-gray-900" /></button>
                       </div>
                    ) : (
                      <button 
                        onClick={() => addToCart({ ...product, storeId: id! })}
                        className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-orange-500/20 hover:scale-110 active:scale-90 transition-all"
                      >
                        <Plus className="w-6 h-6" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Floating Cart Button */}
      {items.length > 0 && (
        <div className="fixed bottom-8 inset-x-0 flex justify-center px-4 animate-[slide-up_0.3s_ease-out] z-40">
           <button onClick={() => navigate('/checkout')} className="w-full max-w-3xl bg-gray-900 text-white p-6 rounded-[2rem] shadow-2xl shadow-gray-900/40 flex items-center justify-between hover:bg-gray-800 transition-all group">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center relative group-hover:-skew-x-12 transition-transform">
                    <ShoppingCart className="w-6 h-6" />
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-white text-gray-900 text-[10px] font-black rounded-full flex items-center justify-center border-2 border-gray-900">
                      {items.length}
                    </span>
                 </div>
                 <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Ver Carrinho</p>
                    <p className="font-black text-lg">R$ {total.toFixed(2).replace('.', ',')}</p>
                 </div>
              </div>
              <span className="font-black text-sm flex items-center gap-1 bg-white/10 px-4 py-2 rounded-xl group-hover:bg-white/20 transition-all">FECHAR PEDIDO</span>
           </button>
        </div>
      )}
    </div>
  )
}
