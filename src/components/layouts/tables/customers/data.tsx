import { ShieldAlert, ShieldCheck } from 'lucide-react';
import { BiFemaleSign, BiMaleSign } from 'react-icons/bi';
import { FaGenderless } from 'react-icons/fa';
import { CustomerInfo, GenderTypes } from '~/apis/customer.api';

// type Icon = IconType | LucideIcon | React.ComponentType<{ className?: string }>
export const genderOptions: {
  value: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  className?: string;
}[] = [
  {
    value: GenderTypes.MALE,
    label: 'Male',
    icon: BiMaleSign,
  },
  {
    value: GenderTypes.FEMALE,
    label: 'Female',
    icon: BiFemaleSign,
  },
  {
    value: 'private',
    label: 'Private',
    icon: FaGenderless,
  },
];

export const isVerifiedOptions: {
  value: boolean;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  className?: string;
}[] = [
  {
    value: true,
    label: 'Verified',
    icon: ShieldCheck,
    className: 'text-green-500',
  },
  {
    value: false,
    label: 'Unverified',
    icon: ShieldAlert,
    className: 'text-yellow-500',
  },
];

export const customerInfo: CustomerInfo[] = [
  {
    id: 'izanagi.gameacc45@gmail.com',
    name: 'izanagi',
    avatar:
      'https://firebasestorage.googleapis.com/v0/b/booking-care-v1.appspot.com/o/customers%2Fizanagi.gameacc45-1708199462234-astronaut-WTFWARES.jpg?alt=media&token=0ac00678-49a2-4910-8c1b-d74954f91d7c',
    avatarKey: 'customers/izanagi.gameacc45-1708199462234-astronaut-WTFWARES.jpg',
    birthday: '2002-02-20',
    phone: '0987654321',
    gender: null,
    address: {
      id: 1,
      details: 'Nha X, ngach Y, ngo Z',
      ward: 'Xuan La',
      district: 'Tay Ho',
      province: 'Ha Noi',
      country: 'Viet Nam',
    },
    user: { id: 'izanagi.gameacc45@gmail.com', isVerified: true, roleName: 'customer' },
    createdAt: '2024-02-17T09:27:29.660Z',
  },
  {
    id: 'izanagi2.gameacc45@gmail.com',
    name: 'izanagi2',
    avatar:
      'https://firebasestorage.googleapis.com/v0/b/booking-care-v1.appspot.com/o/customers%2Fizanagi.gameacc45-1708199462234-astronaut-WTFWARES.jpg?alt=media&token=0ac00678-49a2-4910-8c1b-d74954f91d7c',
    avatarKey: null,
    birthday: null,
    phone: null,
    gender: 'male',
    address: {
      id: 1,
      details: 'Nha X, ngach Y, ngo Z',
      ward: null,
      district: null,
      province: 'Ha Noi',
      country: 'Viet Nam',
    },
    user: { id: 'izanagi2.gameacc45@gmail.com', isVerified: false, roleName: 'customer' },
    createdAt: '2024-02-17T09:27:29.660Z',
  },
  {
    id: 'izanagi3.gameacc45@gmail.com',
    name: 'izanagi3',
    avatar:
      'https://firebasestorage.googleapis.com/v0/b/booking-care-v1.appspot.com/o/customers%2Fizanagi.gameacc45-1708199462234-astronaut-WTFWARES.jpg?alt=media&token=0ac00678-49a2-4910-8c1b-d74954f91d7c',
    avatarKey: '',
    birthday: '2002-02-20',
    phone: '0987654321',
    gender: 'female',
    address: {
      id: 1,
      details: 'Nha X, ngach Y, ngo Z',
      ward: 'Xuan La',
      district: 'Tay Ho',
      province: 'Ha Noi',
      country: 'Viet Nam',
    },
    user: { id: 'izanagi3.gameacc45@gmail.com', isVerified: false, roleName: 'customer' },
    createdAt: '2024-02-17T09:27:29.660Z',
  } as any,
];
