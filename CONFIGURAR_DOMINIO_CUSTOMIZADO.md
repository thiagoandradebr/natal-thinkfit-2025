# 🌐 Configurar Domínio Customizado - natal.thinkfitbrasil.com.br

Este guia mostra como configurar o domínio `natal.thinkfitbrasil.com.br` no Vercel.

---

## 📋 Pré-requisitos

- ✅ Projeto já deployado no Vercel
- ✅ Acesso ao painel de controle do domínio `thinkfitbrasil.com.br`
- ✅ Acesso ao dashboard do Vercel

---

## 🎯 Passo 1: Adicionar Domínio no Vercel

### 1.1. Acesse as Configurações do Projeto

1. No dashboard do Vercel, clique no projeto **natal-thinkfit-2025**
2. Vá em **Settings** (no menu lateral)
3. Clique em **Domains**

### 1.2. Adicionar Domínio

1. No campo **"Add Domain"**, digite: `natal.thinkfitbrasil.com.br`
2. Clique em **"Add"**
3. O Vercel mostrará as instruções de configuração DNS

---

## 🔧 Passo 2: Configurar DNS no Provedor do Domínio

O Vercel fornecerá instruções específicas. Geralmente você precisa adicionar um dos seguintes:

### Opção A: Registro CNAME (Recomendado para subdomínios)

1. Acesse o painel de controle do seu domínio (onde você gerencia `thinkfitbrasil.com.br`)
2. Vá para a seção de **DNS** ou **Zone Records**
3. Adicione um novo registro:

```
Tipo: CNAME
Nome/Host: natal
Valor/Destino: cname.vercel-dns.com
TTL: 3600 (ou padrão)
```

### Opção B: Registro A (Alternativa)

Se o provedor não suportar CNAME para subdomínios:

```
Tipo: A
Nome/Host: natal
Valor/Destino: 76.76.21.21
TTL: 3600
```

**Nota**: O IP pode variar. Use o que o Vercel fornecer nas instruções.

---

## ⏳ Passo 3: Aguardar Propagação DNS

1. Após adicionar o registro DNS, aguarde **5-60 minutos** para propagação
2. No Vercel, o status do domínio mudará de **"Pending"** para **"Valid"** quando estiver configurado corretamente
3. Você pode verificar o status em **Settings → Domains**

---

## 🔐 Passo 4: Atualizar Variável de Ambiente

Após o domínio estar funcionando:

1. No Vercel, vá em **Settings → Environment Variables**
2. Encontre a variável `NEXT_PUBLIC_SITE_URL`
3. Atualize o valor para: `https://natal.thinkfitbrasil.com.br`
4. Selecione os ambientes: **Production**, **Preview**, **Development**
5. Salve
6. Faça um **Redeploy** do projeto

---

## ✅ Passo 5: Verificar SSL/HTTPS

O Vercel configura automaticamente o certificado SSL (HTTPS) para o domínio. Isso pode levar alguns minutos após a configuração DNS.

Você pode verificar:
- **Settings → Domains** → Status do certificado SSL
- Acesse `https://natal.thinkfitbrasil.com.br` no navegador

---

## 🧪 Passo 6: Testar

1. Acesse: `https://natal.thinkfitbrasil.com.br`
2. Verifique se:
   - ✅ Site carrega corretamente
   - ✅ HTTPS está funcionando (cadeado verde no navegador)
   - ✅ Todas as funcionalidades estão operacionais
   - ✅ Links internos funcionam

---

## 🔄 Passo 7: Redirecionar Domínio Antigo (Opcional)

Se quiser redirecionar a URL antiga do Vercel para o novo domínio:

1. No Vercel, vá em **Settings → Domains**
2. Adicione o domínio antigo (`natal-thinkfit-2025.vercel.app`)
3. Configure redirecionamento para `natal.thinkfitbrasil.com.br`

---

## 🆘 Problemas Comuns

### Domínio não está funcionando

**Causa**: DNS ainda não propagou ou configuração incorreta
**Solução**: 
- Aguarde mais tempo (pode levar até 24h)
- Verifique se o registro DNS está correto
- Use ferramentas como `dig natal.thinkfitbrasil.com.br` ou `nslookup` para verificar

### Erro "Invalid Configuration"

**Causa**: Registro DNS incorreto
**Solução**: 
- Verifique se o tipo de registro está correto (CNAME ou A)
- Confirme que o valor/destino está correto
- Verifique se não há conflitos com outros registros

### SSL não está funcionando

**Causa**: Certificado ainda está sendo gerado
**Solução**: 
- Aguarde alguns minutos
- O Vercel gera automaticamente via Let's Encrypt
- Se persistir, entre em contato com o suporte do Vercel

### Site não carrega no novo domínio

**Causa**: Variável `NEXT_PUBLIC_SITE_URL` não atualizada
**Solução**: 
- Atualize a variável de ambiente no Vercel
- Faça um redeploy

---

## 📞 Precisa de Ajuda?

Se tiver dúvidas sobre:
- **Configuração DNS**: Consulte a documentação do seu provedor de domínio
- **Vercel**: Consulte [docs.vercel.com](https://vercel.com/docs/concepts/projects/domains)
- **Problemas técnicos**: Verifique os logs no Vercel em **Deployments → Logs**

---

## 📝 Checklist Final

- [ ] Domínio adicionado no Vercel
- [ ] Registro DNS configurado no provedor
- [ ] DNS propagado (status "Valid" no Vercel)
- [ ] SSL/HTTPS funcionando
- [ ] Variável `NEXT_PUBLIC_SITE_URL` atualizada
- [ ] Redeploy feito
- [ ] Site testado no novo domínio

---

**Pronto!** Seu site estará acessível em `https://natal.thinkfitbrasil.com.br` 🎉

