import useSWRImmutable from 'swr/immutable';
import { BookingDetails, bookingEndpoints } from '~/apis/booking.api';
import { PrivateFetchInstance } from '~/apis/instances/fetch.instance';

export default function useMyBookings() {
  const fetcher = (url: string) => {
    return new PrivateFetchInstance<BookingDetails[]>().fetcher(url, 'GET');
  };

  return useSWRImmutable(bookingEndpoints.myBookings, fetcher);
}
