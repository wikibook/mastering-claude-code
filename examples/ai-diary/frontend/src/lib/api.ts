const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export interface Diary {
  id: string;
  title: string;
  content: string;
  mood: string | null;
  aiResponse: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDiaryDto {
  title: string;
  content: string;
}

export interface User {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
}

// 세션에서 이메일을 가져오는 헬퍼
async function getSessionEmail(): Promise<string | null> {
  try {
    const response = await fetch('/api/auth/session');
    const session = await response.json();
    return session?.user?.email || null;
  } catch {
    return null;
  }
}

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const email = await getSessionEmail();

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(email ? { Authorization: `Bearer ${email}` } : {}),
      ...options.headers,
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
}

export const api = {
  // Diary APIs
  getDiaries: (): Promise<Diary[]> => {
    return fetchWithAuth(`${API_URL}/api/diaries`);
  },

  getDiary: (id: string): Promise<Diary> => {
    return fetchWithAuth(`${API_URL}/api/diaries/${id}`);
  },

  createDiary: (data: CreateDiaryDto): Promise<Diary> => {
    return fetchWithAuth(`${API_URL}/api/diaries`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  deleteDiary: (id: string): Promise<void> => {
    return fetchWithAuth(`${API_URL}/api/diaries/${id}`, {
      method: 'DELETE',
    });
  },

  // User APIs
  getOrCreateUser: (userData: { email: string; name?: string; image?: string }): Promise<User> => {
    return fetchWithAuth(`${API_URL}/api/users`, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },
};
