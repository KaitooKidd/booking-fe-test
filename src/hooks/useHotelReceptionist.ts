import useSWRImmutable from 'swr/immutable';
import { HotelReceptionist, hotelEndpoints } from '~/apis/hotel.api';
import { PrivateFetchInstance } from '~/apis/instances/fetch.instance';

export default function useHotelReceptionists() {
  const fetcher = (url: string) =>
    new PrivateFetchInstance<HotelReceptionist[]>().fetcher(url, 'GET').then((data) => {
      return data.reduce<{
        hotels: Omit<HotelReceptionist, 'receptionists'>[];
        receptionists: HotelReceptionist['receptionists'];
      }>(
        (acc, item) => {
          const { receptionists, ...hotel } = item;
          acc.hotels.push(hotel);
          acc.receptionists.push(...receptionists);
          return acc;
        },
        { hotels: [], receptionists: [] },
      );
    });
  return useSWRImmutable(hotelEndpoints.listReceptionists, fetcher);
}
