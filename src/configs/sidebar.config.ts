import { Bed, Hotel, LucideIcon, PanelsTopLeft, Settings, Users, UsersRound } from 'lucide-react';
import { routeConfig } from './route.config';

interface NavProps {
  title: string;
  link: string;
  icon: LucideIcon;
  // variant: 'default' | 'ghost';
}

export const adminSidebarItems: NavProps[] = [
  {
    title: 'overview',
    link: routeConfig.A_OVERVIEW,
    icon: PanelsTopLeft,
  },
  {
    title: 'customers',
    link: routeConfig.A_MANAGE_CUSTOMERS,
    icon: Users,
  },
  {
    title: 'hotels',
    link: routeConfig.A_MANAGE_HOTELS,
    icon: Hotel,
  },
  {
    title: 'receptionists',
    link: routeConfig.A_MANAGE_RECEPTIONISTS,
    icon: UsersRound,
  },
  // {
  //   title: 'rooms',
  //   link: routeConfig.A_MANAGE_ROOMS,
  //   icon: Bed,
  // },
  {
    title: 'settings',
    link: routeConfig.SETTINGS,
    icon: Settings,
  },
];

export const hotelSidebarItems: NavProps[] = [
  {
    title: 'overview',
    link: routeConfig.H_OVERVIEW,
    icon: PanelsTopLeft,
  },
  {
    title: 'my_hotel',
    link: routeConfig.MY_HOTEL,
    icon: Hotel,
  },
  {
    title: 'receptionists',
    link: routeConfig.H_MANAGE_RECEPTIONISTS,
    icon: UsersRound,
  },
  // {
  //   title: 'rooms',
  //   link: routeConfig.H_MANAGE_ROOMS,
  //   icon: Bed,
  // },
  // {
  //   title: 'bookings',
  //   link: routeConfig.MY_BOOKINGS,
  //   icon: TicketCheck,
  // },
  {
    title: 'settings',
    link: routeConfig.SETTINGS,
    icon: Settings,
  },
];

export const receptionistsSidebarItems: NavProps[] = [
  {
    title: 'overview',
    link: routeConfig.H_OVERVIEW,
    icon: PanelsTopLeft,
  },
  {
    title: 'my_hotel',
    link: routeConfig.MY_HOTEL,
    icon: Hotel,
  },
  // {
  //   title: 'receptionists',
  //   link: routeConfig.H_MANAGE_RECEPTIONISTS,
  //   icon: UsersRound,
  // },
  // {
  //   title: 'rooms',
  //   link: routeConfig.H_MANAGE_ROOMS,
  //   icon: Bed,
  // },
  // {
  //   title: 'bookings',
  //   link: routeConfig.MY_BOOKINGS,
  //   icon: TicketCheck,
  // },
  {
    title: 'settings',
    link: routeConfig.SETTINGS,
    icon: Settings,
  },
];
