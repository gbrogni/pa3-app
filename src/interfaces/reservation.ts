export enum ReservationStatus {
    PENDING = 'PENDING',
    CONFIRMED = 'CONFIRMED',
    CANCELLED = 'CANCELLED',
}

export interface Reservation {
    checkIn: string;
    checkOut: string;
    userId: string;
    accomodationId: string;
    status?: ReservationStatus;
}