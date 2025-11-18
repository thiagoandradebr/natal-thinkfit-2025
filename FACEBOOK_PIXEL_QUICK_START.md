# 🚀 Facebook Pixel - Início Rápido

## ✅ O que foi implementado?

O Facebook Pixel foi totalmente integrado ao site! Agora você pode:

- 📊 Ver métricas detalhadas de visitantes
- 🎯 Criar públicos personalizados para anúncios
- 💰 Rastrear conversões e medir ROI
- 📈 Otimizar campanhas pagas

---

## 🔧 Configuração Rápida (5 minutos)

### 1. Obter o Pixel ID

1. Acesse: https://business.facebook.com/events_manager2
2. Selecione ou crie um pixel
3. Copie o **Pixel ID** (número de 15-16 dígitos)

### 2. Configurar no Vercel

1. Vá em **Settings** → **Environment Variables**
2. Adicione:
   ```
   Key: NEXT_PUBLIC_FACEBOOK_PIXEL_ID
   Value: [seu_pixel_id]
   Environments: Production, Preview, Development
   ```
3. **Faça um novo deploy**

### 3. Pronto! 🎉

O pixel já está funcionando! Eventos sendo rastreados:

- ✅ **PageView** - Toda visita
- ✅ **AddToCart** - Quando adiciona produto
- ✅ **InitiateCheckout** - Quando acessa checkout
- ✅ **Purchase** - Quando finaliza pedido

---

## 🧪 Como Testar

1. Instale o [Facebook Pixel Helper](https://chrome.google.com/webstore/detail/facebook-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc)
2. Acesse seu site
3. Clique no ícone do Pixel Helper
4. Você deve ver: ✅ Pixel detectado e eventos disparados

---

## 📚 Documentação Completa

Para mais detalhes, consulte: **[FACEBOOK_PIXEL_SETUP.md](./FACEBOOK_PIXEL_SETUP.md)**

---

## 🎯 Próximos Passos

1. ✅ Configurar Pixel ID
2. ✅ Testar com Pixel Helper
3. 📊 Criar públicos personalizados no Ads Manager
4. 💰 Criar campanhas de remarketing
5. 📈 Analisar métricas no Events Manager

---

**Dúvidas?** Consulte a documentação completa ou a documentação oficial do Facebook.

