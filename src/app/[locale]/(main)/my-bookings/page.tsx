'use client';

import { useTranslations } from 'next-intl';
import AuthGuard from '~/components/guards/auth.guard';
import MyBookingCard from '~/components/layouts/booking/MyBookingCard';
import { UserRole } from '~/configs/role.config';
import { useAuth } from '~/contexts/auth.context';
import useMyBookings from '~/hooks/useMyBookings';

interface MyBookingsPageProps {}

export default function MyBookingsPage({}: MyBookingsPageProps) {
  const t = useTranslations('MyBookings');

  const { user } = useAuth();
  const { isLoading, data, error } = useMyBookings();

  if (!user) return <div>Not authenticated </div>;
  if (isLoading) return <div>Loading...</div>;
  if (error || !data) return <div>Error</div>;

  return (
    <AuthGuard>
      <div className="flex flex-col gap-10">
        <h2 className="mb-6 mt-2 text-xl font-semibold md:text-2xl">{t('title', { role: user.role })}</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {data.map((item) => (
            <MyBookingCard key={item.id} booking={item} isCustomer={user.role === UserRole.CUSTOMER} />
          ))}
        </div>
      </div>
    </AuthGuard>
  );
}
