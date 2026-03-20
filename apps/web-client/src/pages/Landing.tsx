import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, MapPin, User, ChevronRight, Star, Clock, Tag } from 'lucide-react'

export default function Landing() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <div className="min-h-screen font-sans bg-white">
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <img src="/icone.svg" alt="Num Pulo" className="h-10 w-10 drop-shadow-sm" />
              <span className="text-2xl font-black bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent transform -skew-x-12">
                NUM PULO
              </span>
            </Link>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex flex-1 justify-center max-w-lg mx-8">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input 
                  type="text" 
                  className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm font-medium transition-colors"
                  placeholder="Buscar comida, restaurante..."
                />
              </div>
            </div>

            <div className="hidden md:flex gap-4 items-center">
              <Link to="/login" className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-bold px-4 py-2 hover:bg-primary-50 rounded-lg transition-colors shadow-[0_0_15px_rgba(249,115,22,0.1)]">
                <User size={20} />
                Entrar
              </Link>
            </div>

            {/* Mobile menu button */}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-gray-600">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="flex-grow pt-20">
        
        {/* HERO SECTION */}
        <section className="bg-primary-500 relative overflow-hidden py-12 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col-reverse lg:flex-row items-center gap-12">
              <div className="flex-1 text-center lg:text-left z-10">
                <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] mb-6 drop-shadow-sm">
                  Deu fome? Pede <br className="hidden lg:block"/> Num Pulo.
                </h1>
                <p className="text-lg text-primary-50 mb-8 max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed">
                  Em poucos cliques, encontre as melhores refeições pertinho de você e receba em casa.
                </p>
                
                {/* Search Box Card */}
                <div className="bg-white rounded-2xl p-4 md:p-6 shadow-2xl max-w-xl mx-auto lg:mx-0 transform hover:-translate-y-1 transition-transform duration-300">
                  <div className="flex mb-4 border-b border-gray-100">
                    <button className="flex-1 pb-3 text-center border-b-2 border-primary-500 font-bold text-gray-900 flex items-center justify-center gap-2">
                      <span className="text-xl">🛵</span> Delivery
                    </button>
                    <button className="flex-1 pb-3 text-center text-gray-400 font-bold hover:text-gray-600 transition-colors flex items-center justify-center gap-2">
                       <span className="text-xl">🛍️</span> Retirada
                    </button>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin className="h-5 w-5 text-red-500" />
                      </div>
                      <input 
                        type="text" 
                        className="block w-full pl-10 pr-3 py-3.5 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent font-medium"
                        placeholder="Informe seu endereço"
                      />
                    </div>
                    <button 
                      onClick={() => navigate('/app')}
                      className="bg-red-500 hover:bg-red-600 text-white px-6 py-3.5 rounded-xl font-bold shadow-lg shadow-red-500/30 transition-all hover:scale-105 active:scale-95"
                    >
                      Encontrar Comida
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex-1 relative z-10 w-full max-w-lg mx-auto">
                <img src="/images/foodwagon/gallery/hero-header.png" alt="Hero" className="w-full object-contain drop-shadow-2xl animate-[float_6s_ease-in-out_infinite]" />
              </div>
            </div>
          </div>
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-[800px] h-[800px] bg-white/10 rounded-full blur-3xl opacity-50 pointer-events-none" />
        </section>

        {/* PROMOTIONS SECTION */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { img: 'discount-item-1.png', discount: '15', title: 'Sanduíche Clássico' },
                { img: 'discount-item-2.png', discount: '10', title: 'Açaí Tropical' },
                { img: 'discount-item-3.png', discount: '25', title: 'Pizza Grande' },
                { img: 'discount-item-4.png', discount: '20', title: 'Combo Lanche' },
              ].map((item, idx) => (
                <div key={idx} className="group relative rounded-3xl overflow-hidden cursor-pointer">
                  <img src={`/images/foodwagon/gallery/${item.img}`} alt={item.title} className="w-full aspect-[4/3] object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 p-5 w-full">
                    <h5 className="font-bold text-white text-lg mb-2 drop-shadow-md">{item.title}</h5>
                    <span className="inline-flex items-center gap-1 bg-red-500/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-lg">
                      <Clock size={12} /> Só hoje!
                    </span>
                  </div>
                  <div className="absolute top-4 left-4 bg-primary-500 text-white rounded-2xl p-3 shadow-lg flex flex-col items-center leading-tight">
                    <span className="font-black text-2xl">{item.discount}<small className="text-sm">%</small></span>
                    <span className="font-medium text-xs uppercase tracking-wide">Off</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="py-16 bg-gradient-to-b from-primary-50/50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h5 className="font-black text-red-500 text-2xl md:text-3xl mb-12 uppercase tracking-wide">Como funciona</h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { img: 'location.png', title: 'Localização', desc: 'Escolha onde quer receber sua comida.' },
                { img: 'order.png', title: 'Escolha o pedido', desc: 'Navegue por centenas de cardápios apetitosos.' },
                { img: 'pay.png', title: 'Pagamento fácil', desc: 'Pague online ou na entrega com segurança.' },
                { img: 'meals.png', title: 'Aproveite!', desc: 'Comida fresquinha entregue direto na sua porta.' },
              ].map((step, idx) => (
                <div key={idx} className="flex flex-col items-center group">
                  <div className="w-32 h-32 flex items-center justify-center mb-6 relative">
                     <div className="absolute inset-0 bg-primary-100 rounded-full scale-0 group-hover:scale-100 transition-transform duration-500 ease-out" />
                     <img src={`/images/foodwagon/gallery/${step.img}`} alt={step.title} className="h-24 w-auto relative z-10 drop-shadow-lg group-hover:-translate-y-2 transition-transform duration-300" />
                  </div>
                  <h5 className="font-extrabold text-gray-900 text-lg mb-2">{step.title}</h5>
                  <p className="text-gray-500 font-medium leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* POPULAR ITEMS */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h5 className="font-black text-gray-900 text-2xl md:text-3xl text-center mb-12 uppercase">Itens Populares</h5>
            <div className="flex overflow-x-auto pb-8 -mx-4 px-4 snap-x snap-mandatory gap-6 scrollbar-hide">
              {[
                { img: 'cheese-burger.png', title: 'Cheese Burger', store: 'Burger Arena', price: '25,90' },
                { img: 'toffes-cake.png', title: "Toffe's Cake", store: 'Top Sticks', price: '18,50' },
                { img: 'dancake.png', title: 'Panqueca Doce', store: 'Cake World', price: '12,99' },
                { img: 'crispy-sandwitch.png', title: 'Crispy Sandwich', store: 'Fastfood Dine', price: '22,00' },
                { img: 'thai-soup.png', title: 'Thai Soup', store: 'Foody Man', price: '28,90' },
              ].map((item, idx) => (
                <div key={idx} className="min-w-[280px] sm:min-w-[320px] snap-center bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-shadow duration-300 flex flex-col overflow-hidden group">
                  <div className="aspect-[4/3] bg-gray-50 overflow-hidden">
                     <img src={`/images/foodwagon/gallery/${item.img}`} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h5 className="font-extrabold text-gray-900 text-xl mb-2">{item.title}</h5>
                    <div className="flex items-center gap-2 mb-4 text-gray-500">
                      <MapPin size={16} className="text-primary-500" />
                      <span className="font-medium text-sm">{item.store}</span>
                    </div>
                    <div className="mt-auto flex items-center justify-between">
                      <span className="font-black text-2xl text-gray-900">R$ {item.price}</span>
                      <button className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-2xl shadow-lg shadow-red-500/20 transition-transform active:scale-95">
                        <ChevronRight size={24} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURED RESTAURANTS */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-10">
              <h5 className="font-black text-gray-900 text-2xl md:text-3xl uppercase">Restaurantes em Destaque</h5>
              <button className="hidden sm:flex items-center gap-2 font-bold text-primary-600 hover:text-primary-700 transition-colors">
                Ver todos <ChevronRight size={20} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { img: 'food-world.png', logo: 'food-world-logo.png', name: 'Food World', rating: '4.6', tag: '20% Off' },
                { img: 'pizza-hub.png', logo: 'pizzahub-logo.png', name: 'Pizza Hub', rating: '4.8', tag: 'Frete Grátis' },
                { img: 'donuts-hut.png', logo: 'donuts-hut-logo.png', name: 'Donuts Hut', rating: '4.9', tag: 'Aberto Agora' },
                { img: 'ruby-tuesday.png', logo: 'ruby-tuesday-logo.png', name: 'Ruby Tuesday', rating: '4.5', tag: '10% Off' },
                { img: 'kuakata.png', logo: 'kuakata-logo.png', name: 'Kuakata Chicken', rating: '4.7', tag: 'Rápido' },
                { img: 'red-square.png', logo: 'red-square-logo.png', name: 'Red Square', rating: '4.4', tag: 'Frete Grátis' },
                { img: 'taco-bell.png', logo: 'taco-bell-logo.png', name: 'Taco Bell', rating: '4.6', tag: 'Aberto Agora' },
                { img: 'donuthut.png', logo: 'donut-hut-logo.png', name: 'Burger Palace', rating: '4.8', tag: '15% Off' },
              ].map((store, idx) => (
                <div key={idx} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 group cursor-pointer" onClick={() => navigate('/app')}>
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img src={`/images/foodwagon/gallery/${store.img}`} alt={store.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-4 left-4 flex gap-2">
                       <span className="bg-primary-500 text-white font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-sm">
                         <Tag size={12} /> {store.tag}
                       </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-14 h-14 rounded-2xl bg-white shadow-md border border-gray-50 flex items-center justify-center p-1 overflow-hidden -mt-10 relative z-10">
                        <img src={`/images/foodwagon/gallery/${store.logo}`} alt="Logo" className="w-full h-full object-contain" />
                      </div>
                      <div className="flex-1">
                        <h5 className="font-extrabold text-gray-900 text-lg truncate">{store.name}</h5>
                        <div className="flex items-center gap-1 text-yellow-500 font-bold text-sm">
                          <Star size={14} fill="currentColor" /> {store.rating}
                        </div>
                      </div>
                    </div>
                    <div>
                      <span className="inline-flex font-bold text-xs px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-600">
                        Aberto Agora
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="sm:hidden w-full mt-8 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold py-4 rounded-xl transition-colors">
               Ver todos os restaurantes
            </button>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="py-20 bg-gradient-to-br from-primary-600 to-primary-500 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/images/foodwagon/gallery/cta-one-bg.png')] bg-cover bg-center opacity-10 mix-blend-overlay" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 drop-shadow-md">
              Pronto para fazer seu pedido?
            </h2>
            <p className="text-primary-100 text-lg md:text-xl font-medium mb-10 max-w-2xl mx-auto">
              Baixe nosso app ou faça seu pedido pela web. Dezenas de restaurantes esperando por você.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/app" className="bg-white text-primary-600 hover:bg-gray-50 px-8 py-4 rounded-2xl font-black text-lg shadow-xl shadow-primary-900/20 transition-transform active:scale-95 flex items-center justify-center gap-2">
                Começar a Pedir <ChevronRight size={20} />
              </Link>
            </div>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 border-b border-gray-800 pb-8">
            <div className="col-span-1 md:col-span-2">
              <Link to="/" className="flex items-center gap-2 mb-4">
                <img src="/icone.svg" alt="Num Pulo" className="h-8 w-8 brightness-0 invert opacity-90" />
                <span className="text-2xl font-black text-white transform -skew-x-12">NUM PULO</span>
              </Link>
              <p className="text-gray-400 font-medium max-w-sm leading-relaxed">
                A plataforma de delivery que conecta você aos melhores restaurantes da sua cidade. Rápido, seguro e num pulo.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Empresa</h4>
              <ul className="space-y-3 font-medium">
                <li><a href="#" className="hover:text-white transition-colors">Sobre nós</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Carreiras</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Contato</h4>
              <ul className="space-y-3 font-medium">
                <li><a href="#" className="hover:text-white transition-colors">Ajuda e Suporte</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Lojas Parceiras</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Entregadores</a></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-medium">
            <p>© 2026 Num Pulo. Todos os direitos reservados.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">Termos</a>
              <a href="#" className="hover:text-white transition-colors">Privacidade</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
