import { api } from '@/lib/axios';
import Cookies from 'js-cookie';

export async function getUserInfo() {
  const token = Cookies.get('access_token');
  const response = await api.get('/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}