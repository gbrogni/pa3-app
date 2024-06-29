import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useSelector } from 'react-redux';
import { RootState } from '@/reducers/root-reducer';
import { getUserInfo } from '@/api/get-user-info';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Pix } from './pix';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { createReservation } from '@/api/create-reservation';
import { useNavigate } from 'react-router-dom';

export function Cart() {
    const reservation = useSelector((state: RootState) => state.reservation.reservation);
    const accommodations = useSelector((state: RootState) => state.accommodations);
    const accommodation = accommodations.accommodations?.find(accommodation => accommodation.id === reservation?.accomodationId);
    const { register, setValue } = useForm();
    const [reservationId, setReservationId] = useState('');
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const { data: profile, isLoading: isLoadingProfile } = useQuery({
        queryKey: ['profile'],
        queryFn: getUserInfo,
        staleTime: Infinity,
    });

    const handleContinueClick = async () => {
        if (reservation) {
            try {
                const reservationData = {
                    checkIn: reservation.checkIn,
                    checkOut: reservation.checkOut,
                    accommodationId: reservation.accomodationId,
                };

                const response = await createReservation(reservationData);

                setReservationId(response.reservationId);
            } catch (error) {
                console.error(error);
            }
        }
    };

    useEffect(() => {
        if (profile && !isLoadingProfile) {
            setValue('name', profile.name);
            setValue('email', profile.email);
            setValue('phone', profile.phone);
            setValue('cpf', profile.cpf);
        }
    }, [profile, isLoadingProfile, setValue]);



    let diffDays = 0;
    if (reservation?.checkIn && reservation?.checkOut) {
        const checkInDate = new Date(reservation.checkIn);
        const checkOutDate = new Date(reservation.checkOut);
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
                                        <span>Período: {reservation && new Date(reservation.checkIn).toLocaleDateString()} - {reservation && new Date(reservation.checkOut).toLocaleDateString()}</span>
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
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger>
                    <Button type='button' onClick={handleContinueClick} className="w-full">Continue</Button>
                </DialogTrigger>
                <DialogContent>
                    {reservationId && <Pix reservationId={reservationId} value={totalPrice} onClose={() => {
                        setOpen(false);
                        navigate('/accommodations');
                    }} />}
                </DialogContent>
            </Dialog>
        </div>
    );
};