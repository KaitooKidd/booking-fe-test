'use client';

import { MapPin } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { MouseEvent, useEffect, useState } from 'react';
import { FaSpinner } from 'react-icons/fa';
import { FavoriteApi } from '~/apis/favorite.api';
import { HotelSchema } from '~/apis/hotel.api';
import { Icons } from '~/components/common/Icons';
import { toast } from '~/components/ui/use-toast';
import { UserRole } from '~/configs/role.config';
import { routeConfig } from '~/configs/route.config';
import { useAuth } from '~/contexts/auth.context';
import useFavoriteHotels from '~/hooks/useFavoriteHotels';
import { useIRouter } from '~/locales/i18nNavigation';
import { isFavoriteHotel } from '~/utils/favorite.util';
import { cn } from '~/utils/ui.util';
import AmenityWrapper from '../../amenities/AmenityWrapper';

interface FavoriteHotelCardProps {
  hotel: HotelSchema;
}

export default function FavoriteHotelCard({ hotel }: FavoriteHotelCardProps) {
  const { user } = useAuth();
  const { removeFavoriteHotel, addFavoriteHotel } = useFavoriteHotels();
  const [isFavorite, setIsFavorite] = useState(true);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  const t = useTranslations();
  const router = useIRouter();

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
      className={cn('relative z-0 col-span-1 cursor-pointer transition hover:scale-105')}
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
          </div>
          <div className="line-clamp-1 text-primary/90">{hotel.description}</div>

          <div className="text-primary/90">
            <AmenityWrapper className="text-muted-foreground">
              <MapPin className="size-4" /> {hotel.address.country}, {hotel.address.province}
            </AmenityWrapper>
          </div>
        </div>
      </div>
    </div>
  );
}
