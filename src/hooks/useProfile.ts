'use client';

import useSWR from 'swr';
import { PrivateFetchInstance } from '~/apis/instances/fetch.instance';
import { ProfileApiEndpoints, ProfileInfo } from '~/apis/profile.api';
import { useAuth } from '~/contexts/auth.context';

export default function useProfile() {
  const { user } = useAuth();
  const fetcher = (url: string) => new PrivateFetchInstance<ProfileInfo>().fetcher(url, 'GET');
  return { ...useSWR(ProfileApiEndpoints.get(user?.role as string), fetcher), role: user?.role as string };
}
