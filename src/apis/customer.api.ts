import { UserRole } from '~/configs/role.config';
import { AddressSchema } from './hotel.api';
import { axiosPrivateInstance } from './instances/axios.instance';

export const CustomerApiEndpoints = {
  list: '/customers',
};

export enum GenderTypes {
  MALE = 'male',
  FEMALE = 'female',
}

export type UserSchema = {
  id: string;
  isVerified: boolean;
  roleName: UserRole;
};

export type CustomerSchema = {
  id: string;
  name: string;
  avatar?: string | null;
  avatarKey?: string | null;
  birthday?: string | null;
  phone?: string | null;
  gender?: GenderTypes | string | null;
  createdAt: string;
};

export type CustomerInfo = CustomerSchema & {
  address: AddressSchema;
  isVerified: boolean;
};

export const CustomerApi = {
  list() {
    return axiosPrivateInstance.get<CustomerInfo[]>(CustomerApiEndpoints.list);
  },
};
