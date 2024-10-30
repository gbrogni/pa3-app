import { api } from '@/lib/axios';
import Cookies from 'js-cookie';

interface MakePaymentBody {
  reservationAmounts: { [reservationId: string]: number; };
}

export async function makePayment({
  reservationAmounts
}: MakePaymentBody) {
  const token = Cookies.get('access_token');
  const response = await api.post(`/reservations/make-payment`, {
    reservationAmounts
  }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
}