import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Loader2 } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function Login() {
  const navigate = useNavigate()
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      await signIn({ email, password })
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Falha na autenticação. Verifique suas credenciais.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex text-slate-900 bg-slate-900">
      {/* Esquerda - Imagem/Decorativo */}
      <div className="hidden lg:flex flex-col flex-1 relative bg-slate-800 p-12 overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600/20 to-slate-900/90 z-10" />
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-[800px] h-[800px] bg-orange-500/10 rounded-full blur-3xl" />
        
        <div className="relative z-20 max-w-lg text-center">
          <h1 className="text-5xl font-black text-white mb-6 leading-tight">Painel de <br/><span className="text-orange-500">Gestão</span> Num Pulo</h1>
          <p className="text-slate-100 text-lg leading-relaxed">
            Acompanhe seus pedidos em tempo real, gerencie seu cardápio e aumente o alcance da sua loja na sua cidade.
          </p>
        </div>
      </div>

      {/* Direita - Login Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-12 bg-white">
        <div className="max-w-md w-full mx-auto">
          <div className="flex items-center gap-2 mb-8 text-xl font-black text-slate-900">
            <div className="w-8 h-8 rounded-lg bg-orange-500 text-white flex items-center justify-center -skew-x-12">NP</div>
            <span>NUM PULO <span className="text-gray-400 font-medium">LOJISTA</span></span>
          </div>

          <h2 className="text-3xl font-bold mb-2">Acesso ao Painel</h2>
          <p className="text-gray-500 mb-8">Gerencie suas vendas e sua operação.</p>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-medium border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">E-mail Corporativo</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all outline-none" 
                placeholder="contato@sualoja.com.br"
                required
              />
            </div>

            <div>
              <div className="flex justify-between items-baseline mb-2">
                <label className="block text-sm font-semibold text-gray-700">Senha</label>
                <a href="#" className="text-sm font-medium text-orange-600 hover:text-orange-500">Recuperar senha</a>
              </div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all outline-none" 
                placeholder="••••••••••"
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-70 disabled:hover:translate-y-0 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl shadow-slate-900/20 hover:-translate-y-1 transition-all"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Acessar Painel'}
              {!loading && <ArrowRight className="w-5 h-5" />}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-8">
            Quer ser parceiro? <a href="#" className="font-bold text-orange-600 hover:text-orange-500">Cadastre seu Restaurante</a>
          </p>
        </div>
      </div>
    </div>
  )
}
