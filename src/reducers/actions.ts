import { Accommodation, Reservation } from '@/interfaces';

export const ADD_TO_CART = 'ADD_TO_CART';
export const SET_RESERVATION = 'SET_RESERVATION';
export const SET_ACCOMMODATIONS = 'SET_ACCOMMODATIONS';

interface Action<T, P> {
  type: T;
  payload: P;
}

type SetReservationAction = Action<typeof SET_RESERVATION, Reservation>;
type SetAccommodationsAction = Action<typeof SET_ACCOMMODATIONS, Accommodation[]>;

const createAction = <T, P>(type: T, payload: P): Action<T, P> => ({ type, payload });


export const setReservation = (reservation: Reservation): SetReservationAction => createAction(SET_RESERVATION, reservation);

export const setAccommodations = (accommodations: Accommodation[]): SetAccommodationsAction => createAction(SET_ACCOMMODATIONS, accommodations);

export type CartActionTypes = SetReservationAction | SetAccommodationsAction;