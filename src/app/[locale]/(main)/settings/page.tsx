'use client';

import Profile from '~/components/layouts/settings/profile/Profile';
import useProfile from '~/hooks/useProfile';

export default function ProfilePage() {
  const { isLoading, data, error, role, mutate } = useProfile();
  if (isLoading) return <div>Loading...</div>;
  if (error || !data) return <div>Error: {error.message}</div>;

  return <Profile data={data} role={role} mutate={mutate} />;
}
