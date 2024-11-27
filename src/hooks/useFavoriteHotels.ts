import { create } from 'zustand';
import { HotelSchema } from '~/apis/hotel.api';

interface FavoriteHotels {
  data: HotelSchema[];
  setFavoriteHotels: (data: HotelSchema[]) => void;
  addFavoriteHotel: (hotel: HotelSchema) => void;
  removeFavoriteHotel: (hotel: HotelSchema) => void;
}

const useFavoriteHotels = create<FavoriteHotels>((set) => ({
  data: [],
  setFavoriteHotels: (data: HotelSchema[]) => set({ data }),
  addFavoriteHotel: (hotel: HotelSchema) => set((state) => ({ data: [...state.data, hotel] })),
  removeFavoriteHotel: (hotel: HotelSchema) => set((state) => ({ data: state.data.filter((h) => h.id !== hotel.id) })),
}));

export default useFavoriteHotels;
