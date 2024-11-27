'use client';

import { useTranslations } from 'next-intl';
import { buttonVariants } from '~/components/ui/button';
import { ILink, useIPathname } from '~/locales/i18nNavigation';
import { cn } from '~/utils/ui.util';

interface SettingNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string;
    title: string;
    disabled?: boolean;
  }[];
}

export default function SettingNav({ items, className, ...props }: SettingNavProps) {
  const t = useTranslations('Settings.nav');
  const pathname = useIPathname();

  return (
    <nav className={cn('flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1', className)} {...props}>
      {items.map((item) => (
        <ILink
          key={item.href}
          href={item.href}
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            pathname === item.href ? 'bg-muted hover:bg-muted' : 'hover:bg-transparent hover:underline',
            item.disabled && 'invisible',
            'justify-start',
          )}
          onClick={(e) => item.disabled && e.preventDefault()}
        >
          {t(item.title)}
        </ILink>
      ))}
    </nav>
  );
}
