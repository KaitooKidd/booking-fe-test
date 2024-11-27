'use client';

import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Row } from '@tanstack/react-table';
import { useState } from 'react';
import { HotelApi, HotelReceptionist, ReceptionistInfo } from '~/apis/hotel.api';
import { Button } from '~/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { toast } from '~/components/ui/use-toast';
import ReceptionistModal from '../../system/receptionist/ReceptionistModal';

interface DataTableRowActionsProps<TData> {
  hotels: Omit<HotelReceptionist, 'receptionists'>[];
  row: Row<TData>;
  onUpdate: (receptionist: ReceptionistInfo) => void;
  onDelete: (email: string) => void;
}

export function ReceptionistDataTableRowActions<TData>({
  row,
  onDelete,
  onUpdate,
  hotels,
}: DataTableRowActionsProps<TData>) {
  const [isOpen, setIsOpen] = useState(false);
  const receptionist = row.original as ReceptionistInfo;

  async function deleteReceptionist(email: string) {
    const response = await HotelApi.deleteReceptionist(email);
    if (response.isSuccess) {
      toast({ title: 'Receptionist deleted!', variant: 'success' });
      onDelete(email);
    } else {
      toast({ title: 'Failed to delete receptionist!', variant: 'destructive' });
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
            <DotsHorizontalIcon className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem onClick={() => setIsOpen(true)}>
            Edit
            <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => deleteReceptionist(receptionist.id)}>
            Delete
            <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ReceptionistModal isOpen={isOpen} setIsOpen={setIsOpen} hotels={hotels} data={receptionist} onFilter={onUpdate}>
        <></>
      </ReceptionistModal>
    </>
  );
}
