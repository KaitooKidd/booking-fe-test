import { Cormorant_Garamond, Inter, Roboto_Mono } from 'next/font/google';

// See more: https://nextjs.org/docs/app/building-your-application/optimizing/fonts
export const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
  variable: '--font-inter',
});

export const roboto_mono = Roboto_Mono({
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
  variable: '--font-roboto-mono',
});

export const cormorant_garamond = Cormorant_Garamond({
  subsets: ['cyrillic', 'cyrillic-ext', 'latin', 'latin-ext', 'vietnamese'],
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant-garamond',
});
