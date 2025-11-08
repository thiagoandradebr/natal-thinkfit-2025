# 🔐 Como Criar Usuário Admin no Supabase

O erro 400 indica que o usuário `thiagoarj@gmail.com` não existe no Supabase Auth. Siga um dos métodos abaixo para criar o usuário.

## Método 1: Via Dashboard do Supabase (Mais Fácil) ⭐

1. Acesse o [Dashboard do Supabase](https://supabase.com/dashboard)
2. Selecione o projeto: **SaaS ThinkFIT** (ID: `uixdfvrbwwvvwyiwxgmd`)
3. Vá em **Authentication** → **Users** no menu lateral
4. Clique em **Add User** → **Create new user**
5. Preencha:
   - **Email**: `thiagoarj@gmail.com`
   - **Password**: `17655528`
   - **Auto Confirm User**: ✅ (marcar esta opção)
6. Clique em **Create User**

## Método 2: Via API (Usando Service Role)

Se você tem a `SUPABASE_SERVICE_ROLE_KEY` configurada, pode usar a API que criamos:

```bash
curl -X POST http://localhost:3004/api/admin/create-user \
  -H "Content-Type: application/json" \
  -d '{
    "email": "thiagoarj@gmail.com",
    "password": "17655528"
  }'
```

**⚠️ IMPORTANTE**: Esta rota só funciona se você tiver `SUPABASE_SERVICE_ROLE_KEY` configurada no `.env.local`.

## Método 3: Via SQL (Avançado)

Execute no SQL Editor do Supabase:

```sql
-- Criar usuário via função do Supabase
SELECT auth.users.create_user(
  email := 'thiagoarj@gmail.com',
  password := '17655528',
  email_confirm := true
);
```

**Nota**: Este método pode não funcionar dependendo da versão do Supabase.

## Verificar se o Usuário Foi Criado

1. No Dashboard do Supabase: **Authentication** → **Users**
2. Procure por `thiagoarj@gmail.com`
3. Se existir, o usuário está criado e você pode fazer login

## Troubleshooting

### Erro: "User already exists"
- O usuário já existe, mas pode ter senha diferente
- Use "Reset Password" no Dashboard do Supabase

### Erro: "Invalid email format"
- Verifique se o email está correto: `thiagoarj@gmail.com`

### Erro: "Password too weak"
- A senha deve ter no mínimo 6 caracteres
- Use uma senha mais forte se necessário

## Após Criar o Usuário

1. Volte para a página de login: `http://localhost:3004/admin/login`
2. Digite:
   - **Email**: `thiagoarj@gmail.com`
   - **Senha**: `17655528`
3. Clique em **Entrar**

---

**Projeto Supabase**: SaaS ThinkFIT  
**Project ID**: `uixdfvrbwwvvwyiwxgmd`  
**Status**: ACTIVE_HEALTHY ✅

