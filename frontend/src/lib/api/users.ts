import { api } from './client';

export interface User {
  id: number;
  name: string;
  email: string;
  status: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  password?: string;
}

export const getUsers = async (): Promise<User[]> => {
  const response = await api.get('/users');
  return response.data.data;
};

export const getUserById = async (id: number): Promise<User> => {
  const response = await api.get(`/users/${id}`);
  return response.data.data;
};

export const createUser = async (data: CreateUserData): Promise<User> => {
  const response = await api.post('/users', data);
  return response.data.data;
};

export const updateUser = async (id: number, data: UpdateUserData): Promise<User> => {
  const response = await api.put(`/users/${id}`, data);
  return response.data.data;
};

export const deleteUser = async (id: number): Promise<void> => {
  await api.delete(`/users/${id}`);
};

export const checkEmailAvailability = async (email: string): Promise<boolean> => {
  try {
    const response = await api.get(`/users/check-email?email=${encodeURIComponent(email)}`);
    return response.data.available;
  } catch (error) {
    return false;
  }
};