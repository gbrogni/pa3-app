import { SET_RESERVATION, CartActionTypes } from '@/reducers/actions';
import { Reservation } from '@/interfaces';

interface ReservationState {
    reservation: Reservation | null;
}

const initialState: ReservationState = {
    reservation: null,
};

export const reservationReducer = (state = initialState, action: CartActionTypes): ReservationState => {
    switch (action.type) {
        case SET_RESERVATION:
            return { ...state, reservation: action.payload };
        default:
            return state;
    }
};