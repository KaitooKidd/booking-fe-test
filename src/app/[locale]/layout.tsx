import type { Metadata } from 'next';
import { NextIntlClientProvider, useMessages } from 'next-intl';
import { notFound } from 'next/navigation';
import { ThemeProvider } from '~/components/common/ThemeProvider';
import { Toaster } from '~/components/ui/toaster';
import { TooltipProvider } from '~/components/ui/tooltip';
import { cormorant_garamond, inter, roboto_mono } from '~/configs/font.config';
import { LocaleConfig } from '~/configs/locale.config';
import { themesConfig } from '~/configs/theme.config';
import { AuthContextProvider } from '~/contexts/auth.context';
import '~/styles/globals.css';

export const metadata: Metadata = {
  title: 'UET Booking',
  description: 'Booking a hotel of your choice',
  icons: { icon: '/images/favicon.png' },
};

interface LayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export default function RootLayout({ children, params: { locale } }: LayoutProps) {
  // Validate that the incoming `locale` parameter is valid
  if (!LocaleConfig.locales.includes(locale)) notFound();

  // Using internationalization in Client Components
  const messages = useMessages();

  return (
    <html
      lang={locale}
      suppressHydrationWarning={true} // https://github.com/vercel/next.js/discussions/22388
      className={`${inter.variable} ${roboto_mono.variable} ${cormorant_garamond.variable}`}
    >
      <body className={inter.className}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider attribute="class" defaultTheme={themesConfig.SYSTEM} enableSystem disableTransitionOnChange>
            <TooltipProvider delayDuration={0}>
              <AuthContextProvider>{children}</AuthContextProvider>
            </TooltipProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
