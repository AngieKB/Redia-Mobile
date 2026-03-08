import { getAccessToken } from './authService';

export const API_BASE_URL = 'http://localhost:8080/api';

export const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getAccessToken()}`,
});
