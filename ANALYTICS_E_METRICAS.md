# 📊 Analytics e Métricas para Sites de Vendas/Cardápio

## 🎯 Visão Geral

Este guia apresenta as principais ferramentas de analytics e métricas recomendadas para sites de vendas tipo cardápio, além do Facebook Pixel que já está implementado.

---

## ✅ O Que Já Está Implementado

- ✅ **Facebook Pixel** - Rastreamento de conversões no Facebook/Instagram
  - Eventos: PageView, AddToCart, InitiateCheckout, Purchase

---

## 🚀 Ferramentas Recomendadas (Por Prioridade)

### 1. Google Analytics 4 (GA4) ⭐ ESSENCIAL

**Por quê?**
- Métricas completas de tráfego e comportamento
- Análise de funil de conversão
- Relatórios de e-commerce
- Integração com Google Ads
- Gratuito

**O que mede:**
- Visitas, sessões, usuários
- Taxa de rejeição
- Tempo no site
- Páginas mais visitadas
- Dispositivos e navegadores
- Origem do tráfego
- Funil de conversão completo
- Valor de conversão

**Como implementar:**
1. Criar conta em: https://analytics.google.com
2. Criar propriedade GA4
3. Obter o Measurement ID (formato: `G-XXXXXXXXXX`)
4. Adicionar ao projeto (veja implementação abaixo)

**Custo:** Gratuito

---

### 2. Google Tag Manager (GTM) ⭐ RECOMENDADO

**Por quê?**
- Gerencia todas as tags de tracking em um só lugar
- Não precisa alterar código para adicionar novas ferramentas
- Testa tags antes de publicar
- Facilita manutenção

**O que faz:**
- Centraliza Facebook Pixel, GA4, conversões, etc.
- Permite adicionar/remover tags sem deploy
- Interface visual para configuração

**Como implementar:**
1. Criar conta em: https://tagmanager.google.com
2. Criar container
3. Obter o Container ID (formato: `GTM-XXXXXXX`)
4. Adicionar ao projeto (veja implementação abaixo)

**Custo:** Gratuito

---

### 3. Microsoft Clarity ⭐ RECOMENDADO

**Por quê?**
- Gravações de sessões dos usuários
- Heatmaps (mapas de calor)
- Identifica onde usuários clicam, rolam, param
- Gratuito e ilimitado
- Ajuda a entender problemas de UX

**O que mede:**
- Onde usuários clicam mais
- Onde param de rolar a página
- Onde ficam confusos
- Padrões de comportamento
- Problemas de usabilidade

**Como implementar:**
1. Criar conta em: https://clarity.microsoft.com
2. Adicionar projeto
3. Obter o Project ID
4. Adicionar script ao projeto

**Custo:** Gratuito

---

### 4. Google Search Console ⭐ ESSENCIAL PARA SEO

**Por quê?**
- Monitora performance no Google
- Identifica palavras-chave que trazem tráfego
- Mostra erros de indexação
- Ajuda a melhorar SEO

**O que mede:**
- Impressões no Google
- Cliques orgânicos
- CTR (taxa de cliques)
- Posição média nas buscas
- Palavras-chave que trazem tráfego
- Erros de indexação

**Como implementar:**
1. Acessar: https://search.google.com/search-console
2. Adicionar propriedade (URL do site)
3. Verificar propriedade (via meta tag ou DNS)
4. Aguardar dados (pode levar alguns dias)

**Custo:** Gratuito

---

### 5. Vercel Analytics ⭐ JÁ DISPONÍVEL

**Por quê?**
- Já está disponível no Vercel
- Métricas de performance
- Web Vitals (Core Web Vitals)
- Análise de velocidade

**O que mede:**
- Page views
- Tempo de carregamento
- LCP (Largest Contentful Paint)
- FID (First Input Delay)
- CLS (Cumulative Layout Shift)

**Como implementar:**
- Já disponível no Vercel
- Basta ativar no dashboard

**Custo:** Gratuito (plano Hobby)

---

### 6. Google Ads Conversion Tracking

**Por quê?**
- Se você usar Google Ads, precisa rastrear conversões
- Mede ROI das campanhas
- Otimiza anúncios automaticamente

**O que mede:**
- Conversões vindas de anúncios
- Custo por conversão
- ROI das campanhas

**Como implementar:**
1. Criar tag de conversão no Google Ads
2. Adicionar código ao projeto
3. Ou usar GTM (recomendado)

**Custo:** Gratuito (mas precisa gastar em anúncios)

---

### 7. Hotjar (Alternativa ao Clarity)

**Por quê?**
- Similar ao Clarity
- Gravações de sessão
- Heatmaps
- Pesquisas e feedbacks
- Mais recursos que o Clarity (mas pago)

**Diferença do Clarity:**
- Clarity: Gratuito, ilimitado
- Hotjar: Pago (plano gratuito limitado)

**Custo:** 
- Plano gratuito: 35 sessões/dia
- Planos pagos: A partir de $39/mês

---

### 8. TikTok Pixel (Se usar TikTok Ads)

**Por quê?**
- Se você fizer anúncios no TikTok
- Rastreia conversões
- Similar ao Facebook Pixel

**Custo:** Gratuito

---

### 9. LinkedIn Insight Tag (Se usar LinkedIn Ads)

**Por quê?**
- Se você fizer anúncios no LinkedIn
- Rastreia conversões profissionais

**Custo:** Gratuito

---

## 📋 Implementação Prática

### Prioridade Alta (Implementar Primeiro)

1. ✅ **Facebook Pixel** - JÁ IMPLEMENTADO
2. 🔲 **Google Analytics 4** - Implementar agora
3. 🔲 **Google Search Console** - Configurar agora
4. 🔲 **Microsoft Clarity** - Implementar agora

### Prioridade Média

5. 🔲 **Google Tag Manager** - Para facilitar gestão
6. 🔲 **Vercel Analytics** - Ativar no dashboard

### Prioridade Baixa (Quando Necessário)

7. 🔲 **Google Ads Conversion** - Quando começar Google Ads
8. 🔲 **TikTok Pixel** - Se usar TikTok Ads
9. 🔲 **LinkedIn Insight Tag** - Se usar LinkedIn Ads

---

## 🎯 Métricas Essenciais para Cardápio/Vendas

### Métricas de Tráfego
- **Visitas únicas** - Quantas pessoas visitaram
- **Sessões** - Quantas visitas totais
- **Taxa de rejeição** - % que saiu sem interagir
- **Tempo médio no site** - Engajamento

### Métricas de Conversão
- **Taxa de conversão** - % de visitantes que compraram
- **Valor médio do pedido** - Ticket médio
- **Taxa de abandono de carrinho** - % que adicionou mas não comprou
- **Funil de conversão**:
  - Visualização de produto
  - Adicionar ao carrinho
  - Iniciar checkout
  - Finalizar compra

### Métricas de Produto
- **Produtos mais visualizados**
- **Produtos mais adicionados ao carrinho**
- **Produtos mais vendidos**
- **Taxa de conversão por produto**

### Métricas de UX
- **Páginas mais visitadas**
- **Onde usuários clicam** (heatmaps)
- **Onde param de rolar** (scroll depth)
- **Problemas de usabilidade** (gravações)

### Métricas de Marketing
- **Origem do tráfego** (orgânico, pago, direto, social)
- **ROI por canal** (Facebook, Google, etc.)
- **Custo por aquisição (CPA)**
- **Lifetime Value (LTV)**

---

## 💡 Dicas de Uso

### Para Otimizar Vendas
1. **Analise o funil** - Onde mais pessoas desistem?
2. **Teste produtos** - Quais têm melhor conversão?
3. **Otimize checkout** - Reduza abandono de carrinho
4. **Ajuste preços** - Baseado em dados de conversão

### Para Melhorar UX
1. **Use heatmaps** - Veja onde usuários clicam
2. **Assista gravações** - Entenda problemas reais
3. **Teste A/B** - Compare versões diferentes
4. **Monitore velocidade** - Site lento = menos vendas

### Para Marketing
1. **Rastreie origem** - Qual canal traz mais vendas?
2. **Otimize campanhas** - Foque no que funciona
3. **Crie públicos** - Retargeting baseado em comportamento
4. **Meça ROI** - Saiba o retorno de cada investimento

---

## 🔧 Próximos Passos

1. **Implementar Google Analytics 4** (veja guia de implementação)
2. **Configurar Google Search Console**
3. **Adicionar Microsoft Clarity**
4. **Ativar Vercel Analytics**

---

## 📚 Recursos

- [Google Analytics 4](https://analytics.google.com)
- [Google Tag Manager](https://tagmanager.google.com)
- [Microsoft Clarity](https://clarity.microsoft.com)
- [Google Search Console](https://search.google.com/search-console)
- [Vercel Analytics](https://vercel.com/analytics)

---

**Status:** 📋 Guia de referência - Implementações serão feitas conforme necessidade

