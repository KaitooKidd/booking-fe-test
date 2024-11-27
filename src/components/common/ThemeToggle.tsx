'use client';

import { MoonIcon, SunIcon } from '@radix-ui/react-icons';
import { useTheme } from 'next-themes';

import { Button } from '~/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { themesConfig } from '~/configs/theme.config';

export function ThemeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all [.dark_&]:-rotate-90 [.dark_&]:scale-0" />
          <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all [.dark_&]:rotate-0 [.dark_&]:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme(themesConfig.LIGHT)}>Light</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme(themesConfig.DARK)}>Dark</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme(themesConfig.SYSTEM)}>System</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
