import { storage } from 'wxt/storage';
import { APIClient } from './api-client';

export const getToken = async () => {
  const token = await storage.getItem('session:auth_token');
  return token;
};

export const client = new APIClient({
  getToken: async () => {
    const token: string | null = await storage.getItem('session:auth_token');
    return token;
  },
});
