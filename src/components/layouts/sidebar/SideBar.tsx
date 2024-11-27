'use client';

import { useState } from 'react';
import { BsArrowLeftShort } from 'react-icons/bs';
import { cn } from '~/utils/ui.util';
import { SideBarNav } from './SideBarNav';
import { useAuth } from '~/contexts/auth.context';
import { UserRole } from '~/configs/role.config';

interface SideBarProps {
  className?: string;
}

export default function SideBar({ className }: SideBarProps) {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div
      className={cn(
        'relative h-full border-r pt-8 transition-all ease-linear md:block',
        isOpen ? 'w-48 duration-300' : 'w-[72px] duration-200',
        className,
      )}
    >
      <BsArrowLeftShort
        className={cn(
          'absolute -right-3 top-2 cursor-pointer rounded-full border bg-background text-3xl text-foreground',
          !isOpen && 'rotate-180',
        )}
        onClick={handleToggle}
      />

      <SideBarNav isOpen={isOpen} role={user?.role} />
    </div>
  );
}
