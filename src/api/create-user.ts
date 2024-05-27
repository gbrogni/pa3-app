import { api } from '@/lib/axios';

export interface CreateUserBody {
    name: string;
    email: string;
    cpf: string;
    phone: string;
    password: string;
}

export async function createUser({
    name,
    email,
    cpf,
    phone,
    password,
}: CreateUserBody) {
    console.log(name, email, cpf, phone, password)
    await api.post('/accounts', {
        name,
        email,
        cpf,
        phone,
        password,
    });
}