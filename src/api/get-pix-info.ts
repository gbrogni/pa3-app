import { api } from '@/lib/axios';
import Cookies from 'js-cookie';

interface GetPixInfoBody {
  reservationIds: string[];
  value: number;
}

interface PixInfo {
  qrCodeImage: string;
  brCode: string;
}

export async function getPixInfo({
  reservationIds,
  value,
}: GetPixInfoBody) {
  const token = Cookies.get('access_token');
  const response = await api.post(`/reservations/pix`, {
    reservationIds,
    value,
  }, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });

  return response.data.data as PixInfo;
}