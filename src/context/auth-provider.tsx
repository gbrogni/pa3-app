import { useState, useEffect, useContext, createContext } from 'react';
import { signIn as authenticate } from '@/api/sign-in';
import { verifyToken } from '@/api/verify-token';
import Cookies from 'js-cookie';

interface AuthState {
    isAuthenticated: boolean;
    token: string | null;
}

interface AuthContextData extends AuthState {
    loading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => void;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode; }> = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [authState, setAuthState] = useState<AuthState>(() => {
        const token = Cookies.get('access_token');

        if (token) {
            return { isAuthenticated: true, token };
        }

        return { isAuthenticated: false, token: null };
    });

    const logout = () => {
        Cookies.remove('access_token');
        setAuthState({ isAuthenticated: false, token: null });
    };

    useEffect(() => {
        async function checkTokenValidity() {
            const token = Cookies.get('access_token');

            if (token) {
                try {
                    const isValid = await verifyToken(token);

                    if (isValid) {
                        setAuthState({ isAuthenticated: true, token });
                    } else {
                        logout();
                    }
                } catch (error) {
                    console.error('Failed to verify token:', error);
                    logout();
                }
            }
            setLoading(false);
        }

        checkTokenValidity();
    }, []);

    const signIn = async (email: string, password: string) => {
        try {
            const token = await authenticate({ email, password });
            Cookies.set('access_token', token);
            setAuthState({ isAuthenticated: true, token });
        } catch (error) {
            throw new Error('Failed to authenticate');
        }
    };

    const signOut = () => {
        logout();
    };

    return (
        <AuthContext.Provider value={{ ...authState, loading, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export function useAuth() {
    return useContext(AuthContext);
}