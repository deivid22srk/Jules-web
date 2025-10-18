import axios from 'axios';

const OPENROUTER_API_BASE = 'https://openrouter.ai/api/v1';

export class DeepSeekAPI {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async analyzeLogs(logs: string): Promise<string> {
    try {
      const response = await axios.post(
        `${OPENROUTER_API_BASE}/chat/completions`,
        {
          model: 'deepseek/deepseek-chat-v3-0324:free',
          messages: [
            {
              role: 'system',
              content: 'Você é um assistente especializado em análise de logs de desenvolvimento. Analise os logs fornecidos e forneça instruções claras e concisas sobre como corrigir os problemas encontrados. Seja direto e objetivo nas suas instruções.',
            },
            {
              role: 'user',
              content: `Analise os seguintes logs e forneça instruções para correção:\n\n${logs}`,
            },
          ],
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://jules-web.termux.app',
            'X-Title': 'Jules Web Termux',
          },
        }
      );

      if (!response.data || !response.data.choices || !response.data.choices[0]) {
        throw new Error('Resposta inválida da API');
      }

      return response.data.choices[0].message.content;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          throw new Error('API Key do OpenRouter inválida ou expirada. Verifique sua chave nas configurações.');
        } else if (error.response?.status === 429) {
          throw new Error('Limite de requisições atingido. Aguarde alguns minutos e tente novamente.');
        } else if (error.response?.data?.error) {
          throw new Error(`Erro da API: ${error.response.data.error.message || error.response.data.error}`);
        }
      }
      throw error;
    }
  }
}
