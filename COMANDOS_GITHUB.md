# 🔗 Comandos para Conectar ao GitHub

## Após criar o repositório no GitHub, execute:

```bash
cd /Users/thiagoandrade/CascadeProjects/NATAL25

# Conectar ao repositório remoto (substitua SEU_USUARIO)
git remote add origin https://github.com/thiagoandradebr/natal-thinkfit-2025.git

# Garantir que está na branch main
git branch -M main

# Enviar código para o GitHub
git push -u origin main
```

## Verificar se está conectado:

```bash
git remote -v
```

Deve mostrar:
```
origin  https://github.com/thiagoandradebr/natal-thinkfit-2025.git (fetch)
origin  https://github.com/thiagoandradebr/natal-thinkfit-2025.git (push)
```

