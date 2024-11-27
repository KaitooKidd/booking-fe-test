'use client';

import { useEffect } from 'react';
import { routeConfig } from '~/configs/route.config';
import { useAuth } from '~/contexts/auth.context';
import { useIRouter } from '~/locales/i18nNavigation';

interface GuestGuardProps {
  children: React.ReactNode;
}

export default function GuestGuard({ children }: GuestGuardProps) {
  const { /* isLoading, */ isAuthenticated } = useAuth();
  const router = useIRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push(routeConfig.HOME);
    }
  }, [isAuthenticated, router]);

  // if (isLoading) return <GlobalLoading />;
  return <>{children}</>;
}

export function withGuestGuard<T>(Component: React.ComponentType<T>) {
  return function WithGuestGuardWrapper(props: any) {
    return (
      <GuestGuard>
        <Component {...props} />
      </GuestGuard>
    );
  };
}
