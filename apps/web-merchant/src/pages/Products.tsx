import { useState, useEffect } from 'react'
import { Plus, Package, Trash2, Edit2, Loader2, X, Image as ImageIcon, CheckCircle, AlertCircle } from 'lucide-react'
import api from '../services/api'

interface Product {
  id: string
  name: string
  description: string
  price: number
  imageUrl?: string
  isActive: boolean
}

interface ProductsProps {
  storeId: string
}

export default function Products({ storeId }: ProductsProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  // Form states
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [imageUrl, setImageUrl] = useState('')

  const fetchProducts = async () => {
    try {
      const response = await api.get(`/products/store/${storeId}`)
      setProducts(response.data.products)
    } catch (err) {
      console.error('Erro ao buscar produtos', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (storeId) fetchProducts()
  }, [storeId])

  const openModal = (product: Product | null = null) => {
    setSelectedProduct(product)
    if (product) {
      setName(product.name)
      setDescription(product.description)
      setPrice(String(product.price))
      setImageUrl(product.imageUrl || '')
    } else {
      setName('')
      setDescription('')
      setPrice('')
      setImageUrl('')
    }
    setIsModalOpen(true)
  }

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const payload = {
        name,
        description,
        price: Number(price),
        imageUrl,
        storeId
      }

      if (selectedProduct) {
        await api.patch(`/products/${selectedProduct.id}`, payload)
      } else {
        await api.post('/products', payload)
      }
      
      setIsModalOpen(false)
      fetchProducts()
    } catch (err) {
      console.error('Erro ao salvar produto', err)
      alert('Erro ao salvar produto. Verifique os dados.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleToggleActive = async (product: Product) => {
    try {
      await api.patch(`/products/${product.id}`, { isActive: !product.isActive })
      fetchProducts()
    } catch (err) {
      console.error('Erro ao alternar status do produto', err)
    }
  }

  if (loading) return <div className="text-slate-400 font-bold animate-pulse uppercase tracking-widest text-xs py-20 text-center">Carregando cardápio operacional...</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic transform -skew-x-6">Meu Cardápio</h2>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">Gerencie seus produtos, preços e disponibilidade.</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="bg-orange-500 text-white px-8 py-4 rounded-[1.5rem] font-black flex items-center gap-3 shadow-xl shadow-orange-500/30 hover:scale-105 active:scale-95 transition-all text-sm uppercase tracking-widest"
        >
          <Plus className="w-5 h-5" /> Adicionar Item
        </button>
      </div>

      {products.length === 0 ? (
        <div className="bg-white rounded-[3rem] p-24 text-center border-4 border-dashed border-slate-100 max-w-2xl mx-auto shadow-sm">
          <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 text-slate-200">
            <Package className="w-12 h-12" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 mb-4 uppercase tracking-tighter italic">Vitrime Vazia</h3>
          <p className="text-slate-400 font-bold text-sm mb-10 px-8 uppercase tracking-tight leading-relaxed">Você ainda não possui produtos cadastrados. Comece a criar seu cardápio agora.</p>
          <button 
            onClick={() => openModal()}
            className="text-orange-500 font-black hover:underline uppercase tracking-widest text-xs"
          >
            Cadastrar meu primeiro produto
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div key={product.id} className={`bg-white rounded-[2.5rem] border transition-all group relative overflow-hidden flex flex-col ${product.isActive ? 'border-slate-100 hover:shadow-2xl hover:shadow-orange-100/50' : 'border-slate-200 opacity-60 grayscale'}`}>
              <div className="h-56 bg-white relative overflow-hidden p-3">
                <div className="w-full h-full bg-slate-50 rounded-[2rem] overflow-hidden relative border border-slate-100">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-200 bg-slate-50">
                      <ImageIcon className="w-16 h-16" />
                    </div>
                  )}
                </div>
                {!product.isActive && (
                    <div className="absolute inset-0 bg-white/40 backdrop-blur-sm flex items-center justify-center">
                        <span className="bg-slate-900 text-white text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-xl">Produto Pausado</span>
                    </div>
                )}
              </div>
              
              <div className="p-8 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-xl font-black text-slate-900 tracking-tighter uppercase italic transform -skew-x-3">{product.name}</h4>
                  <span className="text-orange-500 font-black text-lg underline decoration-orange-200 decoration-4 underline-offset-4 italic">R$ {Number(product.price).toFixed(2).replace('.', ',')}</span>
                </div>
                <p className="text-slate-400 text-xs font-bold leading-relaxed line-clamp-2 mb-8 uppercase tracking-tight">{product.description}</p>
                
                <div className="flex gap-4 mt-auto">
                  <button 
                    onClick={() => openModal(product)}
                    className="flex-1 flex items-center justify-center gap-2 py-4 bg-slate-50 hover:bg-slate-100 text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-slate-100"
                  >
                    <Edit2 className="w-4 h-4 text-orange-500" /> Editar
                  </button>
                  <button 
                    onClick={() => handleToggleActive(product)}
                    className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${product.isActive ? 'bg-red-50 hover:bg-red-100 text-red-600 border-red-100' : 'bg-green-50 hover:bg-green-100 text-green-600 border-green-100'}`}
                  >
                    {product.isActive ? <><AlertCircle className="w-4 h-4" /> Pausar</> : <><CheckCircle className="w-4 h-4" /> Ativar</>}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Lateral (Slide-over overlay) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl animate-fade-in" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col p-10 animate-slide-left border-l border-slate-100 rounded-l-[3rem]">
            <div className="flex items-center justify-between mb-12">
               <div>
                  <h3 className="text-3xl font-black text-slate-900 tracking-tighter italic uppercase transform -skew-x-6">{selectedProduct ? 'Editar Item' : 'Novo Produto'}</h3>
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">Preencha os detalhes da sua oferta.</p>
               </div>
               <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-slate-50 rounded-2xl transition-all border border-transparent hover:border-slate-100">
                  <X className="w-6 h-6 text-slate-400" />
               </button>
            </div>

            <form onSubmit={handleSaveProduct} className="flex-1 space-y-8 overflow-y-auto pr-4 scrollbar-hide">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nome do Prato/Produto</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-6 py-5 bg-slate-50 border-0 rounded-2xl focus:ring-4 focus:ring-orange-100 outline-none transition-all font-bold text-slate-900 text-sm uppercase tracking-tighter"
                  placeholder="EX: BURGER SUPREMO"
                  required
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">O que vem nele? (Descrição)</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-6 py-5 bg-slate-50 border-0 rounded-2xl focus:ring-4 focus:ring-orange-100 outline-none transition-all h-40 resize-none font-bold text-slate-900 text-xs uppercase tracking-tight leading-relaxed"
                  placeholder="DETALHE OS INGREDIENTES E TAMANHO..."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Preço Sugerido</label>
                  <div className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-orange-500 text-sm italic">R$</span>
                    <input 
                      type="number" 
                      step="0.01"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full pl-14 pr-6 py-5 bg-slate-50 border-0 rounded-2xl focus:ring-4 focus:ring-orange-100 outline-none transition-all font-black text-slate-900 text-lg tracking-tighter italic"
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-3 opacity-40">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 text-slate-300">Markup (Em breve)</label>
                  <div className="w-full bg-slate-50 rounded-2xl py-5 px-6 font-black text-slate-200 text-sm italic flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" /> 25%
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-6 border-t border-slate-50">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-orange-500" /> Link da Imagem Publicitária
                </label>
                <input 
                  type="url" 
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-6 py-5 bg-slate-50 border-0 rounded-2xl focus:ring-4 focus:ring-orange-100 outline-none transition-all font-bold text-slate-400 text-[10px] tracking-widest uppercase"
                  placeholder="HTTPS://IMAGENS.GOOGLE.COM/FOTO-DOCE.JPG"
                />
              </div>
            </form>

            <div className="pt-10 mt-10 border-t border-slate-100">
               <button 
                 type="submit" 
                 onClick={handleSaveProduct}
                 disabled={submitting}
                 className="w-full bg-slate-900 text-white py-6 rounded-[2rem] font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-slate-800 hover:scale-[1.02] active:scale-95 disabled:opacity-50 transition-all shadow-2xl shadow-slate-900/30"
               >
                 {submitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <>{selectedProduct ? 'Atualizar Oferta' : 'Lançar no Cardápio'} <Plus className="w-5 h-5 text-orange-500" /></>}
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
