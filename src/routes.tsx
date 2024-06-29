import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from './pages/_layouts/app';
import { AuthLayout } from './pages/_layouts/auth';
import { SignIn } from './pages/auth/sign-in';
import { SignUp } from './pages/auth/sign-up';
import { NotFound } from './pages/404';
import { Error } from './pages/error';
import { AccommodationList } from './pages/app/accommodations/accommodation-list';
import { Cart } from './pages/app/cart/cart';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <AppLayout />,
        errorElement: <Error />,
        children: [
            {
                path: '/',
                element: (
                        <AccommodationList />
                ),
            },
            {
                path: '/accommodations',
                element: (
                        <AccommodationList />
                ),
            },
            {
                path: '/cart',
                element: (
                        <Cart />
                ),
            }
        ],
    },
    {
        path: 'auth',
        element: <AuthLayout />,
        children: [
            {
                path: 'sign-in',
                element: <SignIn />,
            },
            {
                path: 'sign-up',
                element: <SignUp />,
            },
        ],
    },
    {
        path: '*',
        element: <NotFound />,
    },
]);