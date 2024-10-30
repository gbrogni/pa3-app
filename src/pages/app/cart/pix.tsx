import { getPixInfo } from '@/api/get-pix-info';
import { makePayment } from '@/api/make-payment';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { resetReservations } from '@/reducers/actions';
import { AppDispatch } from '@/reducers/store';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';

export interface PixProps {
    reservationAmounts: { [reservationId: string]: number; };
    onClose: () => void;
}

export function Pix({ reservationAmounts = {}, onClose }: PixProps) {
    const [qrCode, setQRCode] = useState('');
    const [pixCode, setPixCode] = useState('');
    const dispatch: AppDispatch = useDispatch();

    const totalAmount = Object.values(reservationAmounts).reduce((sum, amount) => sum + amount, 0);
    const reservationIds = Object.keys(reservationAmounts);

    useEffect(() => {
        if (reservationIds.length > 0) {
            getPixInfo({
                reservationIds,
                value: totalAmount,
            })
                .then(response => {
                    setQRCode(response.qrCodeImage);
                    setPixCode(response.brCode);
                });
        }
    }, [reservationIds, totalAmount]);

    const handleConfirmPayment = async () => {
        try {
            await makePayment({ reservationAmounts });
            toast.success('Pagamento realizado com sucesso!');
            dispatch(resetReservations());
            onClose();
        } catch (error) {
            toast.error('Falha ao realizar o pagamento!');
        }
    };

    return (
        <div className="flex flex-col items-center space-y-5">
            {qrCode && <img src={qrCode} alt="QR Code" />}
            <Input value={pixCode} readOnly />
            <Button onClick={handleConfirmPayment}>Confirmar pagamento</Button>
        </div>
    );
}