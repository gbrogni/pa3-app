import { isAuthenticated } from '@/context/auth';
import { Hotel } from 'lucide-react';
import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

export function AuthLayout() {
    const navigate = useNavigate();

    useEffect(() => {
        const isAuth = isAuthenticated();
        if (!isAuth) {
            navigate('/auth/sign-in');
        }
    }, [navigate]);
    
    return (
        <div className="grid min-h-screen grid-cols-2 antialiased">
            <div className='h-full border-right border-foreground/5 bg-muted p-10 text-muted-foreground flex flex-col justify-between'>
                <div className='flex items-center gap-3 text-lg font-medium text-foreground'>
                    <Hotel className='h-5 w-5' />
                    <span className='font-semibold'>Pousada quinta do Ypuã</span>
                </div>
                <footer className='text-sm'>
                    Pousada quinta do Ypuã &copy; - {new Date().getFullYear()}
                </footer>
            </div>

            <div className="relative flex flex-col items-center justify-center">
                <Outlet />
            </div>
        </div>
    );
}