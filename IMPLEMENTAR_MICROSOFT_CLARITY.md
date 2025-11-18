# 🔍 Implementar Microsoft Clarity

## 🎯 Objetivo

Adicionar Microsoft Clarity para obter gravações de sessões, heatmaps e insights de comportamento dos usuários.

---

## 📋 Passo a Passo

### 1. Criar Conta no Microsoft Clarity

1. Acesse: https://clarity.microsoft.com
2. Clique em **"Sign in"** ou **"Get started"**
3. Faça login com conta Microsoft (ou crie uma)
4. Clique em **"Add new project"**
5. Preencha:
   - **Project name**: Cardápio Natal 2025
   - **Website URL**: https://natal-thinkfit.vercel.app
   - **Industry**: Retail / E-commerce
6. Clique em **"Create project"**

### 2. Obter o Project ID

1. Após criar o projeto, você verá o código de instalação
2. O **Project ID** está no código (formato: `xxxxxxxxxx`)
3. **Copie este ID** - você vai precisar dele!

---

## 🔧 Implementação no Projeto

### Criar Componente Clarity.tsx

```tsx
// src/components/Clarity.tsx
'use client'

import Script from 'next/script'

export default function Clarity() {
  const projectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID

  if (!projectId) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️ [Microsoft Clarity] Project ID não configurado!')
    }
    return null
  }

  return (
    <Script id="microsoft-clarity" strategy="afterInteractive">
      {`
        (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "${projectId}");
      `}
    </Script>
  )
}
```

### Adicionar ao Layout

Editar `src/app/layout.tsx`:

```tsx
import Clarity from '@/components/Clarity'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        {/* ... outros componentes ... */}
        <Clarity />
      </head>
      <body>
        {/* ... */}
      </body>
    </html>
  )
}
```

---

## 🔐 Configurar Variável de Ambiente

### No Vercel:

1. Vá em **Settings** → **Environment Variables**
2. Adicione:
   ```
   Key: NEXT_PUBLIC_CLARITY_PROJECT_ID
   Value: xxxxxxxxxx (seu Project ID)
   Environments: ☑ Production ☑ Preview ☑ Development
   ```
3. Faça redeploy

### Localmente (.env.local):

```env
NEXT_PUBLIC_CLARITY_PROJECT_ID=xxxxxxxxxx
```

---

## ✅ Verificação

### Método 1: Dashboard do Clarity

1. Acesse: https://clarity.microsoft.com
2. Selecione seu projeto
3. Aguarde alguns minutos após implementar
4. Você verá sessões sendo gravadas

### Método 2: Console do Navegador

1. Abra DevTools (F12)
2. Vá em **Network**
3. Filtre por `clarity`
4. Deve ver requisições sendo feitas

---

## 📊 Recursos do Clarity

### 1. Gravações de Sessão
- Veja exatamente o que cada usuário fez
- Identifique problemas de UX
- Entenda por que usuários abandonam

### 2. Heatmaps
- **Click maps**: Onde usuários clicam
- **Scroll maps**: Até onde rolam a página
- **Attention maps**: Onde focam atenção

### 3. Insights
- **Dead clicks**: Cliques que não fazem nada
- **Rage clicks**: Múltiplos cliques no mesmo lugar
- **JavaScript errors**: Erros que afetam usuários

---

## 💡 Como Usar os Dados

### Para Melhorar UX:
1. **Assista gravações** de usuários que abandonaram o carrinho
2. **Veja heatmaps** para entender onde focar atenção
3. **Identifique dead clicks** - botões que não funcionam como esperado
4. **Corrija problemas** encontrados nas gravações

### Para Otimizar Conversões:
1. **Analise o funil** - Onde usuários param?
2. **Veja scroll depth** - Páginas muito longas?
3. **Identifique confusão** - Onde usuários ficam perdidos?
4. **Teste mudanças** baseadas nos insights

---

## 🎯 Próximos Passos

1. ✅ Criar conta no Microsoft Clarity
2. ✅ Obter Project ID
3. ✅ Implementar componente Clarity
4. ✅ Adicionar ao layout
5. ✅ Configurar variável no Vercel
6. ✅ Aguardar dados (pode levar algumas horas)
7. ✅ Analisar gravações e heatmaps

---

## 📚 Referências

- [Microsoft Clarity Documentation](https://docs.clarity.microsoft.com)
- [Clarity Features](https://clarity.microsoft.com/features)

---

## ⚠️ Privacidade

O Clarity respeita privacidade:
- Não rastreia informações pessoais
- Pode mascarar dados sensíveis
- Conforme LGPD/GDPR
- Pode desativar gravações de campos de formulário

---

**Status:** 📋 Guia de implementação - Pronto para implementar quando necessário

