import axios from 'axios';
import type { Source, Session, Activity, CreateSessionRequest } from '../types/jules';

const JULES_API_BASE = 'https://jules.googleapis.com/v1alpha';

export class JulesAPI {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private getHeaders() {
    return {
      'X-Goog-Api-Key': this.apiKey,
      'Content-Type': 'application/json',
    };
  }

  async listSources(pageSize = 10, pageToken?: string): Promise<{ sources: Source[]; nextPageToken?: string }> {
    const params = new URLSearchParams({ pageSize: pageSize.toString() });
    if (pageToken) params.append('pageToken', pageToken);
    
    const response = await axios.get(`${JULES_API_BASE}/sources?${params}`, {
      headers: this.getHeaders(),
    });
    return response.data;
  }

  async listSessions(pageSize = 10, pageToken?: string): Promise<{ sessions: Session[]; nextPageToken?: string }> {
    const params = new URLSearchParams({ pageSize: pageSize.toString() });
    if (pageToken) params.append('pageToken', pageToken);
    
    const response = await axios.get(`${JULES_API_BASE}/sessions?${params}`, {
      headers: this.getHeaders(),
    });
    return response.data;
  }

  async getSession(sessionId: string): Promise<Session> {
    const response = await axios.get(`${JULES_API_BASE}/sessions/${sessionId}`, {
      headers: this.getHeaders(),
    });
    return response.data;
  }

  async createSession(request: CreateSessionRequest): Promise<Session> {
    const response = await axios.post(`${JULES_API_BASE}/sessions`, request, {
      headers: this.getHeaders(),
    });
    return response.data;
  }

  async sendMessage(sessionId: string, prompt: string): Promise<void> {
    await axios.post(
      `${JULES_API_BASE}/sessions/${sessionId}:sendMessage`,
      { prompt },
      { headers: this.getHeaders() }
    );
  }

  async approvePlan(sessionId: string): Promise<void> {
    await axios.post(
      `${JULES_API_BASE}/sessions/${sessionId}:approvePlan`,
      {},
      { headers: this.getHeaders() }
    );
  }

  async listActivities(sessionId: string, pageSize = 30, pageToken?: string): Promise<{ activities: Activity[]; nextPageToken?: string }> {
    const params = new URLSearchParams({ pageSize: pageSize.toString() });
    if (pageToken) params.append('pageToken', pageToken);
    
    const response = await axios.get(`${JULES_API_BASE}/sessions/${sessionId}/activities?${params}`, {
      headers: this.getHeaders(),
    });
    return response.data;
  }
}
