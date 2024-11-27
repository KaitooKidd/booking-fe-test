'use client';

import { useSelectedLayoutSegment } from 'next/navigation';
import { ComponentProps } from 'react';
import { ILink } from '~/locales/i18nNavigation';
import { cn } from '~/utils/ui.util';

interface NavLinkProps extends ComponentProps<typeof ILink> {
  activeClassName?: (isActive: boolean) => string;
}

export default function NavLink({
  href,
  className = '',
  activeClassName = (isActive) => (isActive ? 'text-red-500' : ''),
  ...rest
}: NavLinkProps) {
  const selectedLayoutSegment = useSelectedLayoutSegment();
  const pathname = selectedLayoutSegment ? `/${selectedLayoutSegment}` : '/';
  // const pathname = usePathname(); -> pathname.includes(href)
  const isActive = pathname === href;

  return <ILink href={href} className={cn('font-medium', className, activeClassName(isActive))} {...rest} />;
}
