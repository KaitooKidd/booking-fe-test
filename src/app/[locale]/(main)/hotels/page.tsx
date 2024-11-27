'use client';

import { useEffect } from 'react';
import HotelFilterModal from '~/components/layouts/hotels/Filters/HotelFilterModal';
import HotelSearchBar from '~/components/layouts/hotels/Filters/SearchBar/HotelSearchBar';
import HotelList from '~/components/layouts/hotels/HotelList';
import useHotelFilters from '~/hooks/useHotelFilters';
import useHotels from '~/hooks/useHotels';

function HotelPage() {
  const { isLoading, data, error } = useHotels();
  const { setHotels } = useHotelFilters();

  useEffect(() => {
    setHotels(data || []);
  }, [data, setHotels]);

  if (isLoading) return <div>Loading...</div>;
  if (error || !data) return <div>Oops! No hotels found</div>;

  return (
    <>
      <div className="flex-center gap-2">
        <HotelSearchBar />
        <HotelFilterModal />
      </div>
      <HotelList />
    </>
  );
}

export default HotelPage;
