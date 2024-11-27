'use client';

import { useEffect } from 'react';
import { FavoriteApi } from '~/apis/favorite.api';
import { UserRole } from '~/configs/role.config';
import { useAuth } from '~/contexts/auth.context';
import useFavoriteHotels from '~/hooks/useFavoriteHotels';

interface CustomerLayoutProps {
  children: React.ReactNode;
}

export default function CustomerLayout({ children }: CustomerLayoutProps) {
  const { user } = useAuth();
  const { setFavoriteHotels } = useFavoriteHotels();

  useEffect(() => {
    const getFavoriteHotels = async () => {
      const { isSuccess, data } = await FavoriteApi.listFavorites();
      if (isSuccess) {
        setFavoriteHotels(data);
      }
    };
    if (user && user.role === UserRole.CUSTOMER) {
      getFavoriteHotels();
    }
  }, [user, setFavoriteHotels]);

  return <>{children}</>;
}
