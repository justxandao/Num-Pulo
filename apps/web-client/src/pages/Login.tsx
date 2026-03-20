import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { LogIn, Mail, Lock, Loader2, ArrowLeft } from 'lucide-react'
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
      navigate('/app')
    } catch (err: any) {
      console.error(err)
      setError('E-mail ou senha inválidos. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Link 
        to="/" 
        className="absolute top-8 left-8 flex items-center gap-2 text-gray-400 hover:text-gray-900 transition-colors font-bold"
      >
        <ArrowLeft className="w-5 h-5" /> Voltar para Home
      </Link>

      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-primary-500 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary-500/20 -skew-x-12 rotate-3 hover:rotate-0 transition-all duration-500">
             <LogIn className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Bem-vindo de volta!</h1>
          <p className="text-gray-500 mt-2 font-medium">Faça login para continuar seus pedidos.</p>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100">
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl text-sm font-bold mb-6 animate-shake">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-black text-gray-700 ml-1">E-mail</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-transparent rounded-[1.25rem] focus:bg-white focus:ring-2 focus:ring-primary-500 transition-all outline-none text-gray-900"
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-black text-gray-700 ml-1">Senha</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-transparent rounded-[1.25rem] focus:bg-white focus:ring-2 focus:ring-primary-500 transition-all outline-none text-gray-900"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gray-900 text-white py-5 rounded-[1.5rem] font-black text-lg shadow-xl shadow-gray-900/20 hover:bg-gray-800 disabled:opacity-50 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Entrar agora <LogIn className="w-5 h-5" /></>}
            </button>
          </form>

          <p className="text-center text-gray-500 mt-8 text-sm font-medium">
            Não tem uma conta? <Link to="/register" className="text-primary-500 font-black hover:underline">Cadastre-se</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
