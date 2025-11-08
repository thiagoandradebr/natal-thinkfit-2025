'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Settings, 
  LogOut,
  Menu,
  X,
  ChefHat,
  Sliders
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import AdminGuard from '@/components/AdminGuard'
import ThinkFitLogo from '@/components/ThinkFitLogo'
import { supabase } from '@/lib/supabase'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { signOut, user } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    loadLogo()
  }, [])

  const loadLogo = async () => {
    try {
      const { data, error } = await supabase
        .from('configuracoes_site')
        .select('valor')
        .eq('chave', 'logo_url')
        .maybeSingle()

      if (error) {
        console.error('Erro ao carregar logo:', error)
        return
      }
      
      if (data?.valor) {
        setLogoUrl(data.valor)
      }
    } catch (error) {
      console.error('Erro ao carregar logo:', error)
    }
  }

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
    { icon: Package, label: 'Produtos', href: '/admin/produtos' },
    { icon: ShoppingBag, label: 'Pedidos', href: '/admin/pedidos' },
    { icon: ChefHat, label: 'Chef', href: '/admin/chef' },
    { icon: Sliders, label: 'Configurações', href: '/admin/configuracoes' },
    { icon: Settings, label: 'Setup', href: '/admin/setup' },
  ]

  // Se estiver na página de login, não aplicar o layout admin nem o guard
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  return (
    <AdminGuard>
      <div className="min-h-screen bg-beige-lightest">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 280 : 80 }}
        className="fixed left-0 top-0 h-full bg-white/95 backdrop-blur-sm border-r border-beige-medium/50 z-50 transition-all duration-300 shadow-xl"
      >
        {/* Borda dourada superior */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold-warm to-transparent" />
        
        {/* Header */}
        <div className="h-20 border-b border-beige-medium/50 flex items-center justify-between px-6 bg-gradient-to-r from-white to-beige-lightest/30">
          {sidebarOpen ? (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              {logoUrl ? (
                <img 
                  src={logoUrl} 
                  alt="ThinkFit" 
                  className="h-12 object-contain"
                />
              ) : (
                <ThinkFitLogo className="h-12" />
              )}
              <div className="flex flex-col">
                <span className="font-display text-brown-darkest text-lg font-light tracking-tight leading-tight">
                  ThinkFit
                </span>
                <span className="font-body text-xs text-brown-medium uppercase tracking-wider">
                  Admin
                </span>
              </div>
            </motion.div>
          ) : (
            <div className="flex items-center justify-center w-full">
              {logoUrl ? (
                <img 
                  src={logoUrl} 
                  alt="ThinkFit" 
                  className="h-10 object-contain"
                />
              ) : (
                <ThinkFitLogo className="h-10" />
              )}
            </div>
          )}
          <motion.button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2.5 hover:bg-beige-lightest rounded-xl transition-colors text-brown-medium hover:text-brown-darkest"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </motion.button>
        </div>

        {/* Menu Items */}
        <nav className="p-4 space-y-1.5">
          {menuItems.map((item, index) => {
            const isActive = pathname === item.href
            return (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  href={item.href}
                  className={`group flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all relative overflow-hidden ${
                    isActive
                      ? 'bg-gradient-to-r from-wine to-wine-dark text-white shadow-lg'
                      : 'text-brown-medium hover:bg-beige-lightest hover:text-brown-darkest'
                  }`}
                >
                  {/* Indicador ativo */}
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                  
                  <div className={`relative z-10 ${isActive ? 'text-white' : 'text-brown-medium group-hover:text-gold-warm'} transition-colors`}>
                    <item.icon size={20} />
                  </div>
                  {sidebarOpen && (
                    <span className={`font-body text-sm uppercase tracking-wider relative z-10 transition-colors ${
                      isActive ? 'text-white' : 'text-brown-medium group-hover:text-brown-darkest'
                    }`}>
                      {item.label}
                    </span>
                  )}
                  
                  {/* Efeito hover */}
                  {!isActive && (
                    <div className="absolute inset-0 bg-gold-warm/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
                  )}
                </Link>
              </motion.div>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-beige-medium/50 bg-gradient-to-t from-white to-beige-lightest/30">
          <motion.button 
            onClick={signOut}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-3 px-4 py-3.5 w-full text-brown-medium hover:bg-red-50 hover:text-red-600 rounded-xl transition-all group"
          >
            <LogOut size={20} className="group-hover:rotate-12 transition-transform" />
            {sidebarOpen && (
              <span className="font-body text-sm uppercase tracking-wider font-medium">
                Sair
              </span>
            )}
          </motion.button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main
        className="transition-all duration-300"
        style={{ marginLeft: sidebarOpen ? 280 : 80 }}
      >
        {/* Top Bar */}
        <div className="h-20 bg-white/80 backdrop-blur-sm border-b border-beige-medium/50 flex items-center justify-between px-8 shadow-sm">
          <div>
            <h1 className="font-display text-2xl text-brown-darkest font-light tracking-tight">
              Painel Administrativo
            </h1>
            {user && (
              <p className="font-body text-xs text-brown-medium/70 mt-0.5">
                {user.email}
              </p>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="px-4 py-1.5 bg-gold-warm/10 border border-gold-warm/20 rounded-lg">
              <span className="font-body text-xs text-gold-warm uppercase tracking-wider font-semibold">
                Natal 2025
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
    </AdminGuard>
  )
}
