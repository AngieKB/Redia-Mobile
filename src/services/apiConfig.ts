import { getAccessToken } from './authService';

export const API_BASE_URL = 'https://redia-backend-2-c4bea5c8cfb5hvh7.brazilsouth-01.azurewebsites.net/api';

export const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getAccessToken()}`,
});
