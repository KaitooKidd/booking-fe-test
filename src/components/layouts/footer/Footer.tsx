import { ArrowRight, Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { PiTelegramLogoDuotone } from 'react-icons/pi';
import Container from '~/components/common/Container';
import { routeConfig } from '~/configs/route.config';
import { ILink } from '~/locales/i18nNavigation';
import { cn } from '~/utils/ui.util';

interface FooterProps {
  className?: string;
}

export default function Footer({ className = '' }: FooterProps) {
  const t = useTranslations('Footer');

  return (
    <footer
      className={cn(
        'relative -mb-4 border-t bg-background text-foreground sm:-mx-6 md:-mx-10 lg:-mx-16 xl:-mx-20' /* negative margin to remove Container css */,
        className,
      )}
    >
      <Container className="!px-4 py-20">
        <div className="grid grid-cols-1 gap-5 text-sm md:grid-cols-2 lg:grid-cols-4">
          <div aria-label="about">
            <h3 className="footer-heading">{t('about.title')}</h3>
            <p className="mt-4 text-xs italic">&quot;Discover Comfort, Experience Luxury&quot;</p>
            <p className="mt-2">{t('about.description')}</p>
          </div>

          <div aria-labelledby="general">
            <h3 className="footer-heading">{t('general.title')}</h3>
            <div className="mt-4 flex flex-col gap-3">
              <ILink href={routeConfig.HOME} className="footer-general-link group">
                <ArrowRight className="group-hover:-rotate-45" />
                {t('general.home')}
              </ILink>
              <ILink href={routeConfig.HOTELS} className="footer-general-link group">
                <ArrowRight className="group-hover:-rotate-45" />
                {t('general.discovery')}
              </ILink>
              <ILink href="" className="footer-general-link group">
                <ArrowRight className="group-hover:-rotate-45" />
                {t('general.p&s')}
              </ILink>
              <ILink href="" className="footer-general-link group">
                <ArrowRight className="group-hover:-rotate-45" />
                {t('general.faqs')}
              </ILink>
            </div>
          </div>

          <div>
            <h3 className="footer-heading">{t('contact.title')}</h3>
            <div className="mt-4 space-y-2.5">
              <p>E: contact.uet.booking@gmail.com</p>
              <p>A: {t('contact.address')}</p>
              <p>P: +84 987 654 321</p>
            </div>
          </div>

          <div aria-label="social">
            <h3 className="footer-heading">{t('social.title')}</h3>
            <p className="mt-4">{t('social.description')}</p>
            <div className="mt-4 flex gap-4">
              <Link href="">
                <Instagram className="size-6 text-primary" />
              </Link>
              <Link href={'https://www.facebook.com/profile.php?id=100015622656560'} target="_blank">
                <Facebook className="size-6 text-primary" />
              </Link>
              <Link href="">
                <PiTelegramLogoDuotone className="size-6 text-primary" />
              </Link>
              <Link href="">
                <Twitter className="size-6 text-primary" />
              </Link>
              <Link href="">
                <Linkedin className="size-6 text-primary" />
              </Link>
            </div>
          </div>
        </div>
      </Container>
      <p className="bg-foreground p-2 text-center text-xs font-bold text-background">
        UET Booking © 2024 All Rights Reserved.
      </p>
    </footer>
  );
}
