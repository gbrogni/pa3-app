import { SET_ACCOMMODATIONS, CartActionTypes } from '@/actions/actions';
import { Accommodation } from '@/interfaces';

interface AccommodationState {
    accommodations: Accommodation[] | null;
}

const initialState: AccommodationState = {
    accommodations: [],
};

export const accommodationReducer = (state = initialState, action: CartActionTypes): AccommodationState => {
    switch (action.type) {
        case SET_ACCOMMODATIONS:
            return { ...state, accommodations: action.payload };
        default:
            return state;
    }
};