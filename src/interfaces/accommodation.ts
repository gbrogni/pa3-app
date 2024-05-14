import { Reservation } from './reservation';

export enum AccommodationStatus {
    AVAILABLE = 'AVAILABLE',
    PENDING = 'PENDING',
    RESERVED = 'RESERVED'
}

export interface Image {
    accommodationId: string;
    id: string;
    url: string;
}

export interface Accommodation {
    name: string;
    description: string;
    slug: string;
    price: number;
    status: AccommodationStatus;
    images: Image[];
    reservations: Reservation[];
}