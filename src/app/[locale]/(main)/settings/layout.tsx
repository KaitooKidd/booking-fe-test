import { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { useSelectedLayoutSegment } from 'next/navigation';
import AuthGuard from '~/components/guards/auth.guard';
import RoleGuard from '~/components/guards/role.guard';
import SettingNav from '~/components/layouts/settings/nav/SidebarNav';
import { Separator } from '~/components/ui/separator';
import { UserRole } from '~/configs/role.config';
import { routeConfig } from '~/configs/route.config';

export const metadata: Metadata = {
  title: 'Settings',
  description: 'Advanced form example using react-hook-form and Zod.',
};

const sidebarNavItems = [
  {
    title: 'profile',
    href: routeConfig.SETTINGS,
  },
  {
    title: 'account',
    href: routeConfig.SETTINGS_ACCOUNT,
    disabled: true,
  },
  {
    title: 'appearance',
    href: routeConfig.SETTINGS_APPEARANCE,
    disabled: true,
  },
  {
    title: 'notifications',
    href: routeConfig.SETTINGS_NOTIFICATIONS,
    disabled: true,
  },
  {
    title: 'display',
    href: routeConfig.SETTINGS_DISPLAY,
    disabled: true,
  },
];

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  const t = useTranslations('Settings');
  return (
    <AuthGuard>
      <RoleGuard notAllowedRoles={[UserRole.ADMIN]}>
        <div className="space-y-6 py-10">
          <div className="space-y-0.5">
            <h2 className="text-2xl font-bold tracking-tight">{t('title')}</h2>
            <p className="text-muted-foreground">{t('description')}</p>
          </div>
          <Separator className="my-6" />
          <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
            <aside className="-mx-4 lg:w-1/5">
              <SettingNav items={sidebarNavItems} />
            </aside>
            <div className="flex-1 lg:max-w-2xl">{children}</div>
          </div>
        </div>
      </RoleGuard>
    </AuthGuard>
  );
}
