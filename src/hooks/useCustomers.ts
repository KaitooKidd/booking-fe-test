import useSWRImmutable from 'swr/immutable';
import { CustomerApiEndpoints, CustomerInfo } from '~/apis/customer.api';
import { PrivateFetchInstance } from '~/apis/instances/fetch.instance';

export default function useCustomers() {
  const fetcher = (url: string) => new PrivateFetchInstance<CustomerInfo[]>().fetcher(url, 'GET');
  return useSWRImmutable(CustomerApiEndpoints.list, fetcher);
}
