'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { cn } from '~/utils/ui.util';

interface EmptyResourceProps {
  className?: string;
}

export default function EmptyResource({ className }: EmptyResourceProps) {
  const t = useTranslations('Shared.emptyResult');

  return (
    <div className={cn('flex-center w-full flex-col p-20', className)}>
      <Image src={'/images/empty.png'} alt="empty-hotels" width={300} height={300} />
      <div className="flex flex-col items-center">
        <p className="text-3xl font-semibold leading-none text-red-700">{t('title')}</p>
        <p className="mt-2 text-lg text-gray-500">{t('description')}</p>
      </div>
    </div>
  );
}
