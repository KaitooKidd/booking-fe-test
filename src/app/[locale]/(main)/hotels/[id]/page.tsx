'use client';

import HotelDetails from '~/components/layouts/hotels/HotelDetails/HotelDetails';
import useHotel from '~/hooks/useHotel';
import useHotelReviews from '~/hooks/useHotelReviews';

interface HotelDetailsProps {
  params: { id: string };
}

export default function HotelDetailsPage({ params }: HotelDetailsProps) {
  const hotelResponse = useHotel(+params.id);
  const reviewsResponse = useHotelReviews(+params.id);

  if (hotelResponse.isLoading || reviewsResponse.isLoading) return <div>Loading...</div>;
  if (hotelResponse.error || reviewsResponse.error || !hotelResponse.data || !reviewsResponse.data) {
    return <div>Oops! Hotel with given id not found</div>;
  }

  return <HotelDetails hotel={hotelResponse.data} reviews={reviewsResponse.data} />;
}
