import { api } from '@/lib/axios';
import Cookies from 'js-cookie';

interface MakePaymentBody {
    reservationId: string;
    value: number;
}

export async function makePayment({
    reservationId,
    value
}: MakePaymentBody) {
    const token = Cookies.get('access_token');
    const response = await api.post(`/reservations/make-payment`, {
        reservationId,
        value
    }, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response;
}