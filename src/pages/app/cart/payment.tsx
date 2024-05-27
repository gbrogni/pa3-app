import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Payment, PaymentMethod } from '@/interfaces';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';

const signUpForm = z.object({
    paymentMethod: z.nativeEnum(PaymentMethod),
    cardNumber: z.number(),
    cardName: z.string(),
    expiryMonth: z.string(),
    expiryYear: z.string(),
    cvc: z.number().min(3).max(3),
});

type SignUpForm = z.infer<typeof signUpForm>;

export function Payments({ setPaymentData, isPaymentSuccessful }: { setPaymentData: any; isPaymentSuccessful: boolean; }) {
    const {
        register,
        handleSubmit,
        control,
        formState: { isSubmitting },
    } = useForm<SignUpForm>();

    async function handlePayment(data: SignUpForm) {
        const expiryDate = new Date(parseInt(data.expiryYear), parseInt(data.expiryMonth) - 1);
        const paymentData: Payment = {
            cardName: data.cardName,
            cardNumber: data.cardNumber.toString(),
            paymentMethod: data.paymentMethod,
            createdAt: new Date(),
            cvc: data.cvc.toString(),
            expiryDate: expiryDate.toISOString(),
            amount: 0,
        };
        setPaymentData(paymentData);
    }

    return (
        <form onSubmit={handleSubmit(handlePayment)}>
            <Card>
                <CardHeader>
                    <CardTitle>Forma de pagamento</CardTitle>
                    <CardDescription>
                        Adicione uma forma de pagamento.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                    <RadioGroup defaultValue={PaymentMethod.CARD} className="grid grid-cols-3 gap-4" {...register('paymentMethod', { required: true })} >
                        <div>
                            <RadioGroupItem value={PaymentMethod.CARD} id="card" className="peer sr-only" />
                            <Label
                                htmlFor="card"
                                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    className="mb-3 h-6 w-6"
                                >
                                    <rect width="20" height="14" x="2" y="5" rx="2" />
                                    <path d="M2 10h20" />
                                </svg>
                                Card
                            </Label>
                        </div>
                        <div>
                            <RadioGroupItem
                                value={PaymentMethod.PAYPAL}
                                id="paypal"
                                className="peer sr-only"
                            />
                            <Label
                                htmlFor="paypal"
                                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                            >
                                <Icons.paypal className="mb-3 h-6 w-6" />
                                Paypal
                            </Label>
                        </div>
                        <div>
                            <RadioGroupItem value={PaymentMethod.APPLE} id="apple" className="peer sr-only" />
                            <Label
                                htmlFor="apple"
                                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                            >
                                <Icons.apple className="mb-3 h-6 w-6" />
                                Apple
                            </Label>
                        </div>
                    </RadioGroup>
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input {...register('cardName', { required: true })} id="name" placeholder="First Last" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="number">Card number</Label>
                        <Input {...register('cardNumber', { required: true })} id="number" placeholder="" />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="month">Expires</Label>
                            <Controller
                                control={control}
                                name="expiryMonth"
                                render={({ field }) => (
                                    <Select {...field} onValueChange={val => field.onChange(val)} value={field.value}>
                                        <SelectTrigger id="month">
                                            <SelectValue placeholder="Month" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">January</SelectItem>
                                            <SelectItem value="2">February</SelectItem>
                                            <SelectItem value="3">March</SelectItem>
                                            <SelectItem value="4">April</SelectItem>
                                            <SelectItem value="5">May</SelectItem>
                                            <SelectItem value="6">June</SelectItem>
                                            <SelectItem value="7">July</SelectItem>
                                            <SelectItem value="8">August</SelectItem>
                                            <SelectItem value="9">September</SelectItem>
                                            <SelectItem value="10">October</SelectItem>
                                            <SelectItem value="11">November</SelectItem>
                                            <SelectItem value="12">December</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="year">Year</Label>
                            <Controller
                                control={control}
                                name="expiryYear"
                                render={({ field }) => (
                                    <Select {...field} onValueChange={val => field.onChange(val)} value={field.value}>
                                        <SelectTrigger id="year">
                                            <SelectValue placeholder="Year" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Array.from({ length: 10 }, (_, i) => (
                                                <SelectItem key={`year-${i}`} value={`${new Date().getFullYear() + i}`}>
                                                    {new Date().getFullYear() + i}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="cvc">CVC</Label>
                            <Input {...register('cvc', { required: true })} id="cvc" placeholder="CVC" />
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type='submit' disabled={isSubmitting || isPaymentSuccessful} className="w-full">Continue</Button>
                </CardFooter>
            </Card>
        </form>
    );
}