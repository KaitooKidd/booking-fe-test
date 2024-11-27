import Container from '~/components/common/Container';
import RoleGuard from '~/components/guards/role.guard';
import SideBar from '~/components/layouts/sidebar/SideBar';
import { ScrollArea, ScrollBar } from '~/components/ui/scroll-area';
import { UserRole } from '~/configs/role.config';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  // return <RoleGuard allowedRoles={[UserRole.ADMIN]}>{children}</RoleGuard>;
  return <RoleGuard allowedRoles={[UserRole.ADMIN]}>{children}</RoleGuard>;
}
