# Guia de Configuração no Termux

Este guia detalha passo a passo como instalar e executar o Jules Web no Termux.

## 📱 Passo 1: Preparar o Termux

### Instalar Termux

1. Baixe o Termux da [F-Droid](https://f-droid.org/packages/com.termux/) (recomendado)
   - **NÃO use a versão da Play Store** (está desatualizada)
2. Abra o Termux

### Atualizar Pacotes

```bash
# Atualizar repositórios
pkg update -y

# Fazer upgrade de todos os pacotes
pkg upgrade -y
```

## 🔧 Passo 2: Instalar Dependências

### Node.js

```bash
# Instalar Node.js LTS
pkg install nodejs-lts -y

# Verificar instalação
node --version
npm --version
```

### Bun (Opcional mas Recomendado)

```bash
# Instalar Bun
curl -fsSL https://bun.sh/install | bash

# Reiniciar o terminal
exit
# Abra o Termux novamente

# Verificar instalação
bun --version
```

Se o Bun não for reconhecido, adicione ao PATH:

```bash
echo 'export PATH="$HOME/.bun/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

### Git

```bash
# Instalar Git
pkg install git -y

# Verificar instalação
git --version
```

## 📦 Passo 3: Clonar e Configurar o Projeto

### Clonar Repositório

```bash
# Ir para o diretório home
cd ~

# Clonar o projeto
git clone https://github.com/deivid22srk/Jules-web.git

# Entrar no diretório
cd Jules-web
```

### Instalar Dependências do Projeto

**Com Bun (recomendado):**
```bash
bun install
```

**Com NPM:**
```bash
npm install
```

## 🚀 Passo 4: Iniciar a Aplicação

### Modo Desenvolvimento

**Com Bun:**
```bash
bun run dev
```

**Com NPM:**
```bash
npm run dev
```

Você verá uma mensagem como:
```
VITE v5.1.4  ready in 437 ms

➜  Local:   http://localhost:5173/
➜  Network: http://192.168.1.10:5173/
```

### Acessar a Aplicação

1. **No mesmo dispositivo:**
   - Abra o navegador e vá para: `http://localhost:5173`

2. **De outro dispositivo na mesma rede WiFi:**
   - Use o endereço Network mostrado (ex: `http://192.168.1.10:5173`)

## 🔑 Passo 5: Configurar API Keys

### Obter Jules API Key

1. No navegador, acesse: [jules.google.com/settings#api](https://jules.google.com/settings#api)
2. Faça login com sua conta Google
3. Clique em "Create API Key"
4. Copie a chave gerada (começa com `AQ.`)

### Obter OpenRouter API Key (Opcional)

1. Acesse: [openrouter.ai](https://openrouter.ai)
2. Faça login ou crie uma conta
3. Vá para: [openrouter.ai/keys](https://openrouter.ai/keys)
4. Clique em "Create Key"
5. Copie a chave gerada (começa com `sk-or-v1-`)

### Configurar na Interface

1. Abra `http://localhost:5173` no navegador
2. Expanda a seção "Configurações"
3. Cole as API keys nos campos apropriados:
   - **Jules API Key**: Para usar a API do Jules
   - **OpenRouter API Key**: Para usar o recurso de Auto-Fix
4. Clique em "Salvar Configurações"

## 📊 Passo 6: Usar a Aplicação

### Conectar Repositórios (Primeira Vez)

1. Acesse [jules.google.com](https://jules.google.com) no navegador
2. Conecte seus repositórios GitHub
3. Instale o Jules GitHub App nos repositórios desejados

### Na Interface Jules Web

1. **Aba Sources:**
   - Visualize seus repositórios conectados
   
2. **Aba Sessions:**
   - Crie novas tarefas para o Jules
   - Acompanhe o progresso em tempo real
   - Interaja com o agente

3. **Aba Auto-Fix:**
   - Carregue logs de erro
   - Analise com DeepSeek
   - Envie correções para o Jules

## 🛠️ Dicas e Truques

### Manter o Termux Ativo

Por padrão, o Android pode matar o Termux em background. Para evitar:

1. Adquira o **Termux:Boot** (F-Droid)
2. Use o **Wake Lock** do Termux:
   ```bash
   termux-wake-lock
   ```

### Rodar em Background

```bash
# Iniciar em background
bun run dev > /dev/null 2>&1 &

# Ver processos
jobs

# Trazer de volta
fg %1
```

### Usar Multiplexador de Terminal

Instale o `tmux` para múltiplas sessões:

```bash
pkg install tmux -y

# Iniciar tmux
tmux

# Dividir tela: Ctrl+B depois "
# Navegar: Ctrl+B depois seta
# Desconectar: Ctrl+B depois D
# Reconectar: tmux attach
```

### Acessar de Fora da Rede Local

Use **ngrok** para expor o servidor:

```bash
# Instalar ngrok
pkg install wget -y
cd ~
wget https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-linux-arm64.tgz
tar xvzf ngrok-v3-stable-linux-arm64.tgz
mv ngrok ~/.local/bin/

# Registrar no ngrok.com e obter authtoken
ngrok config add-authtoken SEU_TOKEN

# Expor porta 5173
ngrok http 5173
```

Você receberá uma URL pública como: `https://abc123.ngrok.io`

## 🐛 Solução de Problemas Comuns

### Erro: "Cannot find module"

```bash
# Limpar cache e reinstalar
rm -rf node_modules
rm bun.lockb
bun install
```

### Erro: "Port 5173 already in use"

```bash
# Matar processos Node
killall node

# Ou usar outra porta
bun run dev -- --port 3000
```

### Termux muito lento

```bash
# Limpar cache do Termux
pkg clean

# Aumentar memória disponível (root necessário)
sysctl -w vm.overcommit_memory=1
```

### Build falha por falta de memória

```bash
# Usar apenas 1 thread
NODE_OPTIONS="--max-old-space-size=512" bun run build
```

### Bun não funciona no seu dispositivo

Use NPM em vez disso:
```bash
npm run dev
npm run build
```

## 📱 Atalhos Úteis do Termux

- **Ctrl + C**: Interromper processo
- **Ctrl + D**: Sair do Termux
- **Volume Baixo + C**: Ctrl
- **Volume Baixo + V**: Cole
- **Volume Baixo + X**: Fechar teclado
- **Arrastar para esquerda**: Menu do Termux

## 🔄 Atualizar o Projeto

```bash
cd ~/Jules-web
git pull origin main
bun install
bun run dev
```

## 💾 Fazer Backup das Configurações

As API keys são salvas no localStorage do navegador. Para backup:

1. Na interface, anote suas API keys
2. Ou exporte do navegador (Dev Tools > Application > Local Storage)

## 📞 Suporte

Se encontrar problemas:

1. Verifique se todos os pacotes estão atualizados
2. Consulte o [README.md](README.md) principal
3. Abra uma issue no [GitHub](https://github.com/deivid22srk/Jules-web/issues)

---

**Divirta-se usando o Jules Web no Termux! 🚀**
