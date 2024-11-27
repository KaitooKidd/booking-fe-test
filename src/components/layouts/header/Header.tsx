import { useTranslations } from 'next-intl';
import NavLink from '~/components/common/NavLink';
import { routeConfig } from '~/configs/route.config';
import { cn } from '~/utils/ui.util';
import Container from '../../common/Container';
import LocaleSwitcher from '../../common/LocaleSwitcher';
import { ThemeToggle } from '../../common/ThemeToggle';
import Logo from './Logo';
import { UserMenu } from './UserMenu';

interface HeaderProps {
  disableUserMenu?: boolean;
  className?: string;
}

const Header = ({ disableUserMenu = false, className = '' }: HeaderProps) => {
  const t = useTranslations('Header');

  return (
    <header className={cn('sticky top-0 z-10 max-h-header border border-b-primary/10 bg-background', className)}>
      <Container className="flex items-center">
        <Logo />

        <div className="ml-auto flex items-center gap-4">
          <nav className="flex items-center gap-5 text-sm font-semibold">
            {/* <NavLink href={routeConfig.HOME}>{t('home')}</NavLink> */}
            <NavLink href={routeConfig.HOTELS}>{t('discovery')}</NavLink>
            <NavLink href={routeConfig.CONTACT}>{t('contact')}</NavLink>
          </nav>

          <ThemeToggle />
          <LocaleSwitcher />
          {!disableUserMenu && <UserMenu />}
        </div>
      </Container>
    </header>
  );
};

export default Header;
