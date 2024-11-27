import { compareAsc, differenceInCalendarDays, format } from 'date-fns';
import {
  AirVent,
  Bath,
  Bed,
  BedDouble,
  Castle,
  Home,
  MapPin,
  MountainSnow,
  Ship,
  Trees,
  Tv,
  Users,
  UtensilsCrossed,
  VolumeX,
  Wifi,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useState } from 'react';
import { BookingApi, BookingDetails, BookingStatus } from '~/apis/booking.api';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '~/components/ui/card';
import { Separator } from '~/components/ui/separator';
import { useToast } from '~/components/ui/use-toast';
import { routeConfig } from '~/configs/route.config';
import { useAuth } from '~/contexts/auth.context';
import useBookRoom from '~/hooks/useBookRoom';
import { useIRouter } from '~/locales/i18nNavigation';
import { convertPriceToString, splitNumber } from '~/utils/common.util';
import AmenityWrapper from '../amenities/AmenityWrapper';
import ChangeBookingStatus from './ChangeBookingStatus';
import ReviewModal from './ReviewModal';
import { UserRole } from '~/configs/role.config';

interface MyBookingCardProps {
  booking: BookingDetails;
  isCustomer?: boolean;
}

export default function MyBookingCard({ booking, isCustomer = false }: MyBookingCardProps) {
  const { setBookingRoomData, setPaymentIntentId } = useBookRoom();
  const { user } = useAuth();
  const [isBookingLoading, setIsBookingLoading] = useState(false);
  const [bookingStatus, setBookingStatus] = useState(booking.status);

  const { hotel, room, review } = booking;
  const dayCount = differenceInCalendarDays(new Date(booking.endDate), new Date(booking.startDate));

  const t = useTranslations();
  const { toast } = useToast();
  const router = useIRouter();

  async function handleBookingRoom() {
    if (!user) {
      // push /login
      return toast({ variant: 'destructive', description: t('RoomCard.toast.loginRequired') });
    }
    if (!user.isVerified) {
      // verify link
      return toast({ variant: 'destructive', description: t('RoomCard.toast.verifyRequired') });
    }

    setIsBookingLoading(true);
    setBookingRoomData({
      breakfastIncluded: booking.breakFastIncluded,
      totalPrice: booking.totalPrice,
      startDate: new Date(booking.startDate),
      endDate: new Date(booking.endDate),
      room,
      hotel,
      bookingId: booking.id,
      timeRules: booking.timeRules,
    });
    setPaymentIntentId(booking.paymentId);
    router.push(routeConfig.BOOK_ROOM);
    setIsBookingLoading(false);
  }

  async function handleChangeBookingStatus(status: BookingStatus) {
    const { isSuccess } = await BookingApi.updateBooking(booking.id, { status });
    if (isSuccess) {
      setBookingStatus(status);
      toast({ variant: 'success', description: t('MyBookings.card.toast.statusChanged', { status }) });
    } else {
      toast({ variant: 'destructive', description: t('MyBookings.card.toast.statusChangeFailed') });
    }
  }

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle>{hotel.name}</CardTitle>
        <div className="text-sm font-medium text-muted-foreground">
          <AmenityWrapper>
            <MapPin size={16} />
            {hotel.address.country}, {hotel.address.province}
            {hotel.address.district ? ', ' + hotel.address.district : ''}
            {hotel.address.ward ? ', ' + hotel.address.ward : ''}
            {hotel.address.details ? ', ' + hotel.address.details : ''}
          </AmenityWrapper>
        </div>

        <CardTitle className="!mt-4">{room.title}</CardTitle>
        <CardDescription>{room.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {/* Cover */}
        <div className="relative aspect-square h-[200px] overflow-hidden rounded-lg">
          <Image fill priority src={room.imageUrl} alt="room" className="object-cover" /> {/* TODO: placeholder */}
        </div>

        {/* Amenities */}
        <div className="grid grid-cols-2 content-start gap-4 text-sm">
          <AmenityWrapper>
            <Bed className="size-4" /> {room.bedCount} {t('RoomCard.amenities.bed')}
          </AmenityWrapper>
          <AmenityWrapper>
            <Users className="size-4" /> {room.guestCount} {t('RoomCard.amenities.guest')}
          </AmenityWrapper>
          <AmenityWrapper>
            <Bath className="size-4" /> {room.bathroomCount} {t('RoomCard.amenities.bathroom')}
          </AmenityWrapper>
          {room.kingBed > 0 && (
            <AmenityWrapper>
              <BedDouble className="size-4" />
              {room.kingBed} {t('RoomCard.amenities.kingBed')}
            </AmenityWrapper>
          )}
          {room.queenBed > 0 && (
            <AmenityWrapper>
              <Bed className="size-4" />
              {room.queenBed} {t('RoomCard.amenities.queenBed')}
            </AmenityWrapper>
          )}
          {room.roomService && (
            <AmenityWrapper>
              <UtensilsCrossed className="size-4" />
              {t('RoomCard.amenities.roomService')}
            </AmenityWrapper>
          )}
          {room.tv && (
            <AmenityWrapper>
              <Tv className="size-4" />
              {t('RoomCard.amenities.tv')}
            </AmenityWrapper>
          )}
          {room.balcony && (
            <AmenityWrapper>
              <Home className="size-4" />
              {t('RoomCard.amenities.balcony')}
            </AmenityWrapper>
          )}
          {room.freeWifi && (
            <AmenityWrapper>
              <Wifi className="size-4" />
              {t('RoomCard.amenities.freeWifi')}
            </AmenityWrapper>
          )}
          {room.cityView && (
            <AmenityWrapper>
              <Castle className="size-4" />
              {t('RoomCard.amenities.cityView')}
            </AmenityWrapper>
          )}
          {room.oceanView && (
            <AmenityWrapper>
              <Ship className="size-4" />
              {t('RoomCard.amenities.oceanView')}
            </AmenityWrapper>
          )}
          {room.forestView && (
            <AmenityWrapper>
              <Trees className="size-4" />
              {t('RoomCard.amenities.forestView')}
            </AmenityWrapper>
          )}
          {room.mountainView && (
            <AmenityWrapper>
              <MountainSnow className="size-4" />
              {t('RoomCard.amenities.mountainView')}
            </AmenityWrapper>
          )}
          {room.airCondition && (
            <AmenityWrapper>
              <AirVent className="size-4" />
              {t('RoomCard.amenities.airCondition')}
            </AmenityWrapper>
          )}
          {room.soundProofed && (
            <AmenityWrapper>
              <VolumeX className="size-4" />
              {t('RoomCard.amenities.soundProofed')}
            </AmenityWrapper>
          )}
        </div>

        <Separator />

        {/* Price */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p>
              {t('RoomCard.price.roomPrice')} <span className="text-xs">(VND/{t('RoomCard.price.hour')})</span>:{' '}
            </p>
            <span className="font-bold">{splitNumber(room.roomPrice)}</span>
          </div>
          {room.breakFastPrice > 0 && (
            <div className="flex items-center justify-between">
              <p>
                {t('RoomCard.price.breakFast')} <span className="text-xs">(VND)</span>:{' '}
              </p>
              <span className="font-bold">{splitNumber(room.breakFastPrice)}</span>
            </div>
          )}
        </div>

        <Separator />

        {/* Booking Details */}
        <div className="flex flex-col gap-2">
          <CardTitle className="text-lg">{t('RoomCard.bookingDetails.title')}</CardTitle>
          <div className="space-y-1.5 text-sm text-muted-foreground">
            <p>
              {t.rich('RoomCard.bookingDetails.desc', {
                customer: booking.customerName,
                dayCount: dayCount,
                date: format(new Date(booking.createdAt), 'dd/MM/yyyy'),
                bold: (text) => <span className="font-semibold">{text}</span>,
              })}
            </p>
            <p>
              {booking.timeRules.checkIn.start
                ? booking.timeRules.checkIn.end
                  ? t('RoomCard.bookingDetails.checkInBetween', {
                      date: format(new Date(booking.startDate), 'dd/MM/yyyy'),
                      start: booking.timeRules.checkIn.start,
                      end: booking.timeRules.checkIn.end,
                    })
                  : t('RoomCard.bookingDetails.checkInAfter', {
                      date: format(new Date(booking.startDate), 'dd/MM/yyyy'),
                      hour: booking.timeRules.checkIn.start,
                    })
                : t('RoomCard.bookingDetails.checkIn', { date: format(new Date(booking.startDate), 'dd/MM/yyyy') })}
            </p>
            <p>
              {booking.timeRules.checkOut.end
                ? booking.timeRules.checkOut.start
                  ? t('RoomCard.bookingDetails.checkOutBetween', {
                      date: format(new Date(booking.endDate), 'dd/MM/yyyy'),
                      start: booking.timeRules.checkOut.start,
                      end: booking.timeRules.checkOut.end,
                    })
                  : t('RoomCard.bookingDetails.checkOutBefore', {
                      date: format(new Date(booking.endDate), 'dd/MM/yyyy'),
                      end: booking.timeRules.checkOut.end,
                    })
                : t('RoomCard.bookingDetails.checkOut', { date: format(new Date(booking.endDate), 'dd/MM/yyyy') })}
            </p>

            {booking.breakFastIncluded && <p>{t('RoomCard.bookingDetails.breakfast')}</p>}
            {booking.isPaid ? (
              <p className="font-medium text-green-500">
                {t('RoomCard.bookingDetails.paid', { price: convertPriceToString(booking.totalPrice) })}
              </p>
            ) : (
              <p className="font-medium text-red-500">
                {t('RoomCard.bookingDetails.notPaid', { price: convertPriceToString(booking.totalPrice) })}
              </p>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="items-center justify-between">
        <Button
          disabled={isBookingLoading}
          variant="outline"
          onClick={() => router.push(routeConfig.HOTEL_DETAILS(hotel.id))}
        >
          {t('RoomCard.bookingDetails.viewHotel')}
        </Button>
        {!booking.isPaid &&
          booking.customerEmail === user?.email &&
          (compareAsc(new Date(booking.endDate), new Date()) > 0 ? (
            <Button onClick={handleBookingRoom}>{t('RoomCard.bookingDetails.payNow')}</Button>
          ) : (
            <Button variant={'outline'}>{t('RoomCard.bookingDetails.expired')}</Button> // TODO: Tooltip description
          ))}
        {bookingStatus === BookingStatus.CHECKED_OUT
          ? isCustomer && (
              <ReviewModal
                bookingId={booking.id}
                title={t('MyBookings.card.rate.title')}
                description={t.rich('MyBookings.card.rate.desc', {
                  hotelName: hotel.name,
                  bold: (text) => <b>{text}</b>,
                })}
                buttonLabel={t('MyBookings.card.button.rate')}
                onReviewSubmit={() => setBookingStatus(BookingStatus.REVIEWED)}
              />
            )
          : bookingStatus === BookingStatus.REVIEWED
            ? review && (
                <ReviewModal
                  title={t('MyBookings.card.seeRate.title')}
                  description={t('MyBookings.card.seeRate.desc')}
                  buttonLabel={t('MyBookings.card.button.seeReview')}
                  review={review}
                />
              )
            : booking.isPaid && (
                <ChangeBookingStatus
                  currentStatus={bookingStatus}
                  onStatusChange={handleChangeBookingStatus}
                  disabled={user?.role === UserRole.CUSTOMER}
                />
              )}
      </CardFooter>
    </Card>
  );
}
