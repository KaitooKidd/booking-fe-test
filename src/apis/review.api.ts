import { axiosPrivateInstance } from './instances/axios.instance';

export const reviewEndpoints = {
  create: '/reviews',
  get: '/reviews',
  listByCustomer: '/reviews/customers',
  listByHotel: (id: number) => `/reviews/hotels/${id}`,
  listByRoom: (id: number) => `/reviews/rooms/${id}`,
  update: (id: string) => `/reviews/${id}`,
  delete: (id: string) => `/reviews/${id}`,
};

type CreateReviewDto = {
  bookingId: string;
  staffRating: number;
  facilityRating: number;
  cleanlinessRating: number;
  comfortRating: number;
  valueForMoneyRating: number;
  locationRating: number;
  comment: string;
};

export type ReviewSchema = {
  id: string;
  customerName: string;
  customerImage: string | undefined | null;
  customerEmail: string;
  hotelOwnerEmail: string;
  staffRating: number;
  facilityRating: number;
  cleanlinessRating: number;
  comfortRating: number;
  valueForMoneyRating: number;
  locationRating: number;
  comment: string;
  bookingId: string;
  roomId: number;
  hotelId: number;
  total: number;
  createdAt: string;
};

export const ReviewApi = {
  async create(dto: CreateReviewDto) {
    return await axiosPrivateInstance.post<ReviewSchema>(reviewEndpoints.create, dto);
  },
};
