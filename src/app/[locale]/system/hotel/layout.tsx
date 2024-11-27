import RoleGuard from '~/components/guards/role.guard';
import { UserRole } from '~/configs/role.config';

interface HotelLayoutProps {
  children: React.ReactNode;
}

export default function HotelLayout({ children }: HotelLayoutProps) {
  return <RoleGuard allowedRoles={[UserRole.HOTEL_MANAGER, UserRole.RECEPTIONIST]}>{children}</RoleGuard>;
}
