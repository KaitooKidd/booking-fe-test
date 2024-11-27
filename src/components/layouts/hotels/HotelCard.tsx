'use client';

import { MapPin, Star } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { MouseEvent, useEffect, useState } from 'react';
import { FaSpinner } from 'react-icons/fa';
import { FavoriteApi } from '~/apis/favorite.api';
import { HotelOverview } from '~/apis/hotel.api';
import { Icons } from '~/components/common/Icons';
import { Button } from '~/components/ui/button';
import { toast } from '~/components/ui/use-toast';
import { UserRole } from '~/configs/role.config';
import { routeConfig } from '~/configs/route.config';
import { useAuth } from '~/contexts/auth.context';
import useFavoriteHotels from '~/hooks/useFavoriteHotels';
import { useIRouter } from '~/locales/i18nNavigation';
import { convertPriceToString } from '~/utils/common.util';
import { isFavoriteHotel } from '~/utils/favorite.util';
import { cn } from '~/utils/ui.util';
import AmenityWrapper from '../amenities/AmenityWrapper';

interface HotelCardProps {
  hotel: HotelOverview;
}

export default function HotelCard({ hotel }: HotelCardProps) {
  const { user } = useAuth();
  const { data, removeFavoriteHotel, addFavoriteHotel } = useFavoriteHotels();
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  const t = useTranslations();
  const router = useIRouter();
  // const pathname = useIPathname();
  // const isMyHotel = pathname.includes(routeConfig.MY_HOTEL);
  const isMyHotel = hotel.email === user?.email;

  useEffect(() => {
    setIsFavorite(isFavoriteHotel(data, hotel));
  }, [data]);

  const handleAddFavorite = async () => {
    const response = await FavoriteApi.addFavorites({ hotelIds: [hotel.id] });
    if (response.isSuccess) {
      toast({ variant: 'success', description: t('Favorites.toast.addSuccess') });
      setIsFavorite(true);
      addFavoriteHotel(hotel);
    } else {
      toast({ variant: 'destructive', description: t('Favorites.toast.addFailure') });
    }
  };

  const handleRemoveFavorite = async () => {
    const response = await FavoriteApi.removeFavorite(hotel.id);
    if (response.isSuccess) {
      toast({ variant: 'success', description: t('Favorites.toast.removeSuccess') });
      setIsFavorite(false);
      removeFavoriteHotel(hotel);
    } else {
      toast({ variant: 'destructive', description: t('Favorites.toast.removeFailure') });
    }
  };

  const handleToggleFavorite = (e: MouseEvent) => {
    e.stopPropagation();
    if (!user || user.role !== UserRole.CUSTOMER) return;

    setFavoriteLoading(true);
    if (isFavorite) {
      handleRemoveFavorite();
    } else {
      handleAddFavorite();
    }
    setFavoriteLoading(false);
  };

  return (
    <div
      onClick={() => router.push(routeConfig.HOTEL_DETAILS(hotel.id))}
      className={cn(
        'relative z-0 col-span-1 cursor-pointer transition hover:scale-105' /* isMyHotel && 'cursor-default' */,
      )}
    >
      {/* Favorite */}
      {user && user.role === UserRole.CUSTOMER && (
        <div className="absolute right-5 top-5 z-10 transition-all hover:scale-125">
          {favoriteLoading ? (
            <FaSpinner className="size-6 animate-spin" />
          ) : (
            <Icons.heart
              onClick={handleToggleFavorite}
              className={cn(
                'size-6 cursor-pointer text-primary/90',
                isFavorite ? '!fill-red-500 text-primary' : 'fill-primary/50',
              )}
            />
          )}
        </div>
      )}

      {/* Main Content */}
      <div className="space-y-3 rounded-lg bg-background/50">
        {/* Cover */}
        <div className="relative aspect-[4/3] h-auto w-full overflow-hidden">
          <Image fill src={hotel.imageUrl} alt={hotel.name} className="h-auto w-full rounded-lg object-cover" />
        </div>

        {/* Info */}
        <div className="space-y-1 text-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">{hotel.name}</h3>
            <p className="flex items-center gap-0.5 font-medium">
              <Star className="size-4 fill-yellow-500 stroke-yellow-500" />
              {hotel.overview.reviews.total === 0 ? t('HotelForm.noRating') : hotel.overview.reviews.average.toFixed(1)}
            </p>
          </div>
          <div className="line-clamp-1 text-primary/90">{hotel.description}</div>

          <div className="text-primary/90">
            <AmenityWrapper className="text-muted-foreground">
              <MapPin className="size-4" /> {hotel.address.country}, {hotel.address.province}
            </AmenityWrapper>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center justify-between gap-1">
              {hotel.overview.rooms.minPrice && (
                <>
                  <span className="text-base font-semibold">{convertPriceToString(hotel.overview.rooms.minPrice)}</span>{' '}
                  <span className="text-sm text-primary/70">VND/{t('HotelForm.pricePerNight')}</span>
                </>
              )}
            </div>
            {isMyHotel && (
              <Button onClick={() => router.push(routeConfig.MY_HOTEL)} variant="outline">
                {t('HotelForm.button.edit')}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
