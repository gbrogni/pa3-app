import { GetAccommodationsQuery, getAccommodations } from '@/api/fetch-accommodations';
import { Reservation } from '@/interfaces';
import { useEffect, useContext } from 'react';
import { AuthContext } from '@/context/auth-provider';
import { useDispatch, useSelector } from 'react-redux';
import { CartActionTypes, SET_RESERVATION, setAccommodations } from '@/reducers/actions';
import { AccommodationCard } from './accommodation-card';
import { Dispatch } from 'redux';
import { RootState } from '@/reducers/root-reducer';

export function AccommodationList() {
  const { token } = useContext(AuthContext) || {};
  const dispatch: Dispatch<CartActionTypes> = useDispatch();

  const handleAddToCart = (reservation: Reservation) => {
    dispatch({ type: SET_RESERVATION, payload: reservation });
  };

  useEffect(() => {
    const fetchAccommodations = async () => {
      const query: GetAccommodationsQuery = { pageIndex: 1 };
      const response = await getAccommodations(query, token as string);
      dispatch(setAccommodations(response.accommodations));
    };

    fetchAccommodations();
  }, [token, dispatch]);

  const accommodations = useSelector((state: RootState) => state.accommodations.accommodations);

  if (!accommodations) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
      {accommodations.map((accommodation, index) => (
        <AccommodationCard
          key={index}
          accommodation={accommodation}
          onAddToCart={handleAddToCart}
          userId={token as string}
        />
      ))}
    </div>
  );
};