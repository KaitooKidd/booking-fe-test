'use client';

import { useTranslations } from 'next-intl';
import LocaleSwitcher from '~/components/common/LocaleSwitcher';
import NavLink from '~/components/common/NavLink';
import { ThemeToggle } from '~/components/common/ThemeToggle';
import { Button } from '~/components/ui/button';
import { routeConfig } from '~/configs/route.config';
import { useAuth } from '~/contexts/auth.context';
import HotelPage from './hotels/page';

export default function Home() {
  return <HotelPage />;
  // const t = useTranslations('Index');
  // const { isAuthenticated, signOut } = useAuth();

  // return (
  //   <div className="flex min-h-screen flex-col items-center justify-between p-24">
  //     <div className="flex items-center justify-between gap-4">
  //       <ul className="flex items-center gap-10">
  //         <NavLink href={routeConfig.HOME}>Home</NavLink>
  //         <NavLink href={routeConfig.ABOUT}>About</NavLink>
  //         {isAuthenticated ? (
  //           <Button onClick={signOut}>Logout</Button>
  //         ) : (
  //           <NavLink href={routeConfig.SIGN_IN}>Sign In</NavLink>
  //         )}
  //       </ul>

  //       <span className="h-4 w-1 bg-foreground/40" />

  //       <div className="item-center flex justify-center space-x-4">
  //         <ThemeToggle />
  //         <LocaleSwitcher />
  //       </div>
  //     </div>
  //     <h1>{t('title')}</h1>
  //   </div>
  // );
}
