import useSWRImmutable from 'swr/immutable';
import { HotelSchema, hotelEndpoints } from '~/apis/hotel.api';
import { PrivateFetchInstance } from '~/apis/instances/fetch.instance';

export default function useMyHotel() {
  const fetcher = (url: string) => new PrivateFetchInstance<HotelSchema>().fetcher(url, 'GET');
  const { isLoading, data, error, mutate } = useSWRImmutable(hotelEndpoints.myHotel, fetcher);
  return { isLoading, data, error, mutate };
}
