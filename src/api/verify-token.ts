import { api } from '@/lib/axios';

export async function verifyToken(token: string): Promise<boolean> {
    try {
        const response = await api.post('/verify-token', null, {
            headers: { 'Authorization': `Bearer ${token}` },
        });

        if (response.status !== 200) {
            throw new Error('Token verification failed');
        }

        const { isValid } = response.data;
        return isValid;
    } catch (error) {
        console.error(error);
        return false;
    }
}