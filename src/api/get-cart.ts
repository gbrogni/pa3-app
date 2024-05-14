import { api } from '@/lib/axios';

interface GetCartResponse {
    id: string;
    name: string;
    email: string;
    items: object[];
}

export async function getCart() {
    const response = await api.get<GetCartResponse>('/me');

    return response.data;
}