import { getPixInfo } from '@/api/get-pix-info';
import { makePayment } from '@/api/make-payment';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';

export interface PixProps {
    reservationId: string;
    value: number;
    onClose: () => void;
}

export function Pix({ reservationId, value, onClose }: PixProps) {
    const [qrCode, setQRCode] = useState('');
    const [pixCode, setPixCode] = useState('');

    useEffect(() => {
        getPixInfo({
            reservationId,
            value,
        })
            .then(response => {
                setQRCode(response.qrCodeImage);
                setPixCode(response.brCode);
            });
    }, [reservationId, value]);

    const handleConfirmPayment = async () => {
        try {
            await makePayment({ reservationId, value });
            onClose();
        } catch (error) {
            console.error('Falha ao realizar o pagamento', error);
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