import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { LocaleConfig } from '~/configs/locale.config';

// Using internationalization in Server Components
export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!LocaleConfig.locales.includes(locale as any)) notFound();

  return {
    messages: (await import(`./${locale}.locale.json`)).default,
  };
});
