'use client';

import { useLocale } from 'next-intl';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';

import { useState } from 'react';
import { LocaleConfig } from '~/configs/locale.config';
import { useIPathname, useIRouter } from '~/locales/i18nNavigation';
import { Button } from '../ui/button';

export default function LocaleSwitcher() {
  const router = useIRouter();
  const pathname = useIPathname();
  const locale = useLocale();
  const [flagElement] = useState(() => LocaleConfig.localeFlags.find((l) => l.code === locale));

  const handleChange = (locale: string) => {
    router.push(pathname, { locale });
    router.refresh();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          {flagElement ? <flagElement.flag className="h-4 w-4" /> : locale.toUpperCase()}
          <span className="sr-only">Toggle Locale</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-max min-w-fit" align="end">
        {LocaleConfig.localeFlags.map((locale) => (
          <DropdownMenuItem key={locale.code} onClick={() => handleChange(locale.code)} className="gap-1">
            <locale.flag className="mr-0.5 h-4 w-4" />
            {locale.code.toLocaleUpperCase()}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
