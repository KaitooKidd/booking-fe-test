import { createSharedPathnamesNavigation } from 'next-intl/navigation';
import { LocaleConfig } from '~/configs/locale.config';

export const {
  Link: ILink,
  redirect,
  usePathname: useIPathname,
  useRouter: useIRouter,
} = createSharedPathnamesNavigation({
  locales: LocaleConfig.locales,
  localePrefix: LocaleConfig.localePrefix,
});
