import { APIClient } from './api-client';
import { getStorageValue } from './storage';

export const getToken = async () => {
  const token = await getStorageValue('session:auth_token');
  return token;
};

export const contentClient = new APIClient({
  getToken,
});
