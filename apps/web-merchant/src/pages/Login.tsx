import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, User } from 'lucide-react'

export default function Login() {
  const navigate = useNavigate()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen flex text-merchant-900 bg-merchant-900">
      {/* Esquerda - Imagem/Decorativo */}
      <div className="hidden lg:flex flex-col flex-1 relative bg-merchant-800 p-12 overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/20 to-merchant-900/90 z-10" />
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-[800px] h-[800px] bg-primary-500/10 rounded-full blur-3xl" />
        
        <div className="relative z-20 max-w-lg text-center">
          <h1 className="text-5xl font-black text-white mb-6 leading-tight">Painel de <br/><span className="text-primary-500">Gestão</span> Num Pulo</h1>
          <p className="text-merchant-100 text-lg leading-relaxed">
            Acompanhe seus pedidos em tempo real, gerencie seu cardápio e aumente o alcance da sua loja na sua cidade.
          </p>
        </div>
      </div>

      {/* Direita - Login Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-12 bg-white">
        <div className="max-w-md w-full mx-auto">
          <div className="flex items-center gap-2 mb-8 text-xl font-black text-merchant-900">
            <div className="w-8 h-8 rounded-lg bg-primary-500 text-white flex items-center justify-center -skew-x-12">NP</div>
            <span>NUM PULO <span className="text-gray-400 font-medium">LOJISTA</span></span>
          </div>

          <h2 className="text-3xl font-bold mb-2">Acesso ao Painel</h2>
          <p className="text-gray-500 mb-8">Gerencie suas vendas e sua operação.</p>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">E-mail Corporativo</label>
              <div className="relative">
                <input 
                  type="email" 
                  className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none" 
                  placeholder="contato@sualoja.com.br"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-baseline mb-2">
                <label className="block text-sm font-semibold text-gray-700">Senha</label>
                <a href="#" className="text-sm font-medium text-primary-600 hover:text-primary-500">Recuperar senha</a>
              </div>
              <div className="relative">
                <input 
                  type="password" 
                  className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none" 
                  placeholder="••••••••••"
                  required
                />
              </div>
            </div>

            <button type="submit" className="w-full flex items-center justify-center gap-2 bg-merchant-900 hover:bg-merchant-800 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl shadow-merchant-900/20 hover:-translate-y-1 transition-all">
              Acessar Painel <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-8">
            Quer ser parceiro? <a href="#" className="font-bold text-primary-600 hover:text-primary-500">Cadastre seu Restaurante</a>
          </p>
        </div>
      </div>
    </div>
  )
}
