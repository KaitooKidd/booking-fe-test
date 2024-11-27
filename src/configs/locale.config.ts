// import type { LocalePrefix } from 'next-intl/dist/types/src/shared/types';

import { FlagIcons } from '~/components/common/Icons';

export const LocaleConfig = {
  locales: ['en', 'vn'],
  defaultLocale: 'vn',
  localePrefix: 'as-needed' as any,
  localeFlags: [
    { code: 'en', flag: FlagIcons.us },
    { code: 'vn', flag: FlagIcons.vn },
  ],
};
