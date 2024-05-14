import { Accommodation } from '@/interfaces';
import { api } from '@/lib/axios';

export interface GetAccommodationsQuery {
    pageIndex?: number | null;
}

export interface GetAccommodationsResponse {
    accommodations: Accommodation[];
    meta: {
        pageIndex: number;
        perPage: number;
        totalCount: number;
    };
};

export async function getAccommodations(query: GetAccommodationsQuery): Promise<GetAccommodationsResponse> {
    const token = localStorage.getItem('access_token');
    const response = await api.get<GetAccommodationsResponse>('/accommodations', {
        headers: {
            'Authorization': `Bearer ${token}`
        },
        params: {
            pageIndex: query.pageIndex,
        }
    });
    return response.data;
}