'use client';

import { Minus, Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Button } from '~/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover';
import { cn } from '~/utils/ui.util';

interface HotelSearchPeopleProps {
  guest: number | undefined;
  setGuest: (value: number) => void;
}

export default function HotelSearchPeople({ guest = 0, setGuest }: HotelSearchPeopleProps) {
  const t = useTranslations('HotelFilters.searchBar.people');
  // const [guest, setGuest] = useState(0);

  return (
    <div aria-label="search-bar-people">
      <Popover>
        <PopoverTrigger asChild>
          <div className="line-clamp-1 flex w-[150px] cursor-pointer flex-col justify-between font-semibold">
            <span className="text-xs">{t('label')}</span>
            <span className={cn('text-sm', !guest && 'font-normal text-muted-foreground')}>
              {guest ? t('data', { guest }) : t('placeholder')}
            </span>
          </div>
        </PopoverTrigger>
        <PopoverContent className="min-w-[400px] rounded-3xl">
          {/* Guests */}
          <div className="flex items-center justify-between">
            <div className="flex w-max flex-col">
              <span className="font-semibold">{t('guest')}</span>
              <span className="text-sm">{t('guestDesc')}</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full border"
                onClick={() => setGuest(Math.max(guest - 1, 0))}
                disabled={guest === 0}
              >
                <Minus className="size-4" />
              </Button>
              <span>{guest}</span>
              <Button variant="ghost" size="icon" className="rounded-full border" onClick={() => setGuest(guest + 1)}>
                <Plus className="size-4" />
              </Button>
            </div>
          </div>
          {/* Adults, Children, ... */}
          {/* Reset */}
          <div className="mt-2 flex justify-end border-t pt-2">
            <Button variant="ghost" size="sm" onClick={() => setGuest(0)}>
              {t('reset')}
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
