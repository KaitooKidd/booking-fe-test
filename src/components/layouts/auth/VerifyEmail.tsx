'use client';

import { ReloadIcon } from '@radix-ui/react-icons';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { AuthApi } from '~/apis/auth.api';
import { Icons } from '~/components/common/Icons';
import { buttonVariants } from '~/components/ui/button';
import { routeConfig } from '~/configs/route.config';
import { useAuth } from '~/contexts/auth.context';
import { ILink } from '~/locales/i18nNavigation';

interface VerifyEmailProps {
  token: string;
}

const VerifyEmail = ({ token }: VerifyEmailProps) => {
  const t = useTranslations('VerifyEmail');
  const { isAuthenticated } = useAuth();
  const { data, isLoading, isError } = AuthApi.useVerifyEmail(token);

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-2">
        <Icons.xCircle className="h-8 w-8 text-red-600" />
        <h3 className="text-xl font-semibold">{t('failed')}</h3>
        <p className="text-sm text-muted-foreground">{t('failedDescription')}</p>
      </div>
    );
  }

  if (!isError && data) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <div className="relative mb-4 h-60 w-60 text-muted-foreground">
          <Image src="/images/email-sent.png" fill alt="the email was sent" />
        </div>

        <h3 className="text-2xl font-semibold">{t('success')}</h3>
        <p className="mt-1 text-center text-muted-foreground">{t('successDescription')}</p>
        <ILink
          className={buttonVariants({ className: 'mt-4' })}
          href={isAuthenticated ? routeConfig.SETTINGS : routeConfig.SIGN_IN}
        >
          {t('successNextStep', { isAuthenticated })}
        </ILink>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center gap-2">
        <ReloadIcon className="h-8 w-8 animate-spin text-zinc-300" />
        <h3 className="text-xl font-semibold">{t('verifying')}</h3>
        <p className="text-sm text-muted-foreground">{t('verifyingDescription')}</p>
      </div>
    );
  }
};

export default VerifyEmail;
