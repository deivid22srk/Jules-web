# 🔑 Guia de API Keys

Este documento explica como obter e configurar as API keys necessárias para usar o Jules Web.

## 📋 Visão Geral

O Jules Web requer duas API keys:

1. **Jules API Key** (Obrigatória) - Para controlar o Jules
2. **OpenRouter API Key** (Opcional) - Para o recurso de Auto-Fix com DeepSeek

## 1️⃣ Jules API Key

### O que é?

A Jules API Key permite que você acesse programaticamente todas as funcionalidades do Jules (Google AI Agent) para automatizar desenvolvimento de software.

### Como obter:

1. **Acesse o Jules:**
   - Vá para: [jules.google.com](https://jules.google.com)
   - Faça login com sua conta Google

2. **Conecte repositórios (se ainda não fez):**
   - Clique em "Connect Repository"
   - Instale o Jules GitHub App
   - Autorize acesso aos repositórios desejados

3. **Gere a API Key:**
   - Vá para: [jules.google.com/settings#api](https://jules.google.com/settings#api)
   - Clique em "Create API Key"
   - Dê um nome para a chave (ex: "Termux Mobile")
   - Copie a chave gerada

4. **Formato da chave:**
   ```
   AQ.Ab8RN6LY7q3eWYwVUdQUWOCUJdzJO7EIvlCibJP3ZY-TO4-Xmg
   ```
   - Começa com `AQ.`
   - Cerca de 50+ caracteres

### Limitações:

- Máximo de **3 API keys** por conta
- Se uma chave for exposta publicamente, será **automaticamente desabilitada**
- Chaves têm os mesmos privilégios da sua conta Jules

### Segurança:

⚠️ **NUNCA compartilhe sua API key!**

- Não commite no Git
- Não poste em fóruns/chats
- Não compartilhe screenshots com a chave visível
- Use variáveis de ambiente em produção

Se sua chave for comprometida:
1. Vá para [jules.google.com/settings#api](https://jules.google.com/settings#api)
2. Delete a chave comprometida
3. Crie uma nova

## 2️⃣ OpenRouter API Key

### O que é?

OpenRouter é um serviço que fornece acesso unificado a vários modelos de IA, incluindo o DeepSeek V3 (usado no Jules Web para análise de logs).

### Como obter:

1. **Criar conta:**
   - Acesse: [openrouter.ai](https://openrouter.ai)
   - Clique em "Sign In" → "Sign Up"
   - Use Google, GitHub ou email

2. **Gerar API Key:**
   - Após login, vá para: [openrouter.ai/keys](https://openrouter.ai/keys)
   - Clique em "Create Key"
   - Dê um nome (ex: "Jules Web Auto-Fix")
   - Copie a chave gerada

3. **Formato da chave:**
   ```
   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
   ```
   - Começa com `sk-or-v1-`
   - 64 caracteres hexadecimais após o prefixo

### Plano Gratuito:

OpenRouter oferece acesso **GRATUITO** ao DeepSeek V3:
- Modelo: `deepseek/deepseek-chat-v3-0324:free`
- Limite: Varia conforme disponibilidade
- Ideal para análise de logs

### Custos (Opcional):

Se quiser usar modelos pagos:
1. Adicione créditos em [openrouter.ai/credits](https://openrouter.ai/credits)
2. Modelos pagos geralmente custam entre $0.001 - $0.01 por 1K tokens

### Segurança:

⚠️ **NUNCA compartilhe sua API key!**

Se comprometida:
1. Vá para [openrouter.ai/keys](https://openrouter.ai/keys)
2. Delete a chave comprometida
3. Crie uma nova

## 🔧 Configurar no Jules Web

### Método 1: Interface Web (Recomendado)

1. Inicie o Jules Web:
   ```bash
   bun run dev
   ```

2. Abra no navegador: `http://localhost:5173`

3. Clique em "Configurações" (ícone de engrenagem)

4. Cole as API keys:
   - **Jules API Key**: Cole a chave que começa com `AQ.`
   - **OpenRouter API Key**: Cole a chave que começa com `sk-or-v1-`

5. Clique em "Salvar Configurações"

6. As chaves são salvas no localStorage do navegador

### Método 2: Variáveis de Ambiente (Avançado)

Para desenvolvimento:

```bash
# Criar arquivo .env
echo 'VITE_JULES_API_KEY=AQ.SuaChaveAqui' > .env
echo 'VITE_OPENROUTER_API_KEY=sk-or-v1-SuaChaveAqui' >> .env
```

⚠️ Lembre-se de adicionar `.env` ao `.gitignore`!

## ✅ Testar Configuração

### Testar Jules API:

1. Vá para a aba "Sources"
2. Clique em "Atualizar"
3. Seus repositórios devem aparecer

Se der erro:
- ✅ Verifique se a chave está correta
- ✅ Confirme que você tem repositórios conectados no [jules.google.com](https://jules.google.com)
- ✅ Tente gerar uma nova API key

### Testar OpenRouter API:

1. Vá para a aba "Auto-Fix"
2. Carregue o arquivo `example-error.log`
3. Clique em "Analisar com DeepSeek"
4. Uma análise deve aparecer em alguns segundos

Se der erro:
- ✅ Verifique se a chave está correta
- ✅ Confirme que você tem créditos (gratuitos) disponíveis
- ✅ Tente uma nova requisição (pode ser rate limit temporário)

## 🆘 Problemas Comuns

### "Invalid API Key"

**Jules:**
- Copie a chave novamente do [site oficial](https://jules.google.com/settings#api)
- Certifique-se de copiar a chave completa
- Tente gerar uma nova chave

**OpenRouter:**
- Copie a chave novamente do [painel](https://openrouter.ai/keys)
- Verifique se não há espaços extras
- Tente gerar uma nova chave

### "Unauthorized" ou "403 Forbidden"

- A chave pode ter sido revogada
- Você pode ter atingido o limite de uso
- Gere uma nova chave

### "Rate Limited"

**Jules:**
- A API tem limites de taxa
- Espere alguns minutos antes de tentar novamente

**OpenRouter (gratuito):**
- O plano gratuito tem limites
- Espere alguns minutos
- Ou considere adicionar créditos pagos

### API Key desaparece após recarregar

- Verifique se o navegador não está em modo privado/anônimo
- localStorage pode estar desabilitado
- Tente outro navegador

## 📚 Recursos Adicionais

### Jules API:
- [Documentação oficial](https://developers.google.com/jules/api)
- [Referência REST](https://developers.google.com/jules/api/reference/rest)
- [Exemplos](https://developers.google.com/jules/api#quickstart)

### OpenRouter:
- [Documentação](https://openrouter.ai/docs)
- [Modelos disponíveis](https://openrouter.ai/models)
- [Preços](https://openrouter.ai/docs#models)

## 💡 Dicas

1. **Organize suas chaves:**
   - Use um gerenciador de senhas
   - Anote onde cada chave é usada
   - Documente quando foram criadas

2. **Rotação de chaves:**
   - Considere trocar chaves periodicamente
   - Especialmente se forem usadas em múltiplos dispositivos

3. **Múltiplas chaves:**
   - Crie chaves diferentes para diferentes dispositivos
   - Facilita rastrear uso e revogar se necessário

4. **Backup:**
   - Tenha backup das suas chaves em local seguro
   - Use um cofre de senhas criptografado

---

**Agora você está pronto para usar o Jules Web! 🚀**
