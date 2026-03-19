import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Mail, Lock } from 'lucide-react'

export default function Login() {
  const navigate = useNavigate()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Mock login and redirect to app
    navigate('/app')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50 p-4">
      {/* Decorative gradient blobs */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[600px] h-[600px] bg-primary-100/40 rounded-full blur-3xl opacity-50 pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[600px] h-[600px] bg-emerald-50/40 rounded-full blur-3xl opacity-50 pointer-events-none" />

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-3 mb-6 group">
            <img src="/icone.svg" alt="Logo" className="w-12 h-12 group-hover:scale-110 transition-transform" />
            <span className="text-3xl font-black bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent transform -skew-x-12">
              NUM PULO
            </span>
          </Link>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Bem-vindo de volta</h2>
          <p className="text-gray-500 mt-2">Acesse sua conta para pedir agora</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-8 border border-gray-100">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">E-mail ou Celular</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input 
                  type="text" 
                  className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:bg-white transition-all outline-none" 
                  placeholder="voce@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-baseline mb-2">
                <label className="block text-sm font-semibold text-gray-700">Senha</label>
                <a href="#" className="text-sm font-medium text-primary-600 hover:text-primary-500 transition-colors">Esqueceu a senha?</a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input 
                  type="password" 
                  className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:bg-white transition-all outline-none" 
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button type="submit" className="w-full flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-8 py-3.5 rounded-xl font-bold text-lg shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 hover:-translate-y-0.5 transition-all">
              Entrar <ArrowRight className="w-5 h-5" />
            </button>
          </form>

            <p className="text-center text-gray-500 text-sm mt-8">
              Ainda não tem conta? <a href="#" className="font-bold text-primary-600 hover:text-primary-500">Crie agora</a>
            </p>
        </div>
      </div>
    </div>
  )
}
