export enum ReservationStatus {
    PENDING = 'PENDING',
    CONFIRMED = 'CONFIRMED',
    CANCELLED = 'CANCELLED',
}

export interface Reservation {
    checkIn: Date;
    checkOut: Date;
    userId: string;
    accomodationId: string;
    status: ReservationStatus;
}