'use client';

import { CaretSortIcon } from '@radix-ui/react-icons';
import { format } from 'date-fns';
import { CheckIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { HotelSchema } from '~/apis/hotel.api';
import { CalendarDateRangePicker } from '~/components/common/DateRangePicker';
import { Button } from '~/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '~/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover';
import useHotelFilters from '~/hooks/useHotelFilters';
import { getAvailableRooms, getMergeRoomsWith } from '~/utils/hotel.util';
import { cn } from '~/utils/ui.util';
import RecommendMergeRooms from './RecommendMergeRooms';
import RecommendRoomItem from './RecommendRoomItem';

interface RecommendationProps {
  hotel: HotelSchema;
}

export default function Recommendation({ hotel }: RecommendationProps) {
  const t = useTranslations();
  const { searchBar } = useHotelFilters();

  const [date, setDate] = useState<DateRange | undefined>(searchBar.timeRange);
  const [selectedRoom, setSelectedRoom] = useState<number | undefined>();

  return (
    <div aria-label="recommend" className="pb-10">
      <h3 className="my-4 text-xl font-semibold">{t('HotelDetails.heading.recommendation')}</h3>
      <div className="flex items-center justify-between gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" role="combobox" className="min-w-[200px] max-w-[50%] justify-between">
              {selectedRoom ? hotel.rooms.find((room) => room.id === selectedRoom)?.title : 'Select room...'}
              <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Search framework..." className="h-9" />
              <CommandEmpty>No framework found.</CommandEmpty>
              <CommandGroup>
                <CommandList>
                  {hotel.rooms.map((room) => (
                    <CommandItem
                      key={room.id}
                      value={room.id.toString()}
                      onSelect={(currentValue) => {
                        setSelectedRoom(+currentValue === selectedRoom ? undefined : +currentValue);
                      }}
                    >
                      {room.title}
                      <CheckIcon
                        className={cn('ml-auto h-4 w-4', selectedRoom === room.id ? 'opacity-100' : 'opacity-0')}
                      />
                    </CommandItem>
                  ))}
                </CommandList>
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
        <CalendarDateRangePicker date={date} onDateChange={setDate} />
      </div>

      {!date || !date.from || !date.to ? (
        <div className="mt-5 text-center font-medium">{t('HotelDetails.recommendation.timeRequired')}</div>
      ) : selectedRoom ? (
        <RecommendMergeRooms
          hotel={hotel}
          rooms={getMergeRoomsWith(hotel.rooms, hotel.rooms.find((room) => room.id === selectedRoom)!, {
            start: format(date.from, 'yyyy-MM-dd'),
            end: format(date.to, 'yyyy-MM-dd'),
          })}
        />
      ) : (
        <>
          <div className="mt-5 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {getAvailableRooms(hotel.rooms, date).map((room) => (
              <RecommendRoomItem key={room.id} room={room} hotel={hotel} date={date} canBook />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
