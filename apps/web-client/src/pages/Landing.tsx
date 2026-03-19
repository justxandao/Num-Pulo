import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Landing() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex items-center gap-3">
              <img src="/icone.svg" alt="Num Pulo" className="h-12 w-12 hover:scale-110 transition-transform duration-300 drop-shadow-md" />
              <span className="text-2xl font-black bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent transform -skew-x-12">
                NUM PULO
              </span>
            </Link>
            
            <nav className="hidden md:flex gap-8 items-center">
              <a href="#como-funciona" className="text-gray-600 hover:text-primary-500 font-medium transition-colors">Como funciona</a>
              <a href="#lojas" className="text-gray-600 hover:text-primary-500 font-medium transition-colors">Para Restaurantes</a>
              <a href="#entregadores" className="text-gray-600 hover:text-primary-500 font-medium transition-colors">Para Entregadores</a>
              <Link to="/login" className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2.5 rounded-full font-bold shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 hover:-translate-y-0.5 transition-all">
                Entrar / Cadastrar
              </Link>
            </nav>

            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-gray-600">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <section className="relative pt-20 pb-32 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-50/80 to-gray-50/90 z-10" />
            <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[800px] h-[800px] bg-primary-100/50 rounded-full blur-3xl opacity-60" />
            <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[600px] h-[600px] bg-emerald-50/50 rounded-full blur-3xl opacity-60" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-primary-600 font-semibold text-sm mb-6 border border-primary-100 shadow-sm hover:-translate-y-1 transition-transform">
                  <span className="flex h-2 w-2 rounded-full bg-primary-500 animate-pulse"></span>
                  Chegou na sua cidade!
                </div>
                <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight leading-[1.1] mb-8">
                  Sua comida favorita,<br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-600">
                    Num Pulo
                  </span> na sua casa.
                </h1>
                <p className="text-xl text-gray-600 mb-10 leading-relaxed font-light">
                  Esqueça a demora no WhatsApp. Peça pelo app com total segurança, acompanhe o entregador em tempo real e apoie o comércio da sua cidade.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/app" className="flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl shadow-gray-900/20 hover:-translate-y-1 transition-all">
                    Ver Restaurantes Abertos
                  </Link>
                </div>
                
                <div className="mt-12 flex items-center gap-6 text-sm text-gray-500 font-medium group cursor-default">
                  <div className="flex -space-x-3">
                    <div className="w-10 h-10 rounded-full bg-primary-100 border-2 border-white flex items-center justify-center text-primary-600 font-bold group-hover:-translate-y-1 transition-transform delay-75">A</div>
                    <div className="w-10 h-10 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-blue-600 font-bold group-hover:-translate-y-1 transition-transform delay-100">M</div>
                    <div className="w-10 h-10 rounded-full bg-emerald-100 border-2 border-white flex items-center justify-center text-emerald-600 font-bold group-hover:-translate-y-1 transition-transform delay-150">J</div>
                  </div>
                  <p>Mais de <strong className="text-gray-900 text-base">5,000 pedidos</strong> entregues esse mês!</p>
                </div>
              </div>

              {/* Decorative Mockup */}
              <div className="relative mx-auto w-full max-w-[400px] lg:max-w-[450px]">
                <div className="relative rounded-[2.5rem] border-[8px] border-gray-900 bg-gray-50 shadow-2xl overflow-hidden aspect-[9/19] hover:shadow-primary-500/20 transition-shadow duration-500">
                  <div className="absolute inset-0 bg-gray-50 flex flex-col p-6">
                    <header className="flex justify-between items-center mb-6 pt-4">
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Entregar em</p>
                        <p className="text-sm font-bold text-gray-900 flex items-center gap-1 cursor-pointer hover:text-primary-500 transition-colors">
                          Casa
                          <svg className="w-3 h-3 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                        </p>
                      </div>
                      <div className="w-11 h-11 rounded-full bg-gray-200 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center">
                        <img src="/icone.svg" alt="User" className="w-8 h-8 opacity-50" />
                      </div>
                    </header>
                    <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl p-5 text-white shadow-lg shadow-primary-500/30 mb-6 transform hover:scale-[1.02] transition-transform cursor-pointer relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -translate-y-8 translate-x-8"></div>
                      <h3 className="font-bold text-xl mb-1 mt-2">Cupom de R$10</h3>
                      <p className="text-primary-100 text-sm">Na sua primeira compra</p>
                    </div>
                    
                    <div className="flex justify-between mb-8">
                      <div className="flex flex-col items-center gap-2 group cursor-pointer">
                        <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-sm border border-gray-100 group-hover:bg-primary-50 group-hover:border-primary-200 transition-colors text-2xl">🍕</div>
                        <span className="text-xs font-semibold text-gray-600 group-hover:text-primary-600 transition-colors">Pizza</span>
                      </div>
                      <div className="flex flex-col items-center gap-2 group cursor-pointer">
                        <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-sm border border-gray-100 group-hover:bg-yellow-50 group-hover:border-yellow-200 transition-colors text-2xl">🍔</div>
                        <span className="text-xs font-semibold text-gray-600 group-hover:text-yellow-600 transition-colors">Lanches</span>
                      </div>
                      <div className="flex flex-col items-center gap-2 group cursor-pointer">
                        <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-sm border border-gray-100 group-hover:bg-emerald-50 group-hover:border-emerald-200 transition-colors text-2xl">🥗</div>
                        <span className="text-xs font-semibold text-gray-600 group-hover:text-emerald-600 transition-colors">Saudável</span>
                      </div>
                    </div>
                    
                    <div className="flex-grow">
                      <h4 className="font-bold text-gray-900 mb-4 text-lg">Populares na região</h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-4 bg-white p-3 rounded-2xl shadow-sm border border-gray-100 hover:border-primary-200 cursor-pointer transition-colors group">
                          <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center text-xl group-hover:scale-105 transition-transform">🍕</div>
                          <div className="flex-grow">
                            <p className="font-bold text-sm text-gray-900 group-hover:text-primary-500 transition-colors">Pizzaria do Zé</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs font-bold text-yellow-500 flex items-center gap-0.5">★ 4.9</span>
                              <span className="text-xs text-gray-400">• 20-30 min</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="absolute top-24 -left-16 bg-white p-4 rounded-2xl shadow-xl shadow-emerald-500/10 border border-gray-100 animate-[bounce_4s_infinite] hidden sm:block">
                  <p className="text-xs text-gray-500 font-medium mb-1">Status do Pedido</p>
                  <p className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Saiu para entrega! 🛵
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t border-gray-100 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3 opacity-60 grayscale hover:grayscale-0 transition-all duration-300">
            <img src="/icone.svg" alt="Num Pulo" className="h-8 w-8" />
            <span className="font-extrabold text-xl tracking-tight">NUM PULO</span>
          </div>
          <p className="text-gray-400 text-sm">© 2026 Num Pulo Delivery.</p>
        </div>
      </footer>
    </div>
  )
}
