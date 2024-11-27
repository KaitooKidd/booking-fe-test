'use client';

import { CheckIcon } from '@radix-ui/react-icons';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '~/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover';
import { ScrollArea } from '~/components/ui/scroll-area';
import { getVNCities } from '~/constants/location.constant';
import { cn } from '~/utils/ui.util';

interface HotelSearchLocationProps {
  value: string | undefined;
  setValue: (value: string) => void;
}

export default function HotelSearchLocation({ value = '', setValue }: HotelSearchLocationProps) {
  const [open, setOpen] = useState(false);
  // const [value, setValue] = useState('');
  const t = useTranslations('HotelFilters.searchBar.location');
  const cities = getVNCities();

  return (
    <div aria-label="search-bar-location">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="line-clamp-1 flex w-[150px] flex-col justify-between font-semibold">
            <span className="text-xs">{t('label')}</span>
            <span className={cn('text-sm', !value && 'font-normal text-muted-foreground')}>
              {value ? value : t('placeholder')}
            </span>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder={t('inputPlaceholder')} className="h-9" />
            <CommandEmpty>{t('notFound')}</CommandEmpty>
            <CommandGroup>
              <CommandList>
                <ScrollArea className="h-[300px]">
                  {cities.map((city) => (
                    <CommandItem
                      key={city.code}
                      value={city.name}
                      onSelect={(currentValue) => {
                        setValue(currentValue === value ? '' : currentValue);
                        setOpen(false);
                      }}
                    >
                      {city.name}
                      <CheckIcon className={cn('ml-auto h-4 w-4', value === city.name ? 'opacity-100' : 'opacity-0')} />
                    </CommandItem>
                  ))}
                </ScrollArea>
              </CommandList>
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
