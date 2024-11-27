'use client';

import { useAuth } from '~/contexts/auth.context';
import Header from '../header/Header';
import { useEffect, useState } from 'react';
import { cn } from '~/utils/ui.util';

export default function GlobalLoading() {
  const { isLoading: globalLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(true); // FIXME: or set AuthContext isLoading to true by default

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (globalLoading) setIsLoading(true);
    else {
      timeoutId = setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [globalLoading]);

  return (
    <main className={cn('z-0 flex min-h-screen flex-col', isLoading ? 'visible [&+*]:hidden' : 'hidden [&+*]:visible')}>
      <Header disableUserMenu />
      <section className="grid flex-grow grid-flow-col place-content-center gap-12">
        {/* <ImSpinner10 size={50} className="animate-spin" /> */}

        {/* <div className="size-48 animate-bounce rounded-full bg-primary"></div> */}

        {/* <div className="size-10 animate-bounce rounded-full bg-primary delay-300"></div>
        <div className="size-10 animate-bounce rounded-full bg-primary delay-500"></div>
        <div className="size-10 animate-bounce rounded-full bg-primary delay-700"></div> */}

        <div className="loader"></div>
      </section>
    </main>
  );
}
