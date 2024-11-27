// type VerifyEmailProps = PropsWithChildren; // 'react'

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import VerifyEmail from '~/components/layouts/auth/VerifyEmail';

interface VerifyEmailProps {
  searchParams: {
    // [key: string]: string | string[] | undefined;
    to: string | undefined;
    token: string | undefined;
  };
}

const VerifyEmailPage = ({ searchParams }: VerifyEmailProps) => {
  const t = useTranslations('VerifyEmail');

  const token = searchParams.token;
  const toEmail = searchParams.to;

  return (
    <div className="container relative flex flex-col items-center justify-center pt-20 lg:px-0">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        {token && typeof token === 'string' ? (
          <div className="grid gap-6">
            <VerifyEmail token={token} />
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center space-y-1">
            <div className="relative mb-4 h-60 w-60 text-muted-foreground">
              <Image src="/images/email-sent.png" fill alt="Booking email sent image" />
            </div>

            <h3 className="text-2xl font-semibold">{t('title')}</h3>

            {toEmail ? (
              <p className="text-center text-muted-foreground">
                {/* We&apos;ve sent a verification link to <span className="font-semibold">{toEmail}</span>. */}
                {t.rich('emailSentTo', {
                  email: toEmail,
                  bold: (text) => <span className="font-semibold">{text}</span>,
                })}
              </p>
            ) : (
              <p className="text-center text-muted-foreground">
                {/* We&apos;ve sent a verification link to your email. */}
                {t('emailSent')}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;
