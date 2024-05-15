import React, { useState, useEffect } from 'react';
import { Accommodation } from '@/interfaces';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from '@/components/ui/carousel';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'; // Import Card components
import { differenceInDays, subDays } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { DateRangePicker } from './ui/date-range-picker';
import { ShoppingCart } from 'lucide-react';

interface AccommodationCardProps {
    accommodation: Accommodation;
}

export const AccommodationCard: React.FC<AccommodationCardProps> = ({ accommodation }) => {
    const defaultImageUrl = 'default_image_url';
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);
    const [count, setCount] = useState(0);
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: subDays(new Date(), 7),
        to: new Date(),
    });

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

    return (
        <Card className={`flex flex-col shadow-md overflow-hidden border rounded`}>
            <CardHeader>
                <CardTitle>{accommodation.name}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex-shrink-0 relative">
                    <Carousel setApi={setApi}>
                        <CarouselContent>
                            {accommodation.images && accommodation.images.length > 0 ? (
                                accommodation.images.map((image, index) => (
                                    <CarouselItem key={index}>
                                        <img className="h-full w-full object-cover" src={image.url} alt={`${accommodation.name} ${index}`} loading="lazy" />
                                    </CarouselItem>
                                ))
                            ) : (
                                <CarouselItem>
                                    <img className="h-full w-full object-cover" src={defaultImageUrl} alt={accommodation.name} loading="lazy" />
                                </CarouselItem>
                            )}
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
                        <button className="ml-4 flex items-center">
                            <ShoppingCart className="mr-2" />
                            Adicionar ao carrinho
                        </button>
                    </div>
                </div>
                </div>
            </CardContent>
        </Card>
    );
};