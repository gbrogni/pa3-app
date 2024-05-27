import { api } from '@/lib/axios';
import Cookies from 'js-cookie';

interface CreateReservationBody {
    checkIn: Date;
    checkOut: Date;
    accommodationId: string;
}

export async function createReservation({
    checkIn,
    checkOut,
    accommodationId,
}: CreateReservationBody) {
    const token = Cookies.get('access_token');
    const body = {
        checkIn,
        checkOut,
        accommodationId
    };
    const response = await api.post('/reservations', body, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
}