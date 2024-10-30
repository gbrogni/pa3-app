import { api } from '@/lib/axios';
import Cookies from 'js-cookie';

interface CreateReservationBody {
  checkIn: string;
  checkOut: string;
  accommodationId: string;
}

export async function createReservation(reservations: CreateReservationBody[]) {
  const token = Cookies.get('access_token');
  const response = await api.post('/reservations', reservations, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}