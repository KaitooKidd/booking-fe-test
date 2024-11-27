import { z } from 'zod';

export const customerInfoSchema = z.object({
  id: z.string(),
  name: z.string(),
  avatar: z.string(),
  avatarKey: z.string().nullable().optional(),
  birthday: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  gender: z.string().nullable().optional(),
  createdAt: z.string(),
  user: z.object({
    id: z.string(),
    isVerified: z.boolean(),
    roleName: z.string(),
  }),
  address: z.object({
    id: z.number(),
    details: z.string(),
    ward: z.string().nullable().optional(),
    district: z.string().nullable().optional(),
    province: z.string(),
    country: z.string(),
  }),
});

type CustomerInfo = z.infer<typeof customerInfoSchema>;
