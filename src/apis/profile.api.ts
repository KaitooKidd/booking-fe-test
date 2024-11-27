import { UserRole } from '~/configs/role.config';
import { GenderTypes } from './customer.api';
import { AddressSchema } from './hotel.api';
import { axiosPrivateInstance } from './instances/axios.instance';

export type ProfileSchema = {
  id: string;
  name: string;
  avatar?: string | null;
  avatarKey?: string | null;
  birthday?: string | null;
  phone?: string | null;
  gender?: GenderTypes | string | null;
  createdAt: string;
};

export type ProfileInfo = ProfileSchema & {
  isVerified: boolean;
  address: AddressSchema | null | undefined;
};

type UpdateProfileDto = Partial<ProfileSchema> & { email: string } & {
  address?: AddressSchema | Omit<AddressSchema, 'id'>;
};

export const ProfileApiEndpoints = {
  get: (role: string) => {
    switch (role) {
      case UserRole.CUSTOMER:
        return '/customers/me';
      case UserRole.HOTEL_MANAGER:
        return '/hotels/manager/me';
      case UserRole.RECEPTIONIST:
        return '/receptionists/me';
      default:
        return '/users/me'; // exception
    }
  },

  update: (role: string) => {
    switch (role) {
      case UserRole.CUSTOMER:
        return '/customers';
      case UserRole.HOTEL_MANAGER:
        return '/hotels/manager';
      case UserRole.RECEPTIONIST:
        return '/receptionists';
      default:
        return '/users'; // exception
    }
  },
};

export const ProfileApi = {
  async getProfile(role: string) {
    return axiosPrivateInstance.get<ProfileInfo>(ProfileApiEndpoints.get(role));
  },

  async updateProfile(role: string, data: UpdateProfileDto) {
    return axiosPrivateInstance.patch<ProfileInfo>(ProfileApiEndpoints.update(role), data);
  },
};
