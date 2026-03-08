import { API_BASE_URL, getAccessToken } from './authService';

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getAccessToken()}`,
});

export const getMyReservations = async () => {
  const response = await fetch(`${API_BASE_URL}/reservations/my`, {
    headers: getHeaders(),
  });
  if (!response.ok) {
    throw new Error('Error recuperando tus reservas');
  }
  return response.json(); // Array of ReservationResponseDTO
};

export const createReservation = async (reservationData: any) => {
  const response = await fetch(`${API_BASE_URL}/reservations`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(reservationData),
  });
  if (!response.ok) {
    throw new Error('Error al crear tu reserva');
  }
  return response.json();
};

export const cancelReservation = async (id: string) => {
  const response = await fetch(`${API_BASE_URL}/reservations/cancel/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
  });
  if (!response.ok) {
    throw new Error('Error al cancelar tu reserva');
  }
  return response.text();
};
