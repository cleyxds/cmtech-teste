import { api } from './client';

export interface Address {
  id: number;
  user_id: number;
  zip_code: string;
  street: string;
  number: string;
  complement: string | null;
  neighborhood: string;
  city: string;
  state: string;
  status: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface CreateAddressData {
  zip_code: string;
  street?: string;
  number: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
}

export interface UpdateAddressData {
  zip_code?: string;
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
}

export const getAddressesByUser = async (userId: number): Promise<Address[]> => {
  const response = await api.get(`/users/${userId}/addresses`);
  return response.data.data;
};

export const getAddressById = async (id: number): Promise<Address> => {
  const response = await api.get(`/addresses/${id}`);
  return response.data.data;
};

export const createAddress = async (userId: number, data: CreateAddressData): Promise<Address> => {
  const response = await api.post(`/users/${userId}/addresses`, data);
  return response.data.data;
};

export const updateAddress = async (id: number, data: UpdateAddressData): Promise<Address> => {
  const response = await api.put(`/addresses/${id}`, data);
  return response.data.data;
};

export const deleteAddress = async (id: number): Promise<void> => {
  await api.delete(`/addresses/${id}`);
};

export const fetchAddressFromViaCEP = async (zipCode: string) => {
  const response = await fetch(`https://viacep.com.br/ws/${zipCode}/json/`);
  if (!response.ok) {
    throw new Error('Failed to fetch address from ViaCEP');
  }
  const data = await response.json();
  if (data.erro) {
    throw new Error('Zip code not found');
  }
  return data;
};