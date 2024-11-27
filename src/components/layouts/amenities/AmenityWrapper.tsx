import { cn } from '~/utils/ui.util';

interface AmenityItemProps {
  children: React.ReactNode;
  className?: string;
}

export default function AmenityWrapper({ children, className }: AmenityItemProps) {
  return <div className={cn('flex items-center gap-2', className)}>{children}</div>;
}
