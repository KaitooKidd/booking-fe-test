'use client';

import { differenceInCalendarDays, eachDayOfInterval, format, isWithinInterval, startOfDay } from 'date-fns';
import { Loader2, Wand2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { BookingApi, CreateBookingDto } from '~/apis/booking.api';
import { HotelSchema, RoomSchema } from '~/apis/hotel.api';
import { CalendarDateRangePicker } from '~/components/common/DateRangePicker';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '~/components/ui/alert-dialog';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '~/components/ui/card';
import { Checkbox } from '~/components/ui/checkbox';
import { Separator } from '~/components/ui/separator';
import { useToast } from '~/components/ui/use-toast';
import { routeConfig } from '~/configs/route.config';
import { useAuth } from '~/contexts/auth.context';
import useBookRoom from '~/hooks/useBookRoom';
import { useIRouter } from '~/locales/i18nNavigation';
import { convertPriceToString, splitNumber } from '~/utils/common.util';
import RoomAmenities from '../../amenities/RoomAmenities';

type DateRangeType = { startDate: Date; endDate: Date };
function checkTimeRangeOverlap(startDate: Date, endDate: Date, dateRanges: DateRangeType[]): boolean {
  const targetInterval = { start: startOfDay(startDate), end: startOfDay(endDate) };
  return dateRanges.some((dateRange) => {
    const interval = { start: startOfDay(dateRange.startDate), end: startOfDay(dateRange.endDate) };
    return (
      isWithinInterval(targetInterval.start, interval) ||
      isWithinInterval(targetInterval.end, interval) ||
      (targetInterval.start < interval.start && targetInterval.end > interval.end)
    );
  });
}

interface RoomBookingCardProps {
  hotel: HotelSchema;
  room: RoomSchema;
  canBook?: boolean;
}

export default function RoomBookingCard({
  room,
  hotel,
  canBook = false, // Booking Hotel Room
}: RoomBookingCardProps) {
  const t = useTranslations('RoomCard');
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useIRouter();
  const { setBookingRoomData, setPaymentIntentId } = useBookRoom();

  const [isBookingLoading, setIsBookingLoading] = useState(false);
  const [date, setDate] = useState<DateRange | undefined>();
  const [includeBreakfast, setIncludeBreakfast] = useState(false);
  const [days, setDays] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  const disabledDates = useMemo(() => {
    const dates = room.occupiedTimes.flatMap(([start, end]) =>
      eachDayOfInterval({ start: new Date(start), end: new Date(end) }),
    );
    return Array.from(new Set(dates)); // FIXME: can allow last end date
  }, [room]);

  useEffect(() => {
    if (date && date.from && date.to) {
      // const daysDiff = differenceInCalendarDays(date.to, date.from) + 1;
      const daysDiff = differenceInCalendarDays(date.to, date.from);
      setDays(daysDiff);
      if (daysDiff && room.roomPrice) {
        if (includeBreakfast && room.breakFastPrice) {
          setTotalPrice((room.roomPrice + room.breakFastPrice) * daysDiff);
        } else {
          setTotalPrice(room.roomPrice * daysDiff);
        }
      }
    } else {
      setDays(0);
      setTotalPrice(0);
    }
  }, [date, room.roomPrice, room.breakFastPrice, includeBreakfast]);

  async function handleBookingRoom() {
    if (!user) {
      // push /login
      return toast({ variant: 'destructive', description: t('toast.loginRequired') });
    }
    if (!user.isVerified) {
      // verify link
      return toast({ variant: 'destructive', description: t('toast.verifyRequired') });
    }

    if (date?.from && date?.to && days > 0) {
      const isTimeRangeOverlap = checkTimeRangeOverlap(
        date.from,
        date.to,
        room.occupiedTimes.map(([start, end]) => ({ startDate: new Date(start), endDate: new Date(end) })),
      );
      if (isTimeRangeOverlap) {
        return toast({
          variant: 'destructive',
          title: t('toast.dateOverlapTitle'),
          description: t('toast.dateOverlapDesc'),
        });
      }

      setIsBookingLoading(true);
      const bookingData: CreateBookingDto = {
        roomId: room.id,
        hotelId: hotel.id,
        startDate: format(date.from, 'yyyy-MM-dd'),
        endDate: format(date.to, 'yyyy-MM-dd'),
        breakFastIncluded: includeBreakfast,
        totalPrice,
      };

      const { isSuccess, data } = await BookingApi.create(bookingData);
      if (isSuccess) {
        toast({ variant: 'success', description: t('toast.bookingSuccess') });
        setBookingRoomData({
          breakfastIncluded: includeBreakfast,
          totalPrice,
          startDate: date.from,
          endDate: date.to,
          room,
          hotel,
          bookingId: data.id,
          timeRules: hotel.timeRules,
        });
        setPaymentIntentId(data.paymentId);
        router.push(routeConfig.BOOK_ROOM);
      } else {
        toast({ variant: 'destructive', description: t('toast.bookingFailure') });
      }
      setIsBookingLoading(false);
    } else {
      return toast({ variant: 'destructive', description: t('toast.dateRequired') });
    }
  }

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle>{room.title}</CardTitle>
        <CardDescription>{room.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {/* Cover */}
        <div className="relative aspect-square h-[200px] overflow-hidden rounded-lg">
          <Image fill priority src={room.imageUrl} alt="room" className="object-cover" /> {/* TODO: placeholder */}
        </div>

        {/* Amenities */}
        <RoomAmenities room={room} />

        <Separator />

        {/* Price */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p>
              {t('price.roomPrice')} <span className="text-xs">(VND/{t('price.hour')})</span>:{' '}
            </p>
            <span className="font-bold">{splitNumber(room.roomPrice)}</span>
          </div>
          {room.breakFastPrice > 0 && (
            <div className="flex items-center justify-between">
              <p>
                {t('price.breakFast')} <span className="text-xs">(VND)</span>:{' '}
              </p>
              <span className="font-bold">{splitNumber(room.breakFastPrice)}</span>
            </div>
          )}
        </div>

        <Separator />
      </CardContent>
      {canBook && (
        <CardFooter>
          <div className="flex flex-col gap-6">
            {/* Date Picker */}
            <div>
              <div>{t('footer.selectDateDesc')}</div>
              <CalendarDateRangePicker
                date={date}
                onDateChange={setDate}
                fromDate={new Date()}
                title={t('footer.selectDateTitle')}
                disabledDates={disabledDates}
              />
            </div>
            {/* Breakfast include? */}
            {room.breakFastPrice > 0 && (
              <div>
                <div className="mb-2">{t('footer.includeBreakfastDesc')}</div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="breakfast" onCheckedChange={(value) => setIncludeBreakfast(!!value)} />
                  <label htmlFor="breakfast" className="cursor-pointer text-sm">
                    {t('footer.includeBreakfastLabel')}
                  </label>
                </div>
              </div>
            )}
            {/* Summary */}
            <div>
              {t('footer.totalPrice')}: <span className="font-bold">{convertPriceToString(totalPrice)} VND</span>{' '}
              {t('footer.priceFor')}{' '}
              <span className="font-bold">
                {days} {t('footer.days')}
              </span>
            </div>

            {/* Booking Button with dialog */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button disabled={isBookingLoading} type="button">
                  {isBookingLoading ? (
                    <Loader2 className="mr-2 size-4 animate-spin" />
                  ) : (
                    <Wand2 className="mr-2 size-4" />
                  )}
                  {isBookingLoading ? t('footer.loading') : t('footer.book')}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t('footer.bookingDialogTitle')}</AlertDialogTitle>
                  <AlertDialogDescription>{t('footer.bookingDialogDesc')}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t('footer.bookingDialogCancel')}</AlertDialogCancel>
                  <AlertDialogAction onClick={handleBookingRoom}>{t('footer.bookingDialogAction')}</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
