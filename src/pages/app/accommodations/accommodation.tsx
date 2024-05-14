import { GetAccommodationsQuery, getAccommodations } from '@/api/fetch-accommodations';
import { AccommodationCard } from '@/components/accommodation-card';
import { Accommodation } from '@/interfaces';
import React, { useEffect, useState } from 'react';

export const AccommodationList: React.FC = () => {
  const [accommodations, setAccommodations] = useState<Accommodation[] | null>(null);

  useEffect(() => {
    const fetchAccommodations = async () => {
      const query: GetAccommodationsQuery = { pageIndex: 1 };
      const response = await getAccommodations(query);
      setAccommodations(response.accommodations);
    };

    fetchAccommodations();
  }, []);

  if (!accommodations) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      {accommodations.map((accommodation) => (
        <AccommodationCard key={accommodation.slug} accommodation={accommodation} />
      ))}
    </div>
  );
};