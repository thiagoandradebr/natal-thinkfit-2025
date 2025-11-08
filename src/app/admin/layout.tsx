'use client'

import { useState } from 'react'
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
  Sparkles,
  ChefHat,
  Sliders
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import AdminGuard from '@/components/AdminGuard'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { signOut, user } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const pathname = usePathname()

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
    { icon: Package, label: 'Produtos', href: '/admin/produtos' },
    { icon: ShoppingBag, label: 'Pedidos', href: '/admin/pedidos' },
    { icon: ChefHat, label: 'Chef', href: '/admin/chef' },
    { icon: Sliders, label: 'Configurações', href: '/admin/configuracoes' },
    { icon: Settings, label: 'Setup', href: '/admin/setup' },
  ]

  return (
    <AdminGuard>
      <div className="min-h-screen bg-beige-lightest">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 280 : 80 }}
        className="fixed left-0 top-0 h-full bg-white border-r border-beige-medium z-50 transition-all duration-300"
      >
        {/* Header */}
        <div className="h-20 border-b border-beige-medium flex items-center justify-between px-6">
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2"
            >
              <Sparkles className="text-gold-warm w-5 h-5" />
              <span className="font-display text-brown-darkest text-xl font-light">
                ThinkFit Admin
              </span>
            </motion.div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-beige-lightest rounded-lg transition-colors"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Menu Items */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-wine to-wine-dark text-white'
                    : 'text-brown-medium hover:bg-beige-lightest hover:text-brown-darkest'
                }`}
              >
                <item.icon size={20} />
                {sidebarOpen && (
                  <span className="font-body text-sm uppercase tracking-wider">
                    {item.label}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-beige-medium">
          <button 
            onClick={signOut}
            className="flex items-center gap-3 px-4 py-3 w-full text-brown-medium hover:bg-beige-lightest hover:text-wine rounded-lg transition-all"
          >
            <LogOut size={20} />
            {sidebarOpen && (
              <span className="font-body text-sm uppercase tracking-wider">
                Sair
              </span>
            )}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main
        className="transition-all duration-300"
        style={{ marginLeft: sidebarOpen ? 280 : 80 }}
      >
        {/* Top Bar */}
        <div className="h-20 bg-white border-b border-beige-medium flex items-center justify-between px-8">
          <h1 className="font-display text-2xl text-brown-darkest font-light">
            Painel Administrativo
          </h1>
          <div className="flex items-center gap-4">
            <span className="font-body text-sm text-brown-medium">
              Natal 2025
            </span>
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
