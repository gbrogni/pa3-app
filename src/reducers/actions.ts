import { Accommodation, Reservation } from '@/interfaces';

export const ADD_TO_CART = 'ADD_TO_CART';
export const SET_ACCOMMODATIONS = 'SET_ACCOMMODATIONS';
export const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
export const UPDATE_RESERVATION = 'UPDATE_RESERVATION';
export const RESET_RESERVATIONS = 'RESET_RESERVATIONS';

interface Action<T, P> {
  type: T;
  payload: P;
}

type AddToCartAction = Action<typeof ADD_TO_CART, Reservation>;
type SetAccommodationsAction = Action<typeof SET_ACCOMMODATIONS, Accommodation[]>;
type RemoveFromCartAction = Action<typeof REMOVE_FROM_CART, string>;
type UpdateReservationAction = Action<typeof UPDATE_RESERVATION, Reservation>;
type ResetReservationsAction = Action<typeof RESET_RESERVATIONS, undefined>;

const createAction = <T, P>(type: T, payload: P): Action<T, P> => ({ type, payload });

export const addToCart = (reservation: Reservation): AddToCartAction => createAction(ADD_TO_CART, reservation);
export const setAccommodations = (accommodations: Accommodation[]): SetAccommodationsAction => createAction(SET_ACCOMMODATIONS, accommodations);
export const removeFromCart = (accomodationId: string): RemoveFromCartAction => createAction(REMOVE_FROM_CART, accomodationId);
export const updateReservation = (reservation: Reservation): UpdateReservationAction => createAction(UPDATE_RESERVATION, reservation);
export const resetReservations = (): ResetReservationsAction => createAction(RESET_RESERVATIONS, undefined);

export type CartActionTypes = AddToCartAction | SetAccommodationsAction | RemoveFromCartAction | UpdateReservationAction | ResetReservationsAction;