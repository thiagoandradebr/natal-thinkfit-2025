import type { Metadata } from 'next'
import './globals.css'
import { CartProvider } from '@/contexts/CartContext'
import { ToastProvider } from '@/components/ToastProvider'
import { AuthProvider } from '@/contexts/AuthContext'

export const metadata: Metadata = {
  title: 'Cardápio de Natal ThinkFit — Bolos sem glúten, zero lactose e low sugar',
  description: 'Encomende bolos e doces natalinos autorais da Chef Juliana Andrade. Produção limitada — sabores sofisticados, low sugar e sem glúten.',
  keywords: ['natal', 'bolos', 'sem glúten', 'zero lactose', 'low sugar', 'thinkfit', 'saudável'],
  authors: [{ name: 'ThinkFit' }],
  openGraph: {
    title: 'Cardápio de Natal ThinkFit 2025',
    description: 'Sobremesas natalinas autorais — sem glúten, zero lactose e low sugar',
    type: 'website',
    locale: 'pt_BR',
    images: [
      {
        url: '/images/hero.jpg',
        width: 1200,
        height: 630,
        alt: 'Cardápio de Natal ThinkFit',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cardápio de Natal ThinkFit 2025',
    description: 'Sobremesas natalinas autorais — sem glúten, zero lactose e low sugar',
    images: ['/images/hero.jpg'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes" />
      </head>
      <body>
        <AuthProvider>
          <ToastProvider>
            <CartProvider>{children}</CartProvider>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
