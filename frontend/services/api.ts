import {
  Account,
  Contact,
  Opportunity,
  Task,
  Activity,
  User,
  CardOcrResult,
  OpportunityAiInsight,
  EmailDraftResponse,
} from '../types';

const API_BASE = '/api';

export const crmApi = {
  // Health
  async checkHealth(): Promise<{ status: string; aiReady: boolean }> {
    try {
      const res = await fetch(`${API_BASE}/health`);
      return await res.json();
    } catch {
      return { status: 'offline', aiReady: false };
    }
  },

  // Accounts
  async getAccounts(): Promise<Account[]> {
    const res = await fetch(`${API_BASE}/accounts`);
    const json = await res.json();
    return json.data || [];
  },

  async createAccount(data: Omit<Account, 'id' | 'createdAt' | 'updatedAt'>): Promise<Account> {
    const res = await fetch(`${API_BASE}/accounts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await res.json();
  },

  async updateAccount(id: string, data: Partial<Account>): Promise<Account> {
    const res = await fetch(`${API_BASE}/accounts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await res.json();
  },

  async deleteAccount(id: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/accounts/${id}`, {
      method: 'DELETE',
    });
    return res.ok;
  },

  // Contacts
  async getContacts(): Promise<Contact[]> {
    const res = await fetch(`${API_BASE}/contacts`);
    const json = await res.json();
    return json.data || [];
  },

  async createContact(data: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>): Promise<Contact> {
    const res = await fetch(`${API_BASE}/contacts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await res.json();
  },

  async updateContact(id: string, data: Partial<Contact>): Promise<Contact> {
    const res = await fetch(`${API_BASE}/contacts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await res.json();
  },

  async deleteContact(id: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/contacts/${id}`, {
      method: 'DELETE',
    });
    return res.ok;
  },

  // Opportunities
  async getOpportunities(): Promise<Opportunity[]> {
    const res = await fetch(`${API_BASE}/opportunities`);
    const json = await res.json();
    return json.data || [];
  },

  async createOpportunity(data: Omit<Opportunity, 'id' | 'createdAt' | 'updatedAt'>): Promise<Opportunity> {
    const res = await fetch(`${API_BASE}/opportunities`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await res.json();
  },

  async updateOpportunity(id: string, data: Partial<Opportunity>): Promise<Opportunity> {
    const res = await fetch(`${API_BASE}/opportunities/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await res.json();
  },

  async deleteOpportunity(id: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/opportunities/${id}`, {
      method: 'DELETE',
    });
    return res.ok;
  },

  // Tasks
  async getTasks(): Promise<Task[]> {
    const res = await fetch(`${API_BASE}/tasks`);
    const json = await res.json();
    return json.data || [];
  },

  async createTask(data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    const res = await fetch(`${API_BASE}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await res.json();
  },

  async updateTask(id: string, data: Partial<Task>): Promise<Task> {
    const res = await fetch(`${API_BASE}/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await res.json();
  },

  async deleteTask(id: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/tasks/${id}`, {
      method: 'DELETE',
    });
    return res.ok;
  },

  // Activities
  async getActivities(): Promise<Activity[]> {
    const res = await fetch(`${API_BASE}/activities`);
    const json = await res.json();
    return json.data || [];
  },

  async logActivity(data: Omit<Activity, 'id' | 'timestamp'>): Promise<Activity> {
    const res = await fetch(`${API_BASE}/activities`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await res.json();
  },

  // AI & OCR Services
  async scanBusinessCard(imageBase64: string, mimeType: string = 'image/jpeg'): Promise<CardOcrResult> {
    const res = await fetch(`${API_BASE}/ocr/scan-card`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageBase64, mimeType }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'OCR request failed' }));
      throw new Error(err.message || 'Failed to scan visiting card');
    }
    return await res.json();
  },

  async getOpportunityAiInsights(
    opportunity: Partial<Opportunity>,
    account?: Partial<Account>,
    recentActivities?: Activity[]
  ): Promise<OpportunityAiInsight> {
    const res = await fetch(`${API_BASE}/ai/opportunity-insight`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ opportunity, account, recentActivities }),
    });
    if (!res.ok) {
      throw new Error('Failed to get AI opportunity insight');
    }
    return await res.json();
  },

  async generateEmailDraft(
    contact: Partial<Contact>,
    account?: Partial<Account>,
    opportunity?: Partial<Opportunity>,
    purpose?: string
  ): Promise<EmailDraftResponse> {
    const res = await fetch(`${API_BASE}/ai/email-draft`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contact, account, opportunity, purpose }),
    });
    if (!res.ok) {
      throw new Error('Failed to generate email draft');
    }
    return await res.json();
  },

  // Reset Server Data
  async resetData(): Promise<void> {
    await fetch(`${API_BASE}/reset-data`, { method: 'POST' });
  },
};
