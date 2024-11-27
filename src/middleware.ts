import createMiddleware from 'next-intl/middleware';
import { LocaleConfig } from './configs/locale.config';

export default createMiddleware({
  // A list of all locales that are supported
  locales: LocaleConfig.locales,

  // Used when no locale matches
  defaultLocale: LocaleConfig.defaultLocale,
});

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(vn|en)/:path*'], // can use `/(${LocaleConfig.locales.join('|')})/:path*`, see more: https://nextjs.org/docs/messages/invalid-page-config
};
