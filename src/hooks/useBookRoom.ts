import { create } from 'zustand';
import { HotelSchema, RoomSchema, TimeRules } from '~/apis/hotel.api';
import { persist } from 'zustand/middleware';

interface BookingRoomData {
  bookingRoomData: RoomDataType | null;
  paymentIntentId: string | null;
  // clientSecret: string | undefined;
  setBookingRoomData: (_data: RoomDataType) => void;
  setPaymentIntentId: (_paymentIntent: string) => void;
  // setClientSecret: (clientSecret: string) => void;
  resetBookingRoom: () => void;
}

type RoomDataType = {
  hotel: HotelSchema;
  room: RoomSchema;
  totalPrice: number;
  breakfastIncluded: boolean;
  startDate: Date;
  endDate: Date;
  bookingId: string;
  timeRules: TimeRules;
};

const useBookRoom = create<BookingRoomData>()(
  persist(
    (set) => ({
      bookingRoomData: null,
      paymentIntentId: null,
      // clientSecret: undefined,
      setBookingRoomData: (data: RoomDataType) => set({ bookingRoomData: data }),
      // setClientSecret: (clientSecret: string) => set({ clientSecret }),
      setPaymentIntentId: (paymentIntentId: string) => set({ paymentIntentId }),
      resetBookingRoom: () => set({ bookingRoomData: null, paymentIntentId: null /* clientSecret: undefined */ }),
    }),
    { name: 'BookRoom' },
  ),
);

export default useBookRoom;
