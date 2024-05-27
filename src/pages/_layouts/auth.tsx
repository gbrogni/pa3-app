import { Hotel } from 'lucide-react';
import {  Outlet } from 'react-router-dom';

export function AuthLayout() {

    return (
        <div className="grid min-h-screen grid-cols-2 antialiased">
            <div className='h-full border-right border-foreground/5 bg-muted p-10 text-muted-foreground flex flex-col justify-between'>
                <div className='flex items-center gap-3 text-lg font-medium text-foreground'>
                    <Hotel className='h-5 w-5' />
                    <span className='font-semibold'>PA3</span>
                </div>
                <footer className='text-sm'>
                    Painel do parceiro &copy; PA3 - {new Date().getFullYear()}
                </footer>
            </div>

            <div className="relative flex flex-col items-center justify-center">
                <Outlet />
            </div>
        </div>
    )
}