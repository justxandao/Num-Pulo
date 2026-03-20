import React, { useState } from 'react'
import { LogIn, Loader2 } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await signIn(email, password)
    } catch (err: any) {
      alert(err.message || 'Erro ao entrar.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] p-12 shadow-2xl shadow-gray-200 border border-gray-100">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-primary-500 tracking-tighter transform -skew-x-12">ADMIN</h1>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-2">Painel de Controle Central</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-[10px] font-black text-gray-900 uppercase tracking-widest mb-2 ml-1">E-mail administrativo</label>
            <input 
              type="email"
              required
              className="w-full bg-gray-50 border-transparent rounded-2xl px-6 py-4 font-bold text-gray-900 focus:bg-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
              placeholder="admin@numpulo.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-900 uppercase tracking-widest mb-2 ml-1">Senha de acesso</label>
            <input 
              type="password"
              required
              className="w-full bg-gray-50 border-transparent rounded-2xl px-6 py-4 font-bold text-gray-900 focus:bg-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 text-white rounded-2xl py-4 font-black flex items-center justify-center gap-3 hover:bg-gray-800 transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
              <>
                ENTRAR NO PAINEL <LogIn className="w-5 h-5" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
