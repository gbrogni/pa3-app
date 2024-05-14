import React from 'react';
import { Accommodation, AccommodationStatus } from '@/interfaces';

interface AccommodationCardProps {
    accommodation: Accommodation;
}

export const AccommodationCard: React.FC<AccommodationCardProps> = ({ accommodation }) => {
    console.log(accommodation)
    const imageUrl = accommodation.images && accommodation.images[0] ? accommodation.images[0].url : 'default_image_url';

    return (
        <div className="flex bg-white shadow-md rounded-lg overflow-hidden">
            <div className="flex-shrink-0">
                <img className="h-48 w-full object-cover" src={imageUrl} alt={accommodation.name} />
            </div>
            <div className="p-8">
                <h2 className="font-semibold text-xl mb-2">{accommodation.name}</h2>
                <p className="text-gray-600">{accommodation.description}</p>
                <div className="mt-4">
                    <span className="text-lg font-semibold">{accommodation.price}</span>
                    <span className="ml-1 text-gray-600">/ night</span>
                </div>
                <div className={`mt-2 ${accommodation.status === AccommodationStatus.AVAILABLE ? 'text-green-600' : 'text-red-600'}`}>
                    {accommodation.status}
                </div>
            </div>
        </div>
    );
};