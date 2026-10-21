export interface User {
  id: string;
  email: string;
  fullName: string;
  institution?: string;
  createdAt: string;
}

export interface Project {
  id: string;
  userId: string;
  name: string;
  description?: string;
  status: 'Active' | 'Archived' | 'Completed';
  paperCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Paper {
  id: string;
  userId: string;
  projectId?: string | null;
  title: string;
  authors: string[];
  venue?: string;
  year: number;
  doi?: string;
  abstract: string;
  methodology: string;
  sampleSize: string;
  findings: string;
  limitations: string;
  extractedText?: string;
  fileSizeBytes: number;
  isPublic: boolean;
  tags?: string[];
  citationsCount?: number;
  createdAt: string;
}

export interface SynthesisMatrixItem {
  matrixId: string;
  paperId: string;
  customNotes?: string;
  relevanceScore: number;
  createdAt: string;
  title: string;
  authors: string[];
  year: number;
  venue?: string;
  doi?: string;
  methodology: string;
  sampleSize: string;
  findings: string;
  limitations: string;
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  userId: string;
  sender: 'user' | 'ai';
  message: string;
  createdAt: string;
}

export interface SystemStatus {
  status: string;
  version: string;
  geminiConfigured: boolean;
  database: {
    type: string;
    profilesCount: number;
    projectsCount: number;
    papersCount: number;
    matrixRowsCount: number;
  };
  storage: {
    driver: string;
    root: string;
  };
  capabilities: string[];
}

export interface TrendsData {
  totalPapers: number;
  timeline: Array<{
    year: number;
    count: number;
    papers: Array<{
      id: string;
      title: string;
      venue?: string;
      authors: string[];
      year: number;
    }>;
  }>;
  keywords: Array<{
    text: string;
    count: number;
    paperIds: string[];
    category: string;
  }>;
  topVenues: Array<{
    venue: string;
    count: number;
  }>;
  yearRange: {
    min: number;
    max: number;
  };
}

export interface AuditResult {
  timestamp: string;
  allPassed: boolean;
  results: Array<{
    testId: string;
    title: string;
    passed: boolean;
    details: string;
  }>;
}

const TOKEN_KEY = 'researchmate_jwt_token';

export const api = {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken(token: string | null) {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  },

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {};

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    const res = await fetch(`/api${endpoint}`, {
      ...options,
      headers: {
        ...headers,
        ...(options.headers as Record<string, string>),
      },
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error((data as any).error || `Request failed with status ${res.status}`);
    }

    return data as T;
  },

  // Auth
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const res = await this.request<{ user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setToken(res.token);
    return res;
  },

  async register(email: string, password: string, fullName: string, institution?: string): Promise<{ user: User; token: string }> {
    const res = await this.request<{ user: User; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, fullName, institution }),
    });
    this.setToken(res.token);
    return res;
  },

  async getMe(): Promise<{ user: User }> {
    return this.request<{ user: User }>('/auth/me');
  },

  logout() {
    this.setToken(null);
  },

  // Projects
  async getProjects(): Promise<{ projects: Project[] }> {
    return this.request<{ projects: Project[] }>('/projects');
  },

  async createProject(name: string, description?: string, status: string = 'Active'): Promise<{ project: Project }> {
    return this.request<{ project: Project }>('/projects', {
      method: 'POST',
      body: JSON.stringify({ name, description, status }),
    });
  },

  async updateProject(id: string, data: Partial<Project>): Promise<{ project: Project }> {
    return this.request<{ project: Project }>(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteProject(id: string): Promise<{ message: string; id: string }> {
    return this.request<{ message: string; id: string }>(`/projects/${id}`, {
      method: 'DELETE',
    });
  },

  // Papers
  async getPapers(params?: { projectId?: string; q?: string }): Promise<{ papers: Paper[] }> {
    const query = new URLSearchParams();
    if (params?.projectId) query.set('projectId', params.projectId);
    if (params?.q) query.set('q', params.q);
    const qs = query.toString() ? `?${query.toString()}` : '';
    return this.request<{ papers: Paper[] }>(`/papers${qs}`);
  },

  async getPaper(id: string): Promise<{ paper: Paper }> {
    return this.request<{ paper: Paper }>(`/papers/${id}`);
  },

  async uploadPaper(formData: FormData): Promise<{ paper: Paper; aiEngine: string; message: string }> {
    return this.request<{ paper: Paper; aiEngine: string; message: string }>('/papers/upload', {
      method: 'POST',
      body: formData,
    });
  },

  async deletePaper(id: string): Promise<{ message: string; id: string }> {
    return this.request<{ message: string; id: string }>(`/papers/${id}`, {
      method: 'DELETE',
    });
  },

  async getCitations(paperId: string): Promise<{ citations: { bibtex: string; apa: string; mla: string; chicago: string; harvard: string }; paperId: string; title: string }> {
    return this.request<{ citations: any; paperId: string; title: string }>(`/papers/${paperId}/citations`);
  },

  async getDownloadToken(paperId: string): Promise<{ token: string; downloadUrl: string; expiresInSeconds: number }> {
    return this.request<{ token: string; downloadUrl: string; expiresInSeconds: number }>(`/papers/${paperId}/download-token`);
  },

  // Matrix
  async getMatrix(): Promise<{ matrix: SynthesisMatrixItem[] }> {
    return this.request<{ matrix: SynthesisMatrixItem[] }>('/matrix');
  },

  async addToMatrix(paperId: string, customNotes?: string, relevanceScore?: number): Promise<{ item: any; message: string }> {
    return this.request<{ item: any; message: string }>('/matrix', {
      method: 'POST',
      body: JSON.stringify({ paperId, customNotes, relevanceScore }),
    });
  },

  async removeFromMatrix(paperId: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/matrix/${paperId}`, {
      method: 'DELETE',
    });
  },

  // Chat
  async getChatMessages(paperId: string): Promise<{ sessionId?: string; messages: ChatMessage[] }> {
    return this.request<{ sessionId?: string; messages: ChatMessage[] }>(`/chat/${paperId}/messages`);
  },

  async sendChatMessage(paperId: string, message: string): Promise<{ reply: ChatMessage; engineUsed: string }> {
    return this.request<{ reply: ChatMessage; engineUsed: string }>(`/chat/${paperId}/message`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  },

  // Status & Audit
  async getStatus(): Promise<SystemStatus> {
    return this.request<SystemStatus>('/status');
  },

  async runAudit(): Promise<AuditResult> {
    return this.request<AuditResult>('/audit/run-tests', {
      method: 'POST',
    });
  },

  // Trends & Analytics
  async getTrends(): Promise<TrendsData> {
    return this.request<TrendsData>('/analytics/trends');
  },
};
