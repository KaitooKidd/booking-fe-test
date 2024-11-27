'use client';

import { addDays, differenceInCalendarDays, format } from 'date-fns';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { Calendar } from '~/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover';
import { cn } from '~/utils/ui.util';

interface HotelSearchTimeRangeProps {
  date: DateRange | undefined;
  setDate: (date: DateRange | undefined) => void;
}

export default function HotelSearchTimeRange({ date, setDate }: HotelSearchTimeRangeProps) {
  // const [date, setDate] = useState<DateRange | undefined>(undefined);
  const t = useTranslations('HotelFilters.searchBar.time');
  const [open, setOpen] = useState(false);

  return (
    <div aria-label="hotel-filter-time">
      <Popover
        open={open}
        onOpenChange={(value) => {
          // NOTE: Handle missing or invalid end date (minimum 1 day difference) before close modal
          if (value === false && date?.from && (!date?.to || differenceInCalendarDays(date.to, date.from) < 1)) {
            const from = date.from;
            const to = addDays(from, 1);
            setDate({ from, to });
          }
          setOpen(value);
        }}
      >
        <PopoverTrigger asChild>
          <div className="flex min-w-[200px] cursor-pointer divide-x-2 font-normal">
            <div className="flex flex-1 flex-col pr-4 text-sm font-semibold">
              <span className="text-xs">{t('checkIn')}</span>
              <span className={cn(!date?.from && 'font-normal text-muted-foreground')}>
                {date?.from ? format(date.from, 'LLL dd') : t('placeholder')}
              </span>
            </div>
            <div className="flex flex-1 flex-col pl-4 text-sm font-semibold">
              <span className="text-xs">{t('checkOut')}</span>
              <span className={cn(!date?.to && 'font-normal text-muted-foreground')}>
                {date?.to ? format(date.to, 'LLL dd') : t('placeholder')}
              </span>
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            fromDate={new Date()}
            defaultMonth={date?.from}
            selected={date}
            onSelect={(range, _selected, _active, _event) => {
              // setDate(range); // BUG: cannot reset / clear date range if range undefined?
              if (!range) setDate({ from: undefined, to: undefined });
              else setDate(range);
            }}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
