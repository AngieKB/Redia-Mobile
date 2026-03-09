export const API_BASE_URL = 'http://localhost:8080/api';

export const setTokens = (accessToken: string, refreshToken: string, userData?: any) => {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
  if (userData) {
    localStorage.setItem('user', JSON.stringify(userData));
  }
};

export const getAccessToken = () => localStorage.getItem('accessToken');
export const getRefreshToken = () => localStorage.getItem('refreshToken');

export const removeTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
};

export const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Helper to get authorization headers
const getAuthHeaders = () => {
  const token = getAccessToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

// Helper para formatear errores del backend
const parseBackendError = (errorStr: string): string => {
  try {
    const errorObj = JSON.parse(errorStr);
    if (errorObj.content && Array.isArray(errorObj.content)) {
      return errorObj.content.map((err: any) => `${err.field}: ${err.message}`).join('\n');
    }
    return errorObj.message || errorStr;
  } catch (e) {
    return errorStr;
  }
};

export const login = async (email: string, password: string, recaptchaToken: string) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, recaptchaToken }),
  });
  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(parseBackendError(errorData) || 'Error en inicio de sesión. Verifica tus credenciales.');
  }
  return response.json(); // DEVUELVE AuthResponseDTO
};

export const register = async (formData: FormData, recaptchaToken: string) => {
  formData.append('recaptchaToken', recaptchaToken);
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) {
    const errorMsg = await response.text();
    throw new Error(parseBackendError(errorMsg) || 'Error en el registro. Revisa los datos.');
  }
  return response.text(); 
};

export const logout = async () => {
  try {
    const token = getAccessToken();
    if (token) {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
    }
  } catch (error) {
    console.error('Logout failed on backend:', error);
  } finally {
    removeTokens();
  }
};

export const forgotPassword = async (email: string) => {
  const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(errorData || 'Error enviando código de verificación');
  }
  return response.text();
};

export const resetPassword = async (email: string, verificationCode: string, newPassword: string) => {
  const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, verificationCode, newPassword }),
  });
  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(errorData || 'Error restableciendo contraseña');
  }
  return response.text();
};

export const googleLogin = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/auth/google`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  });
  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(parseBackendError(errorData) || 'Error en inicio de sesión con Google');
  }
  return response.json(); // DEVUELVE AuthResponseDTO
};

export const completeProfile = async (formData: FormData) => {
  const response = await fetch(`${API_BASE_URL}/auth/complete-profile`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getAccessToken()}`,
    },
    body: formData,
  });
  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(parseBackendError(errorData) || 'Error completando el perfil');
  }
  return response.json();
};
