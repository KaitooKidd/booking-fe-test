'use client';

import { useTranslations } from 'next-intl';
import AuthGuard from '~/components/guards/auth.guard';
import RoleGuard from '~/components/guards/role.guard';
import FavoriteHotelCard from '~/components/layouts/hotels/Saved/FavoriteHotelCard';
import { buttonVariants } from '~/components/ui/button';
import { UserRole } from '~/configs/role.config';
import { routeConfig } from '~/configs/route.config';
import useFavoriteHotels from '~/hooks/useFavoriteHotels';
import { ILink } from '~/locales/i18nNavigation';

interface SavedPageProps {}

export default function SavedPage({}: SavedPageProps) {
  const { data } = useFavoriteHotels();
  const t = useTranslations('Favorites');

  return (
    <AuthGuard>
      <RoleGuard allowedRoles={[UserRole.CUSTOMER]}>
        {data.length ? (
          <div className="mt-4 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {data.map((hotel) => (
              <FavoriteHotelCard hotel={hotel} key={hotel.id} />
            ))}
          </div>
        ) : (
          <div className="mt-24 space-y-4 text-center">
            <h1 className="text-2xl font-semibold">{t('empty.title')}</h1>
            <p className="text-muted-foreground">{t('empty.description')}</p>
            <ILink href={routeConfig.HOTELS} className={buttonVariants({ variant: 'default' })}>
              {t('empty.discovery')}
            </ILink>
          </div>
        )}
      </RoleGuard>
    </AuthGuard>
  );
}
