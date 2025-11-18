# 📊 Facebook Pixel - Guia Completo de Configuração

Este guia vai te ajudar a configurar o Facebook Pixel no site para obter métricas e fazer divulgação paga.

---

## 📋 Índice

1. [O que é o Facebook Pixel?](#o-que-é-o-facebook-pixel)
2. [Como Obter o Pixel ID](#como-obter-o-pixel-id)
3. [Configuração no Projeto](#configuração-no-projeto)
4. [Eventos Rastreados](#eventos-rastreados)
5. [Verificação e Testes](#verificação-e-testes)
6. [Uso para Anúncios Pagos](#uso-para-anúncios-pagos)
7. [Troubleshooting](#troubleshooting)

---

## 🎯 O que é o Facebook Pixel?

O Facebook Pixel é um código JavaScript que permite:

- **Rastrear conversões**: Ver quantas pessoas compraram após ver seu anúncio
- **Criar públicos personalizados**: Segmentar pessoas que visitaram seu site
- **Otimizar anúncios**: O Facebook usa os dados para mostrar anúncios para pessoas mais propensas a comprar
- **Medir ROI**: Calcular o retorno sobre investimento das campanhas

---

## 🔑 Como Obter o Pixel ID

### Passo 1: Acessar o Facebook Events Manager

1. Acesse: https://business.facebook.com
2. Faça login com sua conta do Facebook Business
3. No menu lateral, clique em **"Eventos"** (Events Manager)

### Passo 2: Criar um Pixel (se ainda não tiver)

1. Se você já tem um pixel, pule para o Passo 3
2. Clique em **"Conectar dados"** → **"Web"** → **"Facebook Pixel"**
3. Dê um nome para o pixel (ex: "ThinkFit Natal 2025")
4. Clique em **"Criar"**

### Passo 3: Copiar o Pixel ID

1. Na página do Events Manager, você verá seu pixel
2. O **Pixel ID** é um número de 15 ou 16 dígitos
3. Exemplo: `1234567890123456`
4. **Copie este número** - você vai precisar dele!

---

## ⚙️ Configuração no Projeto

### Passo 1: Adicionar Variável de Ambiente

#### No Vercel (Produção):

1. Acesse o dashboard do Vercel
2. Vá em **Settings** → **Environment Variables**
3. Clique em **"Add New"**
4. Adicione:

```
Key: NEXT_PUBLIC_FACEBOOK_PIXEL_ID
Value: [cole seu Pixel ID aqui]
Environments: ☑ Production ☑ Preview ☑ Development
```

5. Clique em **"Save"**
6. **Importante**: Faça um novo deploy após adicionar a variável

#### Localmente (Desenvolvimento):

1. Crie ou edite o arquivo `.env.local` na raiz do projeto
2. Adicione:

```env
NEXT_PUBLIC_FACEBOOK_PIXEL_ID=seu_pixel_id_aqui
```

3. Reinicie o servidor de desenvolvimento:
```bash
npm run dev
```

### Passo 2: Verificar Instalação

O código já está integrado! O pixel será carregado automaticamente quando:

- ✅ A variável `NEXT_PUBLIC_FACEBOOK_PIXEL_ID` estiver configurada
- ✅ O site for acessado por um usuário

**Não é necessário fazer mais nada!** O pixel já está funcionando.

---

## 📈 Eventos Rastreados

O site já está configurado para rastrear os seguintes eventos automaticamente:

### 1. **PageView** (Visualização de Página)
- **Quando**: Toda vez que alguém visita qualquer página do site
- **Onde**: Carregado automaticamente no layout principal
- **Dados enviados**: URL da página, timestamp

### 2. **AddToCart** (Adicionar ao Carrinho)
- **Quando**: Quando um produto é adicionado ao carrinho
- **Onde**: `src/contexts/CartContext.tsx`
- **Dados enviados**:
  - Nome do produto
  - ID do produto
  - Preço do produto
  - Moeda (BRL)

### 3. **InitiateCheckout** (Iniciar Checkout)
- **Quando**: Quando o usuário acessa a página de checkout com itens no carrinho
- **Onde**: `src/app/checkout/page.tsx`
- **Dados enviados**:
  - Valor total do carrinho
  - Quantidade de itens
  - IDs dos produtos
  - Detalhes de cada item

### 4. **Purchase** (Compra Concluída)
- **Quando**: Quando um pedido é confirmado com sucesso
- **Onde**: `src/app/checkout/page.tsx`
- **Dados enviados**:
  - Valor total da compra
  - ID do pedido
  - Quantidade de itens
  - IDs dos produtos
  - Detalhes de cada item

---

## ✅ Verificação e Testes

### Método 1: Facebook Pixel Helper (Recomendado)

1. Instale a extensão no Chrome:
   - Acesse: https://chrome.google.com/webstore/detail/facebook-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc
   - Clique em **"Adicionar ao Chrome"**

2. Acesse seu site:
   - Abra o site em uma nova aba
   - Clique no ícone do Pixel Helper na barra de ferramentas
   - Você deve ver:
     - ✅ Pixel ID detectado
     - ✅ Eventos sendo disparados (PageView, AddToCart, etc.)

### Método 2: Events Manager (Facebook)

1. Acesse o Events Manager: https://business.facebook.com/events_manager2
2. Selecione seu pixel
3. Vá em **"Test Events"** (Eventos de Teste)
4. Acesse seu site em outra aba
5. Você verá os eventos aparecendo em tempo real!

### Método 3: Console do Navegador

1. Abra o DevTools (F12)
2. Vá na aba **Console**
3. Em modo de desenvolvimento, você verá logs como:
   ```
   [Facebook Pixel] Evento disparado: AddToCart { ... }
   ```

---

## 🎯 Uso para Anúncios Pagos

### 1. Criar Públicos Personalizados

**Público de Visitantes do Site:**
1. No Facebook Ads Manager, vá em **"Públicos"**
2. Clique em **"Criar público"** → **"Público personalizado"**
3. Selecione **"Tráfego do site"**
4. Escolha:
   - **Todos os visitantes do site** (últimos 30 dias)
   - **Visitantes de páginas específicas** (ex: checkout)
   - **Pessoas que adicionaram ao carrinho mas não compraram**

### 2. Criar Campanhas de Remarketing

**Exemplo: Anúncio para quem visitou mas não comprou:**
1. Crie uma campanha no Ads Manager
2. Na seção **"Público"**, selecione seu público personalizado
3. Configure o anúncio com:
   - Imagem do produto
   - Texto: "Você deixou algo no carrinho? Complete sua compra!"
   - Link para a página de checkout

### 3. Otimizar para Conversões

**Configurar Otimização:**
1. Ao criar a campanha, em **"Otimização e entrega"**
2. Selecione **"Otimizar para"** → **"Conversões"**
3. Escolha o evento: **"Purchase"** (Compra)
4. O Facebook mostrará seu anúncio para pessoas mais propensas a comprar!

### 4. Medir Resultados

**No Ads Manager:**
1. Vá em **"Campanhas"**
2. Veja as métricas:
   - **Conversões**: Quantas compras foram feitas
   - **Custo por conversão**: Quanto você gastou por venda
   - **ROAS** (Return on Ad Spend): Retorno sobre investimento

**No Events Manager:**
1. Veja todos os eventos rastreados
2. Analise:
   - Quantas pessoas adicionaram ao carrinho
   - Quantas iniciaram checkout
   - Quantas completaram a compra
   - Taxa de conversão

---

## 🔧 Troubleshooting

### Problema: Pixel não está carregando

**Solução:**
1. Verifique se a variável `NEXT_PUBLIC_FACEBOOK_PIXEL_ID` está configurada
2. Verifique se o valor está correto (sem espaços, apenas números)
3. Limpe o cache do navegador (Ctrl+Shift+Delete)
4. Verifique o console do navegador para erros

### Problema: Eventos não estão sendo disparados

**Solução:**
1. Use o Facebook Pixel Helper para verificar
2. Verifique se está em modo de produção (em desenvolvimento, os eventos podem não aparecer no Events Manager)
3. Verifique o console do navegador para logs
4. Certifique-se de que o JavaScript está habilitado

### Problema: Eventos duplicados

**Solução:**
1. Verifique se o pixel não está sendo carregado duas vezes
2. Use o Facebook Pixel Helper para identificar duplicações
3. Se necessário, remova implementações antigas do pixel

### Problema: Dados não aparecem no Events Manager

**Solução:**
1. Aguarde alguns minutos (pode haver delay)
2. Verifique se está usando o Pixel ID correto
3. Use o modo "Test Events" para ver eventos em tempo real
4. Verifique se não há bloqueadores de anúncios ativos

---

## 📚 Recursos Adicionais

### Documentação Oficial
- [Facebook Pixel - Documentação](https://developers.facebook.com/docs/meta-pixel)
- [Eventos Padrão do Pixel](https://developers.facebook.com/docs/meta-pixel/reference)

### Ferramentas Úteis
- [Facebook Pixel Helper](https://chrome.google.com/webstore/detail/facebook-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc)
- [Events Manager](https://business.facebook.com/events_manager2)
- [Ads Manager](https://business.facebook.com/adsmanager)

---

## ✅ Checklist de Configuração

- [ ] Pixel ID obtido no Facebook Events Manager
- [ ] Variável `NEXT_PUBLIC_FACEBOOK_PIXEL_ID` configurada no Vercel
- [ ] Variável configurada localmente (`.env.local`) para desenvolvimento
- [ ] Deploy realizado após adicionar variável
- [ ] Pixel Helper instalado e testado
- [ ] Eventos sendo disparados corretamente
- [ ] Públicos personalizados criados no Ads Manager
- [ ] Campanhas de remarketing configuradas

---

## 🎉 Pronto!

Seu Facebook Pixel está configurado e funcionando! Agora você pode:

- ✅ Ver métricas detalhadas no Events Manager
- ✅ Criar públicos personalizados para anúncios
- ✅ Otimizar campanhas para conversões
- ✅ Medir o ROI das suas campanhas

**Dúvidas?** Consulte a documentação oficial do Facebook ou entre em contato com o suporte.

---

*Última atualização: Dezembro 2024*

