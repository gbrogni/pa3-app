import { ADD_TO_CART, CartActionTypes, REMOVE_FROM_CART, RESET_RESERVATIONS, UPDATE_RESERVATION } from '@/reducers/actions';
import { Reservation } from '@/interfaces';

interface ReservationState {
  reservations: Reservation[];
}

const initialState: ReservationState = {
  reservations: [],
};

export const reservationReducer = (state = initialState, action: CartActionTypes): ReservationState => {
  switch (action.type) {
    case ADD_TO_CART:
      return { ...state, reservations: [...state.reservations, action.payload] };
    case REMOVE_FROM_CART:
      return { ...state, reservations: state.reservations.filter(reservation => reservation.accomodationId !== action.payload) };
    case UPDATE_RESERVATION:
      return {
        ...state,
        reservations: state.reservations.map(reservation =>
          reservation.accomodationId === action.payload.accomodationId ? action.payload : reservation
        ),
      };
    case RESET_RESERVATIONS:
      return initialState;
    default:
      return state;
  }
};