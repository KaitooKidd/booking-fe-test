import { HotelSchema } from '~/apis/hotel.api';

export function isFavoriteHotel(data: HotelSchema[], hotel: HotelSchema): boolean {
  return !!(data && data.find((item) => item.id === hotel.id));
}
