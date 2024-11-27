import EmptyResource from '~/components/common/EmptyResource';
import useHotelFilters from '~/hooks/useHotelFilters';
import HotelCard from './HotelCard';

export default function HotelList() {
  const { filteredHotels } = useHotelFilters();

  return filteredHotels.length > 0 ? (
    <div className="mt-4 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {filteredHotels.map((hotel, index) => (
        <HotelCard key={index} hotel={hotel} />
      ))}
    </div>
  ) : (
    <EmptyResource />
  );
}
