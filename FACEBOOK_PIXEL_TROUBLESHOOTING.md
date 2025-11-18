# 🔧 Facebook Pixel - Solução de Problemas

## ❌ Problema: Pixel não está sendo detectado

O Meta Pixel Helper mostra: **"No pixel found"**

---

## 🔍 Diagnóstico Passo a Passo

### PASSO 1: Verificar se a variável está configurada no Vercel

1. Acesse: **https://vercel.com**
2. Vá no projeto: **natal-thinkfit-2025**
3. Clique em **Settings** → **Environment Variables**
4. Procure por: `NEXT_PUBLIC_FACEBOOK_PIXEL_ID`

**Se NÃO encontrar:**
- ❌ A variável não foi adicionada
- ✅ **Solução:** Adicione agora (veja PASSO 2)

**Se encontrar mas o valor está vazio ou errado:**
- ❌ Valor incorreto
- ✅ **Solução:** Edite e coloque: `592535497822145`

---

### PASSO 2: Adicionar/Corrigir a Variável no Vercel

1. No Vercel, vá em **Settings** → **Environment Variables**
2. Se a variável não existe, clique em **"Add New"**
3. Se existe, clique nos **3 pontinhos** → **"Edit"**

4. Preencha:
   ```
   Key: NEXT_PUBLIC_FACEBOOK_PIXEL_ID
   Value: 592535497822145
   ```

5. **IMPORTANTE:** Marque TODOS os ambientes:
   - ☑ Production
   - ☑ Preview  
   - ☑ Development

6. Clique em **"Save"**

---

### PASSO 3: Fazer Novo Deploy (OBRIGATÓRIO!)

⚠️ **CRÍTICO:** Após adicionar/editar variáveis, você DEVE fazer um novo deploy!

**Opção A: Redeploy (Mais Rápido)**
1. Vá em **Deployments**
2. Clique nos **3 pontinhos (...)** do último deploy
3. Selecione **"Redeploy"**
4. Aguarde 2-5 minutos

**Opção B: Deploy via Git**
1. Faça um commit qualquer:
   ```bash
   git commit --allow-empty -m "Trigger deploy for Facebook Pixel"
   git push origin main
   ```
2. O Vercel fará deploy automaticamente

---

### PASSO 4: Verificar no Console do Navegador

1. Acesse seu site: `https://natal.thinkfitbrasil.com.br`
2. Abra o DevTools (F12)
3. Vá na aba **Console**
4. Procure por mensagens do Facebook Pixel:

**Se você ver:**
- ✅ `✅ [Facebook Pixel] Inicializando com ID: 592535497822145` → **Funcionando!**
- ❌ `⚠️ [Facebook Pixel] Pixel ID não configurado!` → Variável não configurada
- ❌ `❌ [Facebook Pixel] Pixel ID não encontrado` → Variável não configurada

---

### PASSO 5: Verificar no Código-Fonte da Página

1. No site, clique com botão direito → **"Ver código-fonte"** (ou Ctrl+U)
2. Procure por: `fbq` ou `592535497822145`
3. Se encontrar → Pixel está sendo carregado
4. Se NÃO encontrar → Variável não está configurada ou deploy não foi feito

---

## ✅ Checklist de Verificação

Marque cada item:

- [ ] Variável `NEXT_PUBLIC_FACEBOOK_PIXEL_ID` existe no Vercel
- [ ] Valor da variável é `592535497822145` (sem espaços)
- [ ] Todos os ambientes estão marcados (Production, Preview, Development)
- [ ] Fiz um novo deploy APÓS adicionar/editar a variável
- [ ] Aguardei 2-5 minutos após o deploy
- [ ] Console do navegador mostra mensagem de inicialização
- [ ] Código-fonte da página contém `fbq` ou o Pixel ID

---

## 🎯 Solução Rápida (Se ainda não funcionar)

### 1. Verificar Variável no Vercel

```bash
# Acesse: https://vercel.com
# Settings → Environment Variables
# Procure: NEXT_PUBLIC_FACEBOOK_PIXEL_ID
# Valor deve ser: 592535497822145
```

### 2. Forçar Novo Deploy

No Vercel:
1. **Deployments** → Último deploy → **3 pontinhos** → **"Redeploy"**
2. Aguarde completar

### 3. Limpar Cache e Testar

1. Limpe o cache do navegador (Ctrl+Shift+Delete)
2. Acesse o site em modo anônimo
3. Abra o DevTools (F12) → Console
4. Verifique as mensagens do pixel

---

## 🔍 Verificação Avançada

### Verificar se a variável está disponível no build

1. No Vercel, vá no último deploy
2. Clique em **"Logs"**
3. Procure por erros relacionados a `NEXT_PUBLIC_FACEBOOK_PIXEL_ID`

### Verificar no código-fonte

1. Acesse: `https://natal.thinkfitbrasil.com.br`
2. Abra DevTools (F12) → **Network**
3. Recarregue a página
4. Procure por requisições para `facebook.net` ou `fbevents.js`
5. Se encontrar → Pixel está carregando!

---

## 📞 Se Ainda Não Funcionar

### Verificar:

1. **Bloqueadores de anúncios:** Desative temporariamente
2. **Extensões do navegador:** Teste em modo anônimo
3. **Domínio:** Verifique se o domínio está configurado no Facebook Pixel
4. **Tempo:** Aguarde 10-15 minutos após o deploy (pode haver delay)

### Adicionar domínio no Facebook:

1. Acesse: https://business.facebook.com/events_manager2
2. Selecione seu pixel
3. Vá em **Settings** → **Domains**
4. Adicione: `natal.thinkfitbrasil.com.br`

---

## ✅ Quando Estiver Funcionando

Você verá no Meta Pixel Helper:
- ✅ **Pixel ID:** 592535497822145
- ✅ **PageView** (evento detectado)

E no Events Manager:
- ✅ Eventos aparecendo em tempo real
- ✅ Atividade sendo registrada

---

**Dúvidas?** Verifique cada passo acima e certifique-se de que fez o deploy após adicionar a variável!

