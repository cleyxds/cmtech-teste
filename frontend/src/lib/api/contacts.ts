import { api } from './client';

export interface Phone {
  id: number;
  user_id: number;
  phone_number: string;
  status: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface CreatePhoneData {
  phone_number: string;
}

export interface UpdatePhoneData {
  phone_number?: string;
}

export const getPhonesByUser = async (userId: number): Promise<Phone[]> => {
  const response = await api.get(`/users/${userId}/phones`);
  return response.data.data;
};

export const getPhoneById = async (id: number): Promise<Phone> => {
  const response = await api.get(`/phones/${id}`);
  return response.data.data;
};

export const createPhone = async (userId: number, data: CreatePhoneData): Promise<Phone> => {
  const response = await api.post(`/users/${userId}/phones`, data);
  return response.data.data;
};

export const updatePhone = async (id: number, data: UpdatePhoneData): Promise<Phone> => {
  const response = await api.put(`/phones/${id}`, data);
  return response.data.data;
};

export const deletePhone = async (id: number): Promise<void> => {
  await api.delete(`/phones/${id}`);
};