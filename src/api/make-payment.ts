import { PaymentMethod } from '@/interfaces';
import { api } from '@/lib/axios';
import Cookies from 'js-cookie';

interface MakePaymentBody {
    reservationId: string;
    amount: number;
    paymentMethod: PaymentMethod;
    cardNumber: string;
    cardName: string;
    expiryDate: Date;
    cvc: string;
}

export async function makePayment({
    reservationId,
    amount,
    cardNumber,
    cardName,
    expiryDate,
    paymentMethod,
    cvc
}: MakePaymentBody) {
    const token = Cookies.get('access_token');
    const response = await api.post(`/reservations/make-payment`, {
        amount,
        reservationId,
        paymentMethod,
        cardNumber,
        cardName,
        expiryDate,
        cvc
    }, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response;
}