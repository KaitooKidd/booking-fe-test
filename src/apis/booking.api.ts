import { getCookie } from 'cookies-next';
import { LocaleConfig } from '~/configs/locale.config';
import { HotelSchema, RoomSchema, TimeRules } from './hotel.api';
import { axiosPrivateInstance } from './instances/axios.instance';
import { ReviewSchema } from './review.api';

export const bookingEndpoints = {
  create: '/bookings',
  myBookings: '/bookings',
  createVnpayPaymentURL: '/bookings/payment/vnpay',
  updateBooking: (id: string) => `/bookings/${id}`,
};

export enum BookingStatus {
  PENDING = 'pending',
  BOOKED = 'booked',
  CHECKED_IN = 'checked_in',
  CHECKED_OUT = 'checked_out',
  // COMPLETED = 'completed',
  REVIEWED = 'reviewed',
}

export type CreateBookingDto = {
  roomId: number;
  hotelId: number;
  startDate: string;
  endDate: string;
  breakFastIncluded: boolean;
  totalPrice: number;
  currency?: 'VND';
  paymentChannel?: 'vn_pay';
};

export type UpdateBookingDto = {
  status?: BookingStatus;
};

export type BookingSchema = {
  id: string;
  customerName: string;
  customerEmail: string;
  hotelOwnerEmail: string;
  startDate: string;
  endDate: string;
  timeRules: TimeRules;
  breakFastIncluded: boolean;
  currency: 'VND';
  totalPrice: number;
  isPaid: boolean;
  paymentChannel: 'vn_pay';
  paymentId: string; // Payment gateway's payment id
  paymentInfo: any;
  status: BookingStatus;
  createdAt: string;
  roomId: number;
  hotelId: number;
};

export type BookingDetails = BookingSchema & {
  room: RoomSchema;
  hotel: HotelSchema;
  review?: ReviewSchema;
};

export const BookingApi = {
  async create(dto: CreateBookingDto) {
    return await axiosPrivateInstance.post<BookingSchema>(bookingEndpoints.create, dto);
  },

  async createVnpayPaymentUrl(bookingId: string) {
    return await axiosPrivateInstance.post<{ status: 'success' | 'failure' | 'error'; data: string }>(
      bookingEndpoints.createVnpayPaymentURL,
      {
        bookingId,
        locale: getCookie('NEXT_LOCALE') ?? LocaleConfig.defaultLocale,
        // bankCode: 'VNBANK',
      },
    );
  },

  async listMyBookings() {
    return await axiosPrivateInstance.get<BookingSchema[]>(bookingEndpoints.myBookings);
  },

  async updateBooking(bookingId: string, dto: UpdateBookingDto) {
    return await axiosPrivateInstance.patch<{ status: string; message: string }>(
      bookingEndpoints.updateBooking(bookingId),
      dto,
    );
  },
};
