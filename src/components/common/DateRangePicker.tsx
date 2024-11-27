'use client';

import { CalendarIcon } from '@radix-ui/react-icons';
import { format } from 'date-fns';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { DateRange } from 'react-day-picker';

import { Button } from '~/components/ui/button';
import { Calendar } from '~/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover';
import { cn } from '~/utils/ui.util';

interface CalendarDateRangePickerProps {
  date?: DateRange | undefined;
  // onDateChange: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
  onDateChange?: (_date: DateRange | undefined) => void;
  title?: string;
  className?: string;
  fromDate?: Date;
  disabledDates?: Date[];
}

export function CalendarDateRangePicker({
  date: initRange,
  onDateChange,
  title,
  className,
  fromDate,
  disabledDates = [],
}: CalendarDateRangePickerProps) {
  const t = useTranslations('Shared.datePicker');
  const [date, setDate] = useState<DateRange | undefined>(initRange);

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={'outline'}
            className={cn('w-[300px] justify-start text-left font-normal', !date && 'text-muted-foreground')}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, 'LLL dd, y')} - {format(date.to, 'LLL dd, y')}
                </>
              ) : (
                format(date.from, 'LLL dd, y')
              )
            ) : (
              <span>{title ?? t('title')}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            fromDate={fromDate}
            selected={date}
            onSelect={(date) => {
              setDate(date);
              if (onDateChange) onDateChange(date);
            }}
            numberOfMonths={2}
            disabled={disabledDates}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
