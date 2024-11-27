import { Loader } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { BookingStatus } from '~/apis/booking.api';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '~/components/ui/alert-dialog';
import { Button } from '~/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { getNextBookingStatus } from '~/utils/booking.util';

interface ChangeBookingStatusProps {
  currentStatus: BookingStatus;
  onStatusChange?: (_status: BookingStatus) => void;
  disabled?: boolean;
}

export default function ChangeBookingStatus({
  currentStatus,
  onStatusChange,
  disabled = false,
}: ChangeBookingStatusProps) {
  const nextStatus = getNextBookingStatus(currentStatus);
  const [value, setValue] = useState<BookingStatus>(nextStatus[0]); // ensure at least 1 status
  const [open, setOpen] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [confirmingStatus, setConfirmingStatus] = useState<BookingStatus>(value);
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslations();

  const handleConfirm = () => {
    setOpenAlert(false);
    setOpen(false);
    setValue(confirmingStatus); // FIXME: need onStatusChange success to update value
    if (onStatusChange) {
      setIsLoading(true);
      onStatusChange(confirmingStatus);
      setIsLoading(false);
    }
  };

  return (
    <>
      <DropdownMenu open={open} onOpenChange={(open) => !disabled && setOpen(open)}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" disabled={isLoading}>
            {isLoading && <Loader className="mr-2 size-4 animate-spin" />}
            {t(`MyBookings.card.status.${currentStatus}`)}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-max">
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup
            value={value}
            // onValueChange={(val: any) => {
            //   setValue(val);
            //   if (onStatusChange) onStatusChange(val);
            // }}
          >
            {nextStatus.map((status, index) => (
              <DropdownMenuRadioItem
                key={index}
                value={status}
                className="cursor-pointer"
                onClick={(e) => {
                  // e.stopPropagation();
                  e.preventDefault();
                  setConfirmingStatus(status);
                  setOpenAlert(true);
                }}
              >
                {t(`MyBookings.card.status.${status}`)}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={openAlert}>
        {/* <AlertDialogTrigger asChild>
          <span />
        </AlertDialogTrigger> */}
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('MyBookings.card.confirm.title')}</AlertDialogTitle>
            <AlertDialogDescription>{t('MyBookings.card.confirm.desc')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOpenAlert(false)}>
              {t('MyBookings.card.confirm.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>{t('MyBookings.card.confirm.action')}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
