import useSWR from 'swr';
import { HotelOverview, hotelEndpoints } from '~/apis/hotel.api';
import { FetchInstance } from '~/apis/instances/fetch.instance';

export default function useHotels() {
  const fetcher = (url: string) => new FetchInstance<HotelOverview[]>().fetcher(url, 'GET');
  return useSWR(hotelEndpoints.list, fetcher);
}
