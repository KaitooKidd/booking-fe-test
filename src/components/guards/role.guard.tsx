'use client';

import { useTranslations } from 'next-intl';
import { UserRole } from '~/configs/role.config';
import { routeConfig } from '~/configs/route.config';
import { useAuth } from '~/contexts/auth.context';
import GuardDeny from '../layouts/auth/GuardDeny';

type AllowedRolesType = {
  allowedRoles: UserRole[];
  notAllowedRoles?: never;
};

type NotAllowedRolesType = {
  allowedRoles?: never;
  notAllowedRoles: UserRole[];
};

type RoleGuardType = AllowedRolesType | NotAllowedRolesType;

type RoleGuardProps = { children: React.ReactNode } & RoleGuardType;

export default function RoleGuard({ children, allowedRoles, notAllowedRoles }: RoleGuardProps) {
  const { user } = useAuth();
  const t = useTranslations('Guard');

  const userRole = user?.role as UserRole; // ensure user is not null (RoleGuard in AuthGuard)
  // const userRole = user?.role;
  // if (!userRole) {
  //   return <GuardDeny title={t('unauthorized')} link={routeConfig.SIGN_IN} linkText={t('signIn')} />;
  // }

  const isAllowed =
    (allowedRoles && allowedRoles.includes(userRole)) || (notAllowedRoles && !notAllowedRoles.includes(userRole));

  if (!isAllowed) {
    return <GuardDeny title={t('notEnoughPermission')} link={routeConfig.HOME} linkText={t('goHome')} />;
  }

  return <>{children}</>;
}

export function withRoleGuard<T>(Component: React.ComponentType<T>, roles: RoleGuardType) {
  return function WithRoleGuardWrapper(props: any) {
    if (roles.allowedRoles) {
      return (
        <RoleGuard allowedRoles={roles.allowedRoles}>
          <Component {...props} />
        </RoleGuard>
      );
    }
    if (roles.notAllowedRoles) {
      return (
        <RoleGuard notAllowedRoles={roles.notAllowedRoles}>
          <Component {...props} />
        </RoleGuard>
      );
    }
    throw new Error('Missing allowedRoles or notAllowedRoles'); // return null; // ensure at least one of allowedRoles or notAllowedRoles is provided
  };
}
