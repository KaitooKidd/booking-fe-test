'use client';

import GuestGuard from '~/components/guards/guest.guard';
import Header from '~/components/layouts/header/Header';

interface LayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: LayoutProps) {
  return (
    // <GuestGuard>
    <main className="z-0 flex min-h-screen flex-col">
      <Header disableUserMenu />
      <section className="flex-center flex-grow">{children}</section>
    </main>
    // </GuestGuard>
  );
}
