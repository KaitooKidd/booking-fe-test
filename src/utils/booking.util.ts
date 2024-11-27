import { BookingStatus } from '~/apis/booking.api';

export function getNextBookingStatus(currentStatus: BookingStatus, includeCurrent = false): BookingStatus[] {
  const allStatus = [
    BookingStatus.BOOKED,
    BookingStatus.CHECKED_IN,
    BookingStatus.CHECKED_OUT,
    // BookingStatus.COMPLETED,
  ];

  const currentIndex = allStatus.indexOf(currentStatus);
  return allStatus.slice(currentIndex + (includeCurrent ? 0 : 1));
}
