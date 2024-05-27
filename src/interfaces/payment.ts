
export enum PaymentMethod {
    CARD = 'CARD',
    PAYPAL = 'PAYPAL',
    APPLE = 'APPLE',
}

export interface Payment {
    paymentMethod: PaymentMethod;
    amount: number;
    createdAt: Date;
    cardNumber: string;
    cardName: string;
    expiryDate: string;
    cvc: string;
}