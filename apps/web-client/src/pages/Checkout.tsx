import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, CreditCard, Banknote, ShoppingBag, Loader2, CheckCircle2 } from 'lucide-react'
import { useCart } from '../contexts/CartContext'
import api from '../services/api'

export default function Checkout() {
  const navigate = useNavigate()
  const { items, total, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  
  const handleCheckout = async () => {
    if (items.length === 0) return

    setLoading(true)
    try {
      // O backend espera { storeId, items: [{ productId, quantity }] }
      await api.post('/orders', {
        storeId: items[0].storeId,
        items: items.map(i => ({
          productId: i.id,
          quantity: i.quantity
        }))
      })

      setSuccess(true)
      clearCart()
      setTimeout(() => {
        navigate('/app')
      }, 3000)
    } catch (err) {
      console.error(err)
      alert('Erro ao finalizar pedido. Verifique sua conexão.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 text-center">
        <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
           <CheckCircle2 className="w-12 h-12 text-emerald-500" />
        </div>
        <h1 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">Pedido Realizado!</h1>
        <p className="text-gray-500 max-w-sm">Seu pedido foi enviado para a loja. Você será notificado assim que ele for aceito.</p>
        <p className="text-xs text-gray-400 mt-10">Redirecionando para o início...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="h-20 bg-white border-b border-gray-100 flex items-center px-6 sticky top-0 z-30 justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6 text-gray-900" />
          </button>
          <h1 className="text-xl font-black text-gray-900 tracking-tight">Finalizar Pedido</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-6 space-y-8">
        {/* Review Items */}
        <section className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
          <h2 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-orange-500" /> Revisar Itens
          </h2>
          <div className="space-y-4">
            {items.map(item => (
              <div key={item.id} className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-3">
                   <span className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center font-bold text-[10px] text-gray-500">{item.quantity}x</span>
                   <span className="font-bold text-gray-900">{item.name}</span>
                </div>
                <span className="font-black text-gray-900">R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 mt-6 pt-6 flex justify-between items-center">
             <span className="text-gray-400 font-bold uppercase tracking-widest text-xs">Total do Pedido</span>
             <span className="text-2xl font-black text-gray-900">R$ {total.toFixed(2).replace('.', ',')}</span>
          </div>
        </section>

        {/* Payment Methods */}
        <section className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
          <h2 className="text-lg font-black text-gray-900 mb-6">Forma de Pagamento</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
             <div className="p-4 rounded-2xl border-2 border-orange-500 bg-orange-50 cursor-pointer">
                <Banknote className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                <p className="text-sm font-black text-gray-900">Dinheiro / Pix</p>
                <p className="text-[10px] font-bold text-orange-400 mt-1 uppercase tracking-tighter">Na entrega</p>
             </div>
             <div className="p-4 rounded-2xl border-2 border-gray-100 hover:border-orange-200 cursor-not-allowed opacity-50">
                <CreditCard className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                <p className="text-sm font-black text-gray-400">Cartão de Crédito</p>
                <p className="text-[10px] font-bold text-gray-300 mt-1 uppercase tracking-tighter">Em breve</p>
             </div>
          </div>
        </section>

        <button 
          onClick={handleCheckout}
          disabled={loading || items.length === 0}
          className="w-full bg-gray-900 text-white py-6 rounded-[2rem] font-black text-xl shadow-2xl shadow-gray-900/30 hover:bg-gray-800 disabled:opacity-50 transition-all flex items-center justify-center gap-3"
        >
          {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Realizar Pedido'}
        </button>

        <p className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">Ao clicar em realizar pedido, você concorda com nossos termos.</p>
      </main>
    </div>
  )
}
