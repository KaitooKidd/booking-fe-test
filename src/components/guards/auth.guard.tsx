'use client';

import { useTranslations } from 'next-intl';
import { routeConfig } from '~/configs/route.config';
import { useAuth } from '~/contexts/auth.context';
import GuardDeny from '../layouts/auth/GuardDeny';

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { /* isLoading, */ isAuthenticated } = useAuth();
  const t = useTranslations('Guard');

  // const router = useIRouter();

  // useEffect(() => {
  //   if (!isAuthenticated) {
  //     router.push(routeConfig.SIGN_IN);
  //   }
  // }, [isAuthenticated, router]);
  // if (isLoading) return <GlobalLoading />;

  if (!isAuthenticated) {
    return <GuardDeny title={t('unauthorized')} link={routeConfig.SIGN_IN} linkText={t('signIn')} />;
  }

  return <>{children}</>;
}

export function withAuthGuard<T>(Component: React.ComponentType<T>) {
  return function WithRoleGuardWrapper(props: any) {
    return (
      <AuthGuard>
        <Component {...props} />
      </AuthGuard>
    );
  };
}
