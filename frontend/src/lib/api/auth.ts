import { api } from './client';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export const login = async (data: LoginData) => {
  const response = await api.post('/login', data);
  return response.data;
};

export const register = async (data: RegisterData) => {
  const response = await api.post('/users', data);
  return response.data;
};

export const logout = async () => {
  const response = await api.post('/logout');
  return response.data;
};