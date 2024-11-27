import { useEffect, useState } from 'react';
import { HotelReceptionist, ReceptionistInfo } from '~/apis/hotel.api';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '~/components/ui/dialog';
import ReceptionistForm from './ReceptionistForm';

interface ReceptionistModalProps {
  data?: ReceptionistInfo;
  hotels: Omit<HotelReceptionist, 'receptionists'>[];
  onFilter?: (value: ReceptionistInfo) => void;
  children: React.ReactNode;
  isOpen?: boolean;
  setIsOpen?: (value: boolean) => void;
}

export default function ReceptionistModal({
  isOpen: isOpenProp,
  setIsOpen: setIsOpenProp,
  hotels,
  data,
  onFilter,
  children,
}: ReceptionistModalProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const isOpen = isOpenProp !== undefined ? isOpenProp : dialogOpen;
  const setIsOpen = setIsOpenProp !== undefined ? setIsOpenProp : setDialogOpen;

  useEffect(() => {
    setDialogOpen(isOpenProp !== undefined ? isOpenProp : false);
  }, [isOpenProp]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {/* <DialogTrigger asChild>{Trigger}</DialogTrigger> */}
      {children}
      <DialogContent className="max-[900px] w-full lg:min-w-[800px]">
        <DialogHeader className="px-2">
          <DialogTitle>{!data ? 'Create' : 'Edit'} Receptionist Account</DialogTitle>
          <DialogDescription>Provide your receptionist information</DialogDescription>
        </DialogHeader>
        <ReceptionistForm hotels={hotels} data={data} onFilter={onFilter} setClose={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
