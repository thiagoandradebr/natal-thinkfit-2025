# 📊 Implementar Google Analytics 4 (GA4)

## 🎯 Objetivo

Adicionar Google Analytics 4 ao projeto para rastrear métricas completas de tráfego, comportamento e conversões.

---

## 📋 Passo a Passo

### 1. Criar Conta no Google Analytics

1. Acesse: https://analytics.google.com
2. Faça login com sua conta Google
3. Clique em **"Começar a medir"** ou **"Criar conta"**
4. Preencha:
   - **Nome da conta**: ThinkFit (ou seu nome)
   - **Nome da propriedade**: Cardápio Natal 2025
   - **Fuso horário**: (GMT-03:00) Brasília
   - **Moeda**: Real brasileiro (BRL)
5. Configure informações do negócio:
   - **Setor**: Varejo / E-commerce
   - **Tamanho**: Pequeno / Médio
   - **Como pretende usar o GA4**: Medir engajamento e conversões
6. Clique em **"Criar"**

### 2. Obter o Measurement ID

1. Após criar a propriedade, você verá o **Measurement ID**
2. Formato: `G-XXXXXXXXXX` (exemplo: `G-LMLCX41SYL`)
3. **Copie este ID** - você vai precisar dele!

**✅ ID Configurado:** `G-LMLCX41SYL`

### 3. Configurar Eventos de E-commerce

No Google Analytics, configure os eventos de conversão:

1. Vá em **Admin** (⚙️) → **Eventos**
2. Marque como conversão:
   - `purchase` ✅
   - `add_to_cart` ✅
   - `begin_checkout` ✅

---

## 🔧 Implementação no Projeto

### Opção 1: Implementação Direta (Recomendada)

Criar componente `GoogleAnalytics.tsx`:

```tsx
// src/components/GoogleAnalytics.tsx
'use client'

import Script from 'next/script'

export default function GoogleAnalytics() {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

  if (!measurementId) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️ [Google Analytics] Measurement ID não configurado!')
    }
    return null
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
    </>
  )
}
```

### Opção 2: Usando Google Tag Manager (Mais Flexível)

Se preferir usar GTM (recomendado para múltiplas tags):

1. Criar conta no GTM: https://tagmanager.google.com
2. Obter Container ID (formato: `GTM-XXXXXXX`)
3. Implementar GTM (veja guia separado)

---

## 📝 Adicionar ao Layout

Editar `src/app/layout.tsx`:

```tsx
import GoogleAnalytics from '@/components/GoogleAnalytics'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        {/* ... outros componentes ... */}
        <GoogleAnalytics />
      </head>
      <body>
        {/* ... */}
      </body>
    </html>
  )
}
```

---

## 🎯 Rastrear Eventos de E-commerce

Criar hook `useGoogleAnalytics.ts`:

```tsx
// src/hooks/useGoogleAnalytics.ts
'use client'

declare global {
  interface Window {
    gtag: (
      command: string,
      targetId: string,
      config?: Record<string, any>
    ) => void
  }
}

export function useGoogleAnalytics() {
  const trackEvent = (
    eventName: string,
    params?: Record<string, any>
  ) => {
    if (typeof window === 'undefined' || !window.gtag) {
      return
    }

    window.gtag('event', eventName, params)
  }

  const trackPurchase = (transactionData: {
    transaction_id: string
    value: number
    currency: string
    items: Array<{
      item_id: string
      item_name: string
      quantity: number
      price: number
    }>
  }) => {
    trackEvent('purchase', transactionData)
  }

  const trackAddToCart = (itemData: {
    currency: string
    value: number
    items: Array<{
      item_id: string
      item_name: string
      quantity: number
      price: number
    }>
  }) => {
    trackEvent('add_to_cart', itemData)
  }

  const trackBeginCheckout = (checkoutData: {
    currency: string
    value: number
    items: Array<{
      item_id: string
      item_name: string
      quantity: number
      price: number
    }>
  }) => {
    trackEvent('begin_checkout', checkoutData)
  }

  return {
    trackEvent,
    trackPurchase,
    trackAddToCart,
    trackBeginCheckout,
  }
}
```

---

## 🔗 Integrar com Código Existente

### No CartContext (AddToCart):

```tsx
import { useGoogleAnalytics } from '@/hooks/useGoogleAnalytics'

// Dentro do componente:
const { trackAddToCart } = useGoogleAnalytics()

// Ao adicionar ao carrinho:
trackAddToCart({
  currency: 'BRL',
  value: preco,
  items: [{
    item_id: produto.id,
    item_name: produto.nome,
    quantity: 1,
    price: preco,
  }]
})
```

### No Checkout (InitiateCheckout e Purchase):

```tsx
import { useGoogleAnalytics } from '@/hooks/useGoogleAnalytics'

// Dentro do componente:
const { trackBeginCheckout, trackPurchase } = useGoogleAnalytics()

// Ao acessar checkout:
trackBeginCheckout({
  currency: 'BRL',
  value: subtotal,
  items: cart.map(item => ({
    item_id: item.produto_id,
    item_name: item.nome,
    quantity: item.quantidade,
    price: item.preco,
  }))
})

// Ao finalizar compra:
trackPurchase({
  transaction_id: pedido_id,
  value: totalFinal,
  currency: 'BRL',
  items: cart.map(item => ({
    item_id: item.produto_id,
    item_name: item.nome,
    quantity: item.quantidade,
    price: item.preco,
  }))
})
```

---

## 🔐 Configurar Variável de Ambiente

### No Vercel:

1. Vá em **Settings** → **Environment Variables**
2. Adicione:
   ```
   Key: NEXT_PUBLIC_GA_MEASUREMENT_ID
   Value: G-XXXXXXXXXX (seu Measurement ID)
   Environments: ☑ Production ☑ Preview ☑ Development
   ```
3. Faça redeploy

### Localmente (.env.local):

```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

---

## ✅ Verificação

### Método 1: Google Analytics Real-Time

1. Acesse: https://analytics.google.com
2. Vá em **Relatórios** → **Tempo real**
3. Acesse seu site
4. Você deve ver sua visita aparecer em tempo real

### Método 2: Google Tag Assistant

1. Instale extensão: https://chrome.google.com/webstore/detail/tag-assistant-legacy-by-g/kejbdjndbnbjgmefkgdddjlbokphdefk
2. Acesse seu site
3. Clique no ícone da extensão
4. Verifique se o GA4 está carregando

### Método 3: Console do Navegador

1. Abra DevTools (F12)
2. Vá em **Network**
3. Filtre por `gtag` ou `analytics`
4. Deve ver requisições sendo feitas

---

## 📊 Relatórios Úteis no GA4

### 1. Relatório de E-commerce
- **Caminho**: Relatórios → Monetização → E-commerce
- **Mostra**: Vendas, receita, produtos mais vendidos

### 2. Funil de Conversão
- **Caminho**: Explorar → Criar exploração → Funil
- **Mostra**: Taxa de conversão em cada etapa

### 3. Origem do Tráfego
- **Caminho**: Relatórios → Aquisição → Visão geral
- **Mostra**: De onde vêm os visitantes

### 4. Dispositivos
- **Caminho**: Relatórios → Tecnologia → Visão geral
- **Mostra**: Desktop vs Mobile

---

## 🎯 Próximos Passos

1. ✅ Criar conta no Google Analytics
2. ✅ Obter Measurement ID
3. ✅ Implementar componente GoogleAnalytics
4. ✅ Adicionar ao layout
5. ✅ Criar hook useGoogleAnalytics
6. ✅ Integrar eventos (AddToCart, Checkout, Purchase)
7. ✅ Configurar variável no Vercel
8. ✅ Testar e verificar

---

## 📚 Referências

- [Google Analytics 4 Documentation](https://developers.google.com/analytics/devguides/collection/ga4)
- [GA4 E-commerce Events](https://developers.google.com/analytics/devguides/collection/ga4/ecommerce)
- [Next.js Analytics](https://nextjs.org/docs/app/building-your-application/optimizing/analytics)

---

**Status:** 📋 Guia de implementação - Pronto para implementar quando necessário

