import React, { useState, useEffect, useMemo } from 'react';
import { Accommodation, Reservation } from '@/interfaces';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from '@/components/ui/carousel';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { DateRange } from 'react-day-picker';
import { ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/auth-provider';

interface AccommodationCardProps {
    accommodation: Accommodation;
    onAddToCart: (reservation: Reservation) => void;
    userId: string;
}

const SIGN_IN_PATH = '/auth/sign-in';
const CART_PATH = '/cart';
const DEFAULT_IMAGE_URL = 'default_image_url';

export const AccommodationCard: React.FC<AccommodationCardProps> = ({ accommodation, onAddToCart, userId }) => {
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);
    const [count, setCount] = useState(0);
    const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!api) {
            return;
        }

        setCount(api.scrollSnapList().length);
        setCurrent(api.selectedScrollSnap() + 1);

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap() + 1);
        });
    }, [api]);

    const handleAddToCart = () => {
        if (!isAuthenticated) {
            navigate(SIGN_IN_PATH);
            return;
        }
    
        if (!dateRange || !dateRange.from || !dateRange.to) {
            toast.warning('Por favor, selecione um intervalo de datas.');
            return;
        }
    
        if (dateRange.to < dateRange.from) {
            toast.warning('A data final não pode ser menor que a data inicial.');
            return;
        }
    
        const reservation: Reservation = {
            checkIn: dateRange.from.toISOString(),
            checkOut: dateRange.to.toISOString(),
            userId: userId,
            accomodationId: accommodation.id,
        };
    
        onAddToCart(reservation);
        navigate(CART_PATH);
    };

    const carouselImages = useMemo(() => {
        return accommodation.images && accommodation.images.length > 0 ? (
            accommodation.images.map((image, index) => (
                <CarouselItem key={index}>
                    <img className="h-full w-full object-cover" src={image.url} alt={`${accommodation.name} ${index}`} loading="lazy" />
                </CarouselItem>
            ))
        ) : (
            <CarouselItem>
                <img className="h-full w-full object-cover" src={DEFAULT_IMAGE_URL} alt={accommodation.name} loading="lazy" />
            </CarouselItem>
        );
    }, [accommodation.images, accommodation.name]);

    return (
        <Card className={`flex flex-col shadow-md overflow-hidden border rounded`}>
            <CardHeader>
                <CardTitle>{accommodation.name}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex-shrink-0 relative">
                    <Carousel setApi={setApi}>
                        <CarouselContent>
                            {carouselImages}
                        </CarouselContent>
                        <CarouselPrevious className="absolute top-1/2 left-2 transform -translate-y-1/2" />
                        <CarouselNext className="absolute top-1/2 right-2 transform -translate-y-1/2" />
                    </Carousel>
                    <div className="py-2 text-center text-sm text-muted-foreground">
                        Image {current} of {count}
                    </div>
                </div>
                <div>
                    <h2 className="font-semibold text-xl mb-2">{accommodation.name}</h2>
                    <p className="text-gray-600">{accommodation.description}</p>
                    <div className="mt-4">
                        <div className="flex justify-between items-center">
                            <span className="text-lg font-semibold">R$ {accommodation.price}/noite</span>
                        </div>
                        <div className="mt-2 flex justify-between items-center">
                            <DateRangePicker date={dateRange} onDateChange={setDateRange} />
                            <button className="ml-4 flex items-center" onClick={handleAddToCart}>
                                <ShoppingCart className="mr-2" />
                                Fazer reserva
                            </button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};