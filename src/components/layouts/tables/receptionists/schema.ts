import { z } from 'zod';

export const receptionistSchema = z.object({
  id: z.string(),
  name: z.string(),
  avatar: z.string(),
  avatarKey: z.string().nullable().optional(),
  birthday: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  gender: z.string().nullable().optional(),
  createdAt: z.string(),
  hotelId: z.number(),
});

// type HotelReceptionist = z.infer<typeof receptionistSchema>;
