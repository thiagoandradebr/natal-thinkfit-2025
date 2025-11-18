# 🎯 Facebook Pixel - Configuração Passo a Passo

## ✅ Seu Pixel ID
**ID do Pixel:** `592535497822145`

---

## 📋 PASSO 1: Acessar o Vercel

1. Acesse: **https://vercel.com**
2. Faça login com sua conta (GitHub, GitLab ou email)
3. No dashboard, encontre e clique no projeto **"natal-thinkfit-2025"** (ou o nome do seu projeto)

---

## 📋 PASSO 2: Ir para Configurações

1. No menu lateral esquerdo, clique em **"Settings"** (Configurações)
2. No menu de Settings, clique em **"Environment Variables"** (Variáveis de Ambiente)

---

## 📋 PASSO 3: Adicionar a Variável do Facebook Pixel

1. Clique no botão **"Add New"** (Adicionar Nova) ou **"Add"** (Adicionar)

2. Preencha os campos:

   **Key (Chave):**
   ```
   NEXT_PUBLIC_FACEBOOK_PIXEL_ID
   ```

   **Value (Valor):**
   ```
   592535497822145
   ```

3. **IMPORTANTE:** Marque TODOS os ambientes:
   - ☑ **Production** (Produção)
   - ☑ **Preview** (Preview)
   - ☑ **Development** (Desenvolvimento)

4. Clique em **"Save"** (Salvar)

---

## 📋 PASSO 4: Fazer Deploy (Se necessário)

### Se você acabou de adicionar a variável:

1. Vá para a aba **"Deployments"** (Deploys) no menu lateral
2. Clique nos **3 pontinhos (...)** do último deploy
3. Selecione **"Redeploy"** (Refazer Deploy)
4. Aguarde o deploy completar (2-5 minutos)

**OU**

Se você tem mudanças no código para fazer deploy:

1. Faça commit e push das mudanças:
   ```bash
   git add .
   git commit -m "Adicionar Facebook Pixel"
   git push origin main
   ```
2. O Vercel fará deploy automaticamente

---

## 📋 PASSO 5: Verificar se Está Funcionando

### Método 1: Facebook Pixel Helper (Recomendado)

1. **Instale a extensão:**
   - Chrome: https://chrome.google.com/webstore/detail/facebook-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc
   - Clique em **"Adicionar ao Chrome"**

2. **Teste no site:**
   - Acesse seu site: `https://seu-site.vercel.app`
   - Clique no ícone do **Facebook Pixel Helper** na barra de ferramentas
   - Você deve ver:
     - ✅ **Pixel ID:** 592535497822145
     - ✅ **PageView** (evento detectado)

3. **Teste eventos:**
   - Adicione um produto ao carrinho → Deve aparecer **AddToCart**
   - Vá para checkout → Deve aparecer **InitiateCheckout**
   - Finalize um pedido → Deve aparecer **Purchase**

### Método 2: Events Manager (Facebook)

1. Acesse: **https://business.facebook.com/events_manager2**
2. Selecione seu pixel: **"Pixel de Thiago Andrade"**
3. Clique em **"Test Events"** (Eventos de Teste) no menu lateral
4. Acesse seu site em outra aba
5. Você verá os eventos aparecendo em tempo real!

---

## ✅ Checklist de Configuração

Marque cada item conforme for completando:

- [ ] **PASSO 1:** Acessei o Vercel e encontrei meu projeto
- [ ] **PASSO 2:** Fui em Settings → Environment Variables
- [ ] **PASSO 3:** Adicionei a variável `NEXT_PUBLIC_FACEBOOK_PIXEL_ID` com valor `592535497822145`
- [ ] **PASSO 3:** Marquei todos os ambientes (Production, Preview, Development)
- [ ] **PASSO 4:** Fiz um novo deploy (ou redeploy)
- [ ] **PASSO 5:** Instalei o Facebook Pixel Helper
- [ ] **PASSO 5:** Testei e vi o pixel funcionando no site
- [ ] **PASSO 5:** Testei eventos (AddToCart, InitiateCheckout, Purchase)

---

## 🎯 O que Acontece Agora?

Após configurar, o Facebook Pixel vai automaticamente:

1. ✅ **Rastrear todas as visitas** (PageView)
2. ✅ **Rastrear quando alguém adiciona produto ao carrinho** (AddToCart)
3. ✅ **Rastrear quando alguém acessa o checkout** (InitiateCheckout)
4. ✅ **Rastrear quando alguém finaliza um pedido** (Purchase)

---

## 📊 Onde Ver os Dados?

### Events Manager (Facebook)
- Acesse: https://business.facebook.com/events_manager2
- Selecione seu pixel
- Veja todos os eventos rastreados

### Ads Manager (Para Anúncios)
- Acesse: https://business.facebook.com/adsmanager
- Crie campanhas usando os dados do pixel
- Otimize para conversões

---

## 🔧 Problemas Comuns

### ❌ Pixel não aparece no Pixel Helper

**Solução:**
1. Aguarde 5-10 minutos após o deploy
2. Limpe o cache do navegador (Ctrl+Shift+Delete)
3. Verifique se a variável está configurada corretamente no Vercel
4. Verifique se fez deploy após adicionar a variável

### ❌ Eventos não estão sendo disparados

**Solução:**
1. Verifique o console do navegador (F12) para erros
2. Certifique-se de que o JavaScript está habilitado
3. Teste em modo anônimo (sem bloqueadores de anúncios)

### ❌ Dados não aparecem no Events Manager

**Solução:**
1. Aguarde alguns minutos (pode haver delay)
2. Use o modo "Test Events" para ver em tempo real
3. Verifique se está usando o Pixel ID correto

---

## 📞 Precisa de Ajuda?

- 📚 **Documentação completa:** Veja `FACEBOOK_PIXEL_SETUP.md`
- 🔍 **Troubleshooting:** Veja a seção de problemas acima
- 📖 **Documentação Facebook:** https://developers.facebook.com/docs/meta-pixel

---

## 🎉 Pronto!

Seu Facebook Pixel está configurado! Agora você pode:

- 📊 Ver métricas detalhadas
- 🎯 Criar públicos personalizados
- 💰 Fazer anúncios pagos otimizados
- 📈 Medir ROI das campanhas

**Boa sorte com suas campanhas! 🚀**

