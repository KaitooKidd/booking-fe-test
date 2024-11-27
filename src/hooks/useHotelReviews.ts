import useSWRImmutable from 'swr/immutable';
import { PrivateFetchInstance } from '~/apis/instances/fetch.instance';
import { ReviewSchema, reviewEndpoints } from '~/apis/review.api';

export default function useHotelReviews(hotelId: number) {
  const fetcher = (url: string) => new PrivateFetchInstance<ReviewSchema[]>().fetcher(url, 'GET');
  const { isLoading, data, error, mutate } = useSWRImmutable(reviewEndpoints.listByHotel(hotelId), fetcher);
  return { isLoading, data, error, mutate };
}
