# 🔍 Verificar Google Analytics - Guia de Troubleshooting

## ✅ O Código Está Correto!

O código implementado está **100% correto**. O problema é que o Google Analytics ainda não está recebendo dados.

---

## 🔍 Por Que Não Está Recebendo Dados?

### Possíveis Causas:

1. **Variável de ambiente não configurada no Vercel** ⚠️
2. **Deploy não realizado após configurar variável** ⚠️
3. **Domínio diferente** - O fluxo está configurado para `natal.thinkfitbrasil.com.br`

---

## ✅ Checklist de Verificação

### 1. Verificar Variável no Vercel

1. Acesse: https://vercel.com/dashboard
2. Selecione seu projeto
3. Vá em **Settings** → **Environment Variables**
4. Verifique se existe:
   ```
   NEXT_PUBLIC_GA_MEASUREMENT_ID = G-LMLCX41SYL
   ```
5. Se não existir, **adicione agora**:
   - Key: `NEXT_PUBLIC_GA_MEASUREMENT_ID`
   - Value: `G-LMLCX41SYL`
   - Environments: ☑ Production ☑ Preview ☑ Development
   - Clique em **Save**

### 2. Verificar Deploy

1. Após adicionar/atualizar a variável, **faça um redeploy**:
   - Vá em **Deployments**
   - Clique nos **três pontos** (⋯) do último deploy
   - Selecione **"Redeploy"**
   - Confirme

### 3. Verificar Domínio no Google Analytics

**IMPORTANTE:** O fluxo de dados está configurado para:
- URL: `https://natal.thinkfitbrasil.com.br`

**Verifique:**
- Seu site está rodando neste domínio?
- Ou está em outro domínio (ex: `natal-thinkfit.vercel.app`)?

**Se o domínio for diferente:**
1. No Google Analytics, vá em **Admin** → **Fluxos de dados**
2. Clique no fluxo "NATAL"
3. Edite a URL ou crie um novo fluxo para o domínio correto

---

## 🧪 Como Testar se Está Funcionando

### Método 1: Console do Navegador (Mais Rápido)

1. Acesse seu site em produção
2. Abra DevTools (F12)
3. Vá na aba **Console**
4. Digite: `window.gtag`
5. **Se retornar uma função** → ✅ Está funcionando!
6. **Se retornar `undefined`** → ❌ Variável não configurada ou script não carregou

### Método 2: Network Tab

1. Acesse seu site em produção
2. Abra DevTools (F12)
3. Vá na aba **Network**
4. Filtre por `gtag` ou `analytics`
5. **Se ver requisições** → ✅ Está enviando dados!
6. **Se não ver nada** → ❌ Script não está carregando

### Método 3: Google Analytics Real-Time

1. Acesse: https://analytics.google.com
2. Vá em **Relatórios** → **Tempo real**
3. Acesse seu site em outra aba
4. **Se aparecer sua visita** → ✅ Funcionando!
5. **Se não aparecer** → ❌ Verifique variável e deploy

---

## 🔧 Solução Passo a Passo

### Passo 1: Configurar Variável no Vercel

```
1. Vercel Dashboard → Settings → Environment Variables
2. Adicionar: NEXT_PUBLIC_GA_MEASUREMENT_ID = G-LMLCX41SYL
3. Salvar
```

### Passo 2: Fazer Redeploy

```
1. Deployments → Três pontos → Redeploy
2. Aguardar deploy completar
```

### Passo 3: Verificar no Site

```
1. Acessar site em produção
2. Abrir Console (F12)
3. Verificar: window.gtag deve existir
4. Verificar Network: deve ter requisições para gtag
```

### Passo 4: Verificar no Google Analytics

```
1. Aguardar 5-10 minutos
2. Acessar: Relatórios → Tempo real
3. Acessar site novamente
4. Deve aparecer visita em tempo real
```

---

## ⚠️ Problemas Comuns

### Problema: `window.gtag is undefined`

**Causa:** Variável não configurada ou script não carregou

**Solução:**
1. Verifique se `NEXT_PUBLIC_GA_MEASUREMENT_ID` está no Vercel
2. Faça redeploy
3. Limpe cache do navegador (Ctrl+Shift+R)

### Problema: Script carrega mas não envia dados

**Causa:** Domínio diferente ou bloqueador de anúncios

**Solução:**
1. Verifique se o domínio no GA4 corresponde ao site
2. Desative bloqueadores de anúncios (uBlock, AdBlock, etc.)
3. Teste em modo anônimo

### Problema: Dados não aparecem em tempo real

**Causa:** Pode levar alguns minutos para processar

**Solução:**
1. Aguarde 5-10 minutos
2. Verifique se está no relatório "Tempo real" (não "Visão geral")
3. Acesse o site novamente enquanto está vendo o relatório

---

## 📊 IDs Importantes

- **Measurement ID (usado no código)**: `G-LMLCX41SYL` ✅
- **Stream ID (apenas referência)**: `13012938649`
- **URL do Fluxo**: `https://natal.thinkfitbrasil.com.br`

---

## ✅ Status Atual

- ✅ Código implementado corretamente
- ✅ Componente GoogleAnalytics criado
- ✅ Eventos de e-commerce implementados
- ⏳ Variável de ambiente (verificar no Vercel)
- ⏳ Deploy (fazer após configurar variável)
- ⏳ Teste em produção (aguardar dados)

---

**Próximo Passo:** Configure a variável no Vercel e faça redeploy! 🚀

