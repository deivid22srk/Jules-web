# Jules Web - Interface Mobile para Termux

Interface web completa para controlar o Jules (Google AI Agent) diretamente do Termux no seu dispositivo móvel. Inclui integração com DeepSeek via OpenRouter para análise automática de logs e correção de problemas.

## 🚀 Funcionalidades

- ✅ **Gerenciamento de Sources**: Visualize todos os seus repositórios conectados ao Jules
- ✅ **Gerenciamento de Sessions**: Crie, visualize e interaja com sessions do Jules
- ✅ **Criação de PRs**: Crie Pull Requests automaticamente através da API
- ✅ **Interação em Tempo Real**: Envie mensagens e aprove planos em tempo real
- ✅ **Auto-Fix com DeepSeek**: Analise logs automaticamente e envie instruções de correção para o Jules
- ✅ **Interface Mobile-First**: Design otimizado para uso no Termux

## 📋 Pré-requisitos

### No Termux

```bash
# Atualizar pacotes
pkg update && pkg upgrade

# Instalar Node.js
pkg install nodejs-lts

# Instalar Bun (gerenciador de pacotes)
curl -fsSL https://bun.sh/install | bash

# Reiniciar o Termux
exit
# Abra novamente o Termux

# Instalar Git
pkg install git
```

## 🔧 Instalação

1. **Clone o repositório**

```bash
cd ~
git clone https://github.com/deivid22srk/Jules-web.git
cd Jules-web
```

2. **Instale as dependências**

```bash
bun install
```

3. **Inicie o servidor de desenvolvimento**

```bash
bun run dev
```

4. **Acesse a aplicação**

A aplicação estará disponível em: `http://localhost:5173`

No Termux, você pode acessar através do navegador do seu dispositivo em:
- `http://localhost:5173` ou
- `http://127.0.0.1:5173`

## 🔑 Configuração

### 1. API Key do Jules

1. Acesse [jules.google.com/settings#api](https://jules.google.com/settings#api)
2. Crie uma nova API key
3. Cole a API key na interface web em "Configurações"

### 2. API Key do OpenRouter (para Auto-Fix)

1. Acesse [openrouter.ai](https://openrouter.ai)
2. Crie uma conta e gere uma API key
3. Cole a API key na interface web em "Configurações"

**Nota**: O OpenRouter oferece acesso gratuito ao DeepSeek V3, usado para análise de logs.

## 📱 Como Usar

### Sources (Repositórios)

1. Navegue até a aba "Sources"
2. Visualize todos os repositórios conectados no Jules
3. Use essas sources para criar sessions

### Sessions (Tarefas)

1. Navegue até a aba "Sessions"
2. Clique em "Nova Session" para criar uma tarefa
3. Preencha:
   - **Título**: Nome da tarefa
   - **Source**: Repositório a ser usado
   - **Branch inicial**: Branch de partida (padrão: main)
   - **Prompt**: Descrição do que o Jules deve fazer
   - **Auto PR**: Marque para criar PR automaticamente
4. Clique na session para ver atividades em tempo real
5. Aprove planos quando solicitado
6. Envie mensagens para interagir com o agente

### Auto-Fix (Correção Automática)

1. Navegue até a aba "Auto-Fix"
2. Ative o modo Auto-Fix com o toggle
3. Carregue um arquivo de log (.log ou .txt)
4. Clique em "Analisar com DeepSeek"
5. Revise a análise gerada
6. Escolha:
   - **Criar Nova Session**: Cria uma nova tarefa com as correções
   - **Enviar para Session Existente**: Adiciona as correções a uma session em andamento

## 🎯 Casos de Uso

### 1. Criar uma Feature

```
Título: Adicionar autenticação
Source: seu-repo
Prompt: Implementar sistema de autenticação com JWT incluindo login, logout e middleware de proteção de rotas
```

### 2. Corrigir Bug

```
Título: Corrigir erro de memória
Source: seu-repo
Prompt: Investigar e corrigir o memory leak no componente UserList identificado nos logs
```

### 3. Auto-Fix com Logs

1. Seu aplicativo gera um erro
2. Salve os logs em um arquivo `.log`
3. Use o Auto-Fix para analisar
4. DeepSeek identifica o problema e sugere solução
5. Envie para Jules executar a correção

## 🛠️ Scripts Disponíveis

```bash
# Desenvolvimento
bun run dev

# Build para produção
bun run build

# Preview da build
bun run preview
```

## 📊 API Jules

A aplicação usa a [Jules API](https://developers.google.com/jules/api) oficial do Google para:

- Listar sources (repositórios)
- Criar e gerenciar sessions
- Enviar mensagens
- Aprovar planos
- Listar atividades em tempo real

## 🤖 Integração DeepSeek

O modo Auto-Fix usa o modelo [DeepSeek V3](https://openrouter.ai/deepseek/deepseek-chat-v3-0324:free) através do OpenRouter para:

- Analisar logs de erro
- Identificar causas raiz
- Sugerir soluções
- Gerar instruções para o Jules

## 🌐 Acesso Remoto

Para acessar a aplicação de outros dispositivos na mesma rede:

1. Descubra o IP do seu dispositivo no Termux:
```bash
ifconfig
```

2. Acesse de outro dispositivo:
```
http://SEU_IP:5173
```

## 🔒 Segurança

- As API keys são armazenadas localmente no localStorage do navegador
- Nunca compartilhe suas API keys
- Use HTTPS em produção
- As API keys expostas publicamente serão automaticamente desabilitadas pelo Google

## 🐛 Solução de Problemas

### Erro ao conectar na porta 5173

```bash
# Mate processos na porta
killall node
# Ou use outra porta
bun run dev -- --port 3000
```

### Bun não encontrado após instalação

```bash
# Adicione ao PATH
echo 'export PATH="$HOME/.bun/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

### CORS errors

Se encontrar erros de CORS, isso é normal em desenvolvimento. A API do Jules permite requisições do navegador.

## 📚 Recursos

- [Documentação Jules API](https://developers.google.com/jules/api)
- [OpenRouter Docs](https://openrouter.ai/docs)
- [Termux Wiki](https://wiki.termux.com)

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fazer fork do projeto
2. Criar uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abrir um Pull Request

## 📝 Licença

MIT License - veja LICENSE para detalhes

## 👨‍💻 Autor

David - [@deivid22srk](https://github.com/deivid22srk)

---

Feito com ❤️ para a comunidade Termux
