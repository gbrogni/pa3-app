import { api } from '@/lib/axios';
import Cookies from 'js-cookie';

interface GetPixInfoBody {
    reservationId: string;
    value: number;
}

interface PixInfo {
    qrCodeImage: string;
    brCode: string;
}

export async function getPixInfo({
    reservationId,
    value,
}: GetPixInfoBody) {
    const token = Cookies.get('access_token');
    const response = await api.post(`/reservations/pix`, {
        reservationId,
        value,
    }, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });

    return response.data.data as PixInfo;
}