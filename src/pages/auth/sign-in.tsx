import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { signIn } from '@/api/sign-in';
import { useMutation } from '@tanstack/react-query';

const signInForm = z.object({
    email: z.string().email(),
    password: z.string()
});

type SignInForm = z.infer<typeof signInForm>;

export function SignIn() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const {
        register,
        handleSubmit,
        formState: { isSubmitting },
    } = useForm<SignInForm>({
        defaultValues: {
            email: searchParams.get('email') ?? '',
            password: searchParams.get('password') ?? '',
        },
    });

    const { mutateAsync: authenticate } = useMutation({
        mutationFn: signIn,
    });

    async function handleSignIn(data: SignInForm) {
        try {
            const accessToken = await authenticate({ email: data.email, password: data.password });
            localStorage.setItem('access_token', accessToken);

            toast.success('Autenticado corretamente');

            navigate('/home');
        } catch (error) {
            toast.error('Credenciais inválidas.');
        }
    }

    return (
        <>
            <Helmet title="Login" />

            <div className="p-8">
                <Button variant="ghost" asChild className="absolute right-8 top-8">
                    <Link to="/sign-up">Novo usuário</Link>
                </Button>

                <div className="flex w-[350px] flex-col justify-center gap-6">
                    <div className="flex flex-col gap-2 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Acessar painel
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Procurar acomodações
                        </p>
                    </div>

                    <form className="space-y-4" onSubmit={handleSubmit(handleSignIn)}>
                        <div className="space-y-2">
                            <Label htmlFor="email">Seu e-mail</Label>
                            <Input id="email" type="email" {...register('email')} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Sua senha</Label>
                            <Input id="password" type="password" {...register('password')} />
                        </div>

                        <Button disabled={isSubmitting} className="w-full" type="submit">
                            Acessar painel
                        </Button>
                    </form>
                </div>
            </div>
        </>
    );
}