# ⚡ Início Rápido

Comece a usar o Jules Web em menos de 5 minutos!

## 📱 No Termux

```bash
# 1. Clone o repositório
git clone https://github.com/deivid22srk/Jules-web.git
cd Jules-web

# 2. Execute o script de setup
bash setup-termux.sh

# 3. Inicie o servidor
bash start.sh
```

Pronto! Acesse `http://localhost:5173` no navegador.

## 💻 No Desktop (Linux/Mac/Windows)

```bash
# 1. Clone o repositório
git clone https://github.com/deivid22srk/Jules-web.git
cd Jules-web

# 2. Instale dependências
npm install
# ou
bun install

# 3. Inicie
npm run dev
# ou
bun run dev
```

## 🔑 Configurar API Keys

### Jules API Key (Obrigatória)

1. Acesse: [jules.google.com/settings#api](https://jules.google.com/settings#api)
2. Clique em **"Create API Key"**
3. Copie a chave que começa com `AQ.`
4. Cole na interface web em **Configurações**

### OpenRouter API Key (Opcional - para Auto-Fix)

1. Acesse: [openrouter.ai/keys](https://openrouter.ai/keys)
2. Clique em **"Create Key"**
3. Copie a chave que começa com `sk-or-v1-`
4. Cole na interface web em **Configurações**

## 🚀 Primeiros Passos

### 1. Conecte seus repositórios

Antes de usar a interface, você precisa conectar repositórios:

1. Vá para [jules.google.com](https://jules.google.com)
2. Clique em **"Connect Repository"**
3. Instale o Jules GitHub App
4. Selecione os repositórios

### 2. Crie sua primeira Session

Na interface web:

1. Vá para a aba **"Sessions"**
2. Clique em **"Nova Session"**
3. Preencha:
   - **Título**: "Minha primeira tarefa"
   - **Source**: Selecione um repositório
   - **Prompt**: "Criar um arquivo README.md com uma descrição do projeto"
4. Clique em **"Criar Session"**

### 3. Acompanhe o progresso

1. Clique na session criada
2. Veja as atividades em tempo real
3. Aprove planos quando necessário
4. Interaja enviando mensagens

### 4. Teste o Auto-Fix

1. Vá para a aba **"Auto-Fix"**
2. Ative o modo Auto-Fix
3. Use o arquivo de exemplo:
   ```bash
   # Na interface, carregue o arquivo example-error.log
   ```
4. Clique em **"Analisar com DeepSeek"**
5. Veja a análise e envie para o Jules

## 📖 Comandos Úteis

```bash
# Atualizar o projeto
git pull origin main
bun install  # ou npm install

# Parar o servidor
Ctrl + C

# Reiniciar
bash start.sh

# Ver logs
bun run dev --debug

# Build para produção
bun run build
```

## 🆘 Problemas?

### Erro: "Port 5173 already in use"

```bash
killall node
bun run dev
```

### Erro: "Cannot find module"

```bash
rm -rf node_modules
bun install  # ou npm install
```

### Erro: "Invalid API Key"

1. Verifique se copiou a chave completa
2. Tente gerar uma nova chave
3. Verifique se está usando a chave correta (Jules vs OpenRouter)

## 📚 Próximos Passos

- Leia o [README.md](README.md) completo
- Configure no [Termux](TERMUX_SETUP.md)
- Entenda as [API Keys](API_KEYS.md)

## 💡 Dicas

- Use **Ctrl+C** para parar o servidor
- Recarregue a página se algo não atualizar
- As API keys ficam salvas no navegador
- Sessions atualizam automaticamente a cada 5 segundos

---

**Divirta-se! 🎉**

Se precisar de ajuda: [Abra uma issue](https://github.com/deivid22srk/Jules-web/issues)
