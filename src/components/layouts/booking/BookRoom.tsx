'use client';

import { format } from 'date-fns';
import { useState } from 'react';
import useBookRoom from '~/hooks/useBookRoom';
import { splitNumber } from '~/utils/common.util';
import RoomCard from '../rooms/RoomCard';
import PaymentChannel from './PaymentChannel';
import { Button } from '~/components/ui/button';
import { useToast } from '~/components/ui/use-toast';
import { BookingApi } from '~/apis/booking.api';
import { useTranslations } from 'next-intl';

interface BookRoomProps {}

export default function BookRoom({}: BookRoomProps) {
  const { bookingRoomData } = useBookRoom();
  const [channel, setChannel] = useState('vn_pay');
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslations();
  const { toast } = useToast();

  async function handlePayment() {
    if (bookingRoomData) {
      setIsLoading(true);
      if (channel === 'vn_pay') {
        const { isSuccess, data } = await BookingApi.createVnpayPaymentUrl(bookingRoomData.bookingId);
        if (isSuccess) {
          toast({
            description: t('BookRoom.toast.redirecting'),
            variant: 'success',
          });
          // window.open(data.data, '_blank');
          window.open(data.data, '_self');
          // window.location.href = data.data;
        } else {
          toast({
            description: t('BookRoom.toast.redirectFailed'),
            variant: 'destructive',
          });
        }
      } else {
        toast({
          // title: 'Payment Method',
          description: t('BookRoom.toast.methodNotSupported'),
          variant: 'destructive',
        });
        setIsLoading(false);
      }
    } else {
      toast({
        // title: 'Booking Error',
        description: t('BookRoom.toast.noBooking'),
        variant: 'destructive',
      });
    }
  }

  return (
    <div className="mx-auto max-w-[700px] p-8">
      {bookingRoomData ? (
        <>
          <h3 className="mb-6 text-2xl font-semibold">{t('BookRoom.title')}</h3>
          <div className="mb-6">
            <RoomCard room={bookingRoomData.room} hotel={bookingRoomData.hotel} />
          </div>

          <PaymentChannel channel={channel} setChannel={setChannel} />

          <div className="mt-8 flex flex-col gap-4">
            <div className="space-y-1">
              <h3 className="mb-1 text-xl font-semibold">{t('BookRoom.summary.heading')}</h3>
              <p>
                {bookingRoomData.timeRules.checkIn.start
                  ? bookingRoomData.timeRules.checkIn.end
                    ? t('RoomCard.bookingDetails.checkInBetween', {
                        date: format(new Date(bookingRoomData.startDate), 'dd/MM/yyyy'),
                        start: bookingRoomData.timeRules.checkIn.start,
                        end: bookingRoomData.timeRules.checkIn.end,
                      })
                    : t('RoomCard.bookingDetails.checkInAfter', {
                        date: format(new Date(bookingRoomData.startDate), 'dd/MM/yyyy'),
                        hour: bookingRoomData.timeRules.checkIn.start,
                      })
                  : t('RoomCard.bookingDetails.checkIn', {
                      date: format(new Date(bookingRoomData.startDate), 'dd/MM/yyyy'),
                    })}
              </p>
              <p>
                {bookingRoomData.timeRules.checkOut.end
                  ? bookingRoomData.timeRules.checkOut.start
                    ? t('RoomCard.bookingDetails.checkOutBetween', {
                        date: format(new Date(bookingRoomData.endDate), 'dd/MM/yyyy'),
                        start: bookingRoomData.timeRules.checkOut.start,
                        end: bookingRoomData.timeRules.checkOut.end,
                      })
                    : t('RoomCard.bookingDetails.checkOutBefore', {
                        date: format(new Date(bookingRoomData.endDate), 'dd/MM/yyyy'),
                        end: bookingRoomData.timeRules.checkOut.end,
                      })
                  : t('RoomCard.bookingDetails.checkOut', {
                      date: format(new Date(bookingRoomData.endDate), 'dd/MM/yyyy'),
                    })}
              </p>
              {bookingRoomData.breakfastIncluded && <div>{t('BookRoom.summary.breakfast', { hour: '8AM' })}</div>}
            </div>
            <div className="text-lg font-bold">
              {t('BookRoom.summary.total')}: {splitNumber(bookingRoomData.totalPrice)} VND
            </div>
          </div>

          <Button onClick={handlePayment} disabled={isLoading} className="mt-4">
            {isLoading ? t('BookRoom.summary.processPayment') : t('BookRoom.summary.payNow')}
          </Button>
        </>
      ) : (
        <div>{t('BookRoom.toast.noBooking')}</div>
      )}
    </div>
  );
}
