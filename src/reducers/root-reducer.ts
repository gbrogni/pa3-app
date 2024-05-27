import { combineReducers } from 'redux';
import { reservationReducer } from './reservation-reducer';
import { accommodationReducer } from './accommodations-reducer';

export const rootReducer = combineReducers({
    reservation: reservationReducer,
    accommodations: accommodationReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;