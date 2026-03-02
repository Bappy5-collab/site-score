import api from './api';

export interface SignupData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  _id: string;
  name: string;
  email: string;
  token: string;
}

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  role?: string;
  createdAt?: string;
}

export const authService = {
  signup: async (data: SignupData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/signup', data);
    return response.data;
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  getMe: async (): Promise<UserProfile> => {
    const response = await api.get<UserProfile>('/auth/me');
    return response.data;
  },

  updateProfile: async (data: { name?: string; email?: string }): Promise<UserProfile> => {
    const response = await api.put<UserProfile>('/auth/profile', data);
    return response.data;
  },

  updatePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    await api.put('/auth/password', { currentPassword, newPassword });
  },
};
