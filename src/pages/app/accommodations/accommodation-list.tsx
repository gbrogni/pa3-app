import { GetAccommodationsQuery, getAccommodations } from '@/api/fetch-accommodations';
import { Reservation } from '@/interfaces';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CartActionTypes, SET_RESERVATION, setAccommodations } from '@/reducers/actions';
import { AccommodationCard } from './accommodation-card';
import { Dispatch } from 'redux';
import { RootState } from '@/reducers/root-reducer';
import Cookies from 'js-cookie';
import { isAuthenticated } from '@/context/auth';
import { redirect } from 'react-router-dom';

export function AccommodationList() {
  const dispatch: Dispatch<CartActionTypes> = useDispatch();
  const token = Cookies.get('access_token');

  const handleAddToCart = (reservation: Reservation) => {
    dispatch({ type: SET_RESERVATION, payload: reservation });
  };

  useEffect(() => {
    try {
      const isAuth = isAuthenticated();
      if (!isAuth) {
          redirect('/auth/sign-in');
      }
      const fetchAccommodations = async () => {
        const query: GetAccommodationsQuery = { pageIndex: 1 };
        const response = await getAccommodations(query, token as string);
        dispatch(setAccommodations(response.accommodations));
      };
  
      fetchAccommodations();
    } catch {
      console.error('Failed to fetch accommodations');
    }
  }, [dispatch, token]);

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