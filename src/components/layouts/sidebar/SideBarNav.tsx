'use client';

import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { buttonVariants } from '~/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '~/components/ui/tooltip';
import { UserRole } from '~/configs/role.config';
import { adminSidebarItems, hotelSidebarItems, receptionistsSidebarItems } from '~/configs/sidebar.config';
import { ILink } from '~/locales/i18nNavigation';
import { cn } from '~/utils/ui.util';

interface SideBarNavProps {
  isOpen: boolean;
  role?: UserRole | null;
}

const getSidebarItems = (role: SideBarNavProps['role']) => {
  switch (role) {
    case UserRole.ADMIN:
      return adminSidebarItems;
    case UserRole.HOTEL_MANAGER:
      return hotelSidebarItems;
    case UserRole.RECEPTIONIST:
      return receptionistsSidebarItems;
    default:
      return [];
  }
};

export function SideBarNav({ isOpen, role }: SideBarNavProps) {
  const t = useTranslations('Sidebar');

  const items = getSidebarItems(role);
  const pathname = usePathname(); // /en/system/admin/overview

  return (
    <nav
      className={cn(
        'flex flex-col gap-1 px-3 py-4 transition-all',
        !isOpen ? 'w-fit duration-200' : 'w-full duration-300',
      )}
    >
      {items.map((item, index) => (
        <ILink
          key={index}
          href={item.link}
          className={cn(
            buttonVariants({ variant: pathname.includes(item.link) ? 'default' : 'ghost' }),
            pathname.includes(item.link) &&
              'dark:bg-muted dark:text-primary dark:hover:bg-muted dark:hover:text-primary',
            'relative justify-start',
          )}
        >
          <item.icon className="size-4" />
          <span
            className={cn(
              !isOpen
                ? 'm-0 w-0 opacity-0 transition-all duration-75' /* transition-duration here triggered when click collapse button */
                : 'ml-2 w-max opacity-100 transition-all duration-500' /* transition-duration here triggered when click expand button */, //
            )}
          >
            {t(item.title)}
          </span>

          {!isOpen && (
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <span className="absolute inset-0"></span>
              </TooltipTrigger>
              <TooltipContent side="right" className="flex items-center gap-4">
                {t(item.title)}
              </TooltipContent>
            </Tooltip>
          )}
        </ILink>
      ))}
    </nav>
  );
}
