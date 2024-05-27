import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from './pages/_layouts/app';
import { AuthLayout } from './pages/_layouts/auth';
import { SignIn } from './pages/auth/sign-in';
import { SignUp } from './pages/auth/sign-up';
import { NotFound } from './pages/404';
import { Error } from './pages/error';
import { AccommodationList } from './pages/app/accommodations/accommodation-list';
import { PrivateRoute } from './pages/auth/private-route';
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
                    <PrivateRoute>
                        <AccommodationList />
                    </PrivateRoute>
                ),
            },
            {
                path: '/accommodations',
                element: (
                    <PrivateRoute restricted={false}>
                        <AccommodationList />
                    </PrivateRoute>
                ),
            },
            {
                path: '/cart',
                element: (
                    <PrivateRoute restricted={true}>
                        <Cart />
                    </PrivateRoute>
                ),
            }
        ],
    },
    {
        path: '/auth',
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