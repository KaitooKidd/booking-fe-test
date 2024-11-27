import { HotelSchema } from './hotel.api';
import { axiosPrivateInstance } from './instances/axios.instance';

const endpoints = {
  list: '/favorites/customers',
  add: '/favorites/customers',
  delete: (hotelId: number) => `/favorites/customers/${hotelId}`,
};

type CreateFavoriteDto = {
  hotelIds: number[];
};

export const FavoriteApi = {
  async listFavorites() {
    return await axiosPrivateInstance.get<HotelSchema[]>(endpoints.list);
  },

  async addFavorites(data: CreateFavoriteDto) {
    return await axiosPrivateInstance.post(endpoints.add, data);
  },

  async removeFavorite(hotelId: number) {
    return await axiosPrivateInstance.delete(endpoints.delete(hotelId));
  },
};
