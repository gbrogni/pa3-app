import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/reducers/root-reducer';
import { getUserInfo } from '@/api/get-user-info';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Pix } from './pix';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { createReservation } from '@/api/create-reservation';
import { useNavigate } from 'react-router-dom';
import { Reservation } from '@/interfaces';
import { CartActionTypes, removeFromCart, updateReservation } from '@/reducers/actions';
import { CalendarSearch, Trash2Icon } from 'lucide-react';
import { Dispatch } from 'redux';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { DateRange } from 'react-day-picker';

export function Cart() {
    const reservations = useSelector((state: RootState) => state.reservation.reservations);
    const accommodations = useSelector((state: RootState) => state.accommodations);
    const { register, setValue } = useForm();
    const [reservationAmounts, setReservationAmounts] = useState<{ [reservationId: string]: number; }>({});
    const [open, setOpen] = useState(false);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
    const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
    const [datePickerModalOpen, setDatePickerModalOpen] = useState(false);
    const navigate = useNavigate();
    const dispatch: Dispatch<CartActionTypes> = useDispatch();

    const handleContinueClick = async () => {
        try {
            if (!reservations.length) {
                navigate('/accommodations');
                return;
            }
            const reservationData = reservations.map(reservation => ({
                checkIn: reservation.checkIn,
                checkOut: reservation.checkOut,
                accommodationId: reservation.accomodationId,
            }));

            const response = await createReservation(reservationData);
            const amounts = response.reservationIds.reduce((acc: { [key: string]: number; }, id: string, index: number) => {
                acc[id] = calculateTotalPrice(reservations[index]);
                return acc;
            }, {});
            setReservationAmounts(amounts);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            const profile = await getUserInfo();
            if (profile) {
                setValue('name', profile.name);
                setValue('email', profile.email);
                setValue('phone', profile.phone);
                setValue('cpf', profile.cpf);
            }
        };

        fetchData();
    }, [setValue]);

    const calculateTotalPrice = (reservation: Reservation) => {
        let diffDays = 0;
        if (reservation?.checkIn && reservation?.checkOut) {
            const checkInDate = new Date(reservation.checkIn);
            const checkOutDate = new Date(reservation.checkOut);
            const oneDay = 24 * 60 * 60 * 1000;
            diffDays = Math.round(Math.abs((+checkInDate - +checkOutDate) / oneDay));
        }
        const accommodation = accommodations.accommodations?.find(accommodation => accommodation.id === reservation?.accomodationId);
        return diffDays * (accommodation?.price ?? 0);
    };

    const totalAmount = reservations.reduce((sum, reservation) => sum + calculateTotalPrice(reservation), 0);

    const handleRemoveReservation = (reservation: Reservation) => {
        setSelectedReservation(reservation);
        setConfirmDialogOpen(true);
    };

    const confirmRemoveReservation = () => {
        if (selectedReservation) {
            dispatch(removeFromCart(selectedReservation.accomodationId));
            setConfirmDialogOpen(false);
            setSelectedReservation(null);
        }
    };

    const handleDateChange = (range: DateRange | undefined) => {
        setDateRange(range);
    };

    const openDatePickerModal = (reservation: Reservation) => {
        setSelectedReservation(reservation);
        setDateRange({ from: new Date(reservation.checkIn), to: new Date(reservation.checkOut) });
        setDatePickerModalOpen(true);
    };

    const confirmDateChange = () => {
        if (selectedReservation && dateRange) {
            const updatedReservation = {
                ...selectedReservation,
                checkIn: dateRange.from?.toISOString() ?? selectedReservation.checkIn,
                checkOut: dateRange.to?.toISOString() ?? selectedReservation.checkOut,
            };

            dispatch(updateReservation(updatedReservation));
            setDatePickerModalOpen(false);
            setSelectedReservation(null);
        }
    };

    const cancelDateChange = () => {
        setDatePickerModalOpen(false);
        setSelectedReservation(null);
    };

    return (
        <div className="flex flex-col p-4">
            <div className="flex flex-col lg:flex-row justify-between mb-4">
                <div className="lg:w-1/2 mr-4 overflow-y-auto max-h-screen">
                    {reservations.map((reservation, index) => {
                        const accommodation = accommodations.accommodations?.find(accommodation => accommodation.id === reservation.accomodationId);
                        const totalPrice = calculateTotalPrice(reservation);
                        return (
                            <Card key={index} className={`flex flex-col shadow-md overflow-hidden border rounded mb-4`}>
                                <CardHeader>
                                    <div className="flex justify-between items-center">
                                        <CardTitle>Informações da reserva</CardTitle>
                                        <div className="flex items-center">
                                            <Trash2Icon className="h-5 w-5 text-red-500 cursor-pointer" onClick={() => handleRemoveReservation(reservation)} />
                                        </div>
                                    </div>
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
                                                <CalendarSearch className="h-5 w-5 text-red-500 cursor-pointer" onClick={() => openDatePickerModal(reservation)}>Alterar Datas</CalendarSearch>
                                            </div>
                                            <div className="mt-2 flex justify-between items-center">
                                                <span>Total: R$ {totalPrice}</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
                <div className="lg:w-1/2 mr-4 flex-shrink-0">
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
                        <div className="space-y-2">
                            <Label htmlFor="totalAmount">Valor Total</Label>
                            <Input id="totalAmount" value={`R$ ${totalAmount}`} readOnly />
                        </div>
                    </form>
                </div>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger>
                    <Button type='button' onClick={handleContinueClick} className="w-full">Continue</Button>
                </DialogTrigger>
                <DialogContent>
                    {Object.keys(reservationAmounts).length > 0 && (
                        <Pix reservationAmounts={reservationAmounts} onClose={() => {
                            setOpen(false);
                            navigate('/accommodations');
                        }} />
                    )}
                </DialogContent>
            </Dialog>
            <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
                <DialogContent>
                    <p>Tem certeza de que deseja remover esta reserva?</p>
                    <div className="flex justify-end space-x-2 mt-4">
                        <Button onClick={() => setConfirmDialogOpen(false)}>Cancelar</Button>
                        <Button onClick={confirmRemoveReservation} className="bg-red-500 text-white">Remover</Button>
                    </div>
                </DialogContent>
            </Dialog>
            <Dialog open={datePickerModalOpen} onOpenChange={setDatePickerModalOpen}>
                <DialogContent>
                    <DateRangePicker date={dateRange} onDateChange={handleDateChange} />
                    <div className="flex justify-end space-x-2 mt-4">
                        <Button onClick={cancelDateChange}>Cancelar</Button>
                        <Button onClick={confirmDateChange} className="bg-blue-500 text-white">Confirmar</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};