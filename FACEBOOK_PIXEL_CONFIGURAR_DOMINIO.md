# 🔧 Configurar Domínio no Facebook Events Manager

## ❌ Problema Atual
- Events Manager mostra: "0 sites: Nenhum site encontrado"
- Nenhuma atividade registrada
- Eventos não aparecem no dashboard

## ✅ Solução: Adicionar Domínio ao Pixel

---

## 📋 PASSO 1: Acessar Configurações do Pixel

1. Acesse: **https://business.facebook.com/events_manager2**
2. No menu lateral, clique em **"Conjuntos de dados"** (Data Sets)
3. Selecione seu pixel: **"NATAL"** (ID: 592535497822145)
4. Clique na aba **"Configurações"** (Settings)

---

## 📋 PASSO 2: Adicionar Domínio

1. Na página de Configurações, procure a seção **"Domínios"** ou **"Domains"**
2. Clique em **"Adicionar domínio"** ou **"Add Domain"**
3. Digite seu domínio: **`natal.thinkfitbrasil.com.br`**
4. Clique em **"Adicionar"** ou **"Add"**

**Importante:** 
- Não inclua `https://` ou `http://`
- Apenas o domínio: `natal.thinkfitbrasil.com.br`

---

## 📋 PASSO 3: Verificar Domínio (Opcional mas Recomendado)

O Facebook pode pedir verificação do domínio. Se aparecer:

1. **Método 1: Meta Tag (Mais Fácil)**
   - Copie a meta tag fornecida pelo Facebook
   - Adicione no `<head>` do seu site (já temos o layout.tsx)
   - Ou adicione via Vercel → Settings → Domains → Meta Tags

2. **Método 2: DNS (Mais Técnico)**
   - Adicione um registro TXT no DNS do seu domínio
   - Siga as instruções do Facebook

**Nota:** Para a maioria dos casos, você pode pular a verificação e os eventos ainda funcionarão.

---

## 📋 PASSO 4: Usar "Eventos de Teste" (Para Ver em Tempo Real)

Mesmo sem configurar o domínio, você pode ver eventos em tempo real:

1. No Events Manager, vá na aba **"Eventos de Teste"** (Test Events)
2. Clique em **"Abrir site"** ou **"Open Website"**
3. Digite a URL: `https://natal.thinkfitbrasil.com.br`
4. Uma nova aba abrirá com seu site
5. **Navegue pelo site:**
   - Adicione produtos ao carrinho
   - Vá para checkout
   - Finalize um pedido
6. **Volte para o Events Manager**
7. Você verá os eventos aparecendo em **tempo real** na aba "Eventos de Teste"

---

## 📋 PASSO 5: Ajustar Intervalo de Datas

O intervalo de datas está mostrando **outubro-novembro de 2025** (futuro).

1. Clique no seletor de datas no topo
2. Selecione: **"Últimos 7 dias"** ou **"Hoje"**
3. Ou escolha um intervalo que inclua a data atual

---

## ✅ Após Configurar

### O que você verá:

1. **Na aba "Visão Geral":**
   - Gráficos de eventos ao longo do tempo
   - Total de eventos por tipo
   - Estatísticas de conversão

2. **Na aba "Eventos de Teste":**
   - Eventos em tempo real enquanto navega
   - Detalhes de cada evento disparado

3. **Na seção "Domínios":**
   - Seu domínio `natal.thinkfitbrasil.com.br` listado
   - Status de verificação (se aplicável)

---

## 🎯 Resumo Rápido

1. **Events Manager** → Seu Pixel → **"Configurações"**
2. **"Adicionar domínio"** → `natal.thinkfitbrasil.com.br`
3. **"Eventos de Teste"** → Para ver eventos em tempo real
4. **Ajustar datas** → Selecionar período atual

---

## ⚠️ Importante

- **Eventos de Teste** mostra eventos em tempo real (útil para debug)
- **Visão Geral** mostra eventos históricos (pode levar alguns minutos para aparecer)
- O domínio não precisa estar verificado para os eventos funcionarem
- Os eventos já estão sendo enviados (Pixel Helper confirma), só precisam aparecer no dashboard

---

**Dúvidas?** Use "Eventos de Teste" para verificar se os eventos estão sendo disparados corretamente!

