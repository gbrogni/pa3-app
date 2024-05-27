import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useSelector } from 'react-redux';
import { RootState } from '@/reducers/root-reducer';
import { getUserInfo } from '@/api/get-user-info';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Payments } from './payment';
import { createReservation } from '@/api/create-reservation';
import { makePayment } from '@/api/make-payment';
import { PaymentMethod } from '@/interfaces';
import { toast } from 'sonner';

interface PaymentData {
    cardNumber: string;
    cardName: string;
    expiryDate: Date;
    cvc: string;
    paymentMethod: PaymentMethod;
}

export function Cart() {
    const reservation = useSelector((state: RootState) => state.reservation);
    const accommodations = useSelector((state: RootState) => state.accommodations);
    const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
    const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false);
    const { data: profile, isLoading: isLoadingProfile } = useQuery({
        queryKey: ['profile'],
        queryFn: getUserInfo,
        staleTime: Infinity,
    });

    const accommodation = accommodations.accommodations?.find(accommodation => accommodation.id === reservation.reservation?.accomodationId);

    const { register, setValue } = useForm();

    const { mutateAsync: createReservationFn } = useMutation({
        mutationFn: createReservation,
    });

    const { mutateAsync: makePaymentFn } = useMutation({
        mutationFn: makePayment,
    });

    useEffect(() => {
        if (profile && !isLoadingProfile) {
            setValue('name', profile.name);
            setValue('email', profile.email);
            setValue('phone', profile.phone);
            setValue('cpf', profile.cpf);
        }
    }, [profile, isLoadingProfile, setValue]);

    useEffect(() => {
        const createReservationAsync = async () => {
            if (paymentData && accommodation && reservation.reservation) {
                try {
                    const { reservationId } = await createReservationFn({
                        checkIn: new Date(reservation.reservation.checkIn),
                        checkOut: new Date(reservation.reservation.checkOut),
                        accommodationId: accommodation.id,
                    });

                    const paymentResponse = await makePaymentFn({
                        reservationId,
                        amount: diffDays * accommodation.price,
                        cardNumber: paymentData.cardNumber,
                        cardName: paymentData.cardName,
                        expiryDate: paymentData.expiryDate,
                        paymentMethod: paymentData.paymentMethod,
                        cvc: paymentData.cvc,
                    });

                    if (paymentResponse.status === 204) {
                        setIsPaymentSuccessful(true);
                        toast.success('Reserva realizada com sucesso!');
                    }
                } catch (error) {
                    console.error(error);
                    toast.error('Ocorreu um erro ao fazer a reserva.');
                }
            }
        };

        createReservationAsync();
    }, [paymentData, profile, reservation.reservation, createReservationFn, accommodation]);

    let diffDays = 0;
    if (reservation.reservation?.checkIn && reservation.reservation?.checkOut) {
        const checkInDate = new Date(reservation.reservation.checkIn);
        const checkOutDate = new Date(reservation.reservation.checkOut);
        const oneDay = 24 * 60 * 60 * 1000;
        diffDays = Math.round(Math.abs((+checkInDate - +checkOutDate) / oneDay));
    }

    const totalPrice = diffDays * (accommodation?.price ?? 0);

    return (
        <div className="flex flex-col p-4">
            <div className="flex flex-col lg:flex-row justify-between mb-4">
                <div className="lg:w-1/2 mr-4">
                    <Card className={`flex flex-col shadow-md overflow-hidden border rounded`}>
                        <CardHeader>
                            <CardTitle>Informações da reserva</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div>
                                <h2 className="font-semibold text-xl mb-2">{accommodation?.name}</h2>
                                <div className="mt-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-semibold">R$ {accommodation?.price}/noite</span>
                                    </div>
                                    <div className="mt-2 flex justify-between items-center">
                                        <span>Período: {reservation.reservation && new Date(reservation.reservation.checkIn).toLocaleDateString()} - {reservation.reservation && new Date(reservation.reservation.checkOut).toLocaleDateString()}</span>
                                    </div>
                                    <div className="mt-2 flex justify-between items-center">
                                        <span>Total: R$ {totalPrice}</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="lg:w-1/2 mr-4">
                    <form>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Seu nome</Label>
                                <Input id="name" {...register('name')} readOnly />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="cpf">Seu CPF</Label>
                                <Input id="cpf" {...register('cpf')} readOnly />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Seu e-mail</Label>
                            <Input id="email" type="email" {...register('email')} readOnly />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Seu telefone</Label>
                            <Input id="phone" {...register('phone')} readOnly />
                        </div>
                    </form>
                </div>
            </div>
            <div className="w-full">
                <Payments setPaymentData={setPaymentData} isPaymentSuccessful={isPaymentSuccessful} />
            </div>
        </div>
    );
};