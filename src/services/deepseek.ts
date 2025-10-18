import axios from 'axios';

const OPENROUTER_API_BASE = 'https://openrouter.ai/api/v1';

export class DeepSeekAPI {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async analyzeLogs(logs: string): Promise<string> {
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
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://jules-web.app',
          'X-Title': 'Jules Web Interface',
        },
      }
    );

    return response.data.choices[0].message.content;
  }
}
