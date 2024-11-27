import { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from '~/components/layouts/tables/DataTableColumnHeader';
// import { TaskDataTableRowActions } from '~/components/layouts/tables/tasks/actions';
import { format } from 'date-fns';
import { CustomerInfo } from '~/apis/customer.api';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { cn } from '~/utils/ui.util';
import { genderOptions, isVerifiedOptions } from './data';
import { Checkbox } from '~/components/ui/checkbox';

export const customerColumns: ColumnDef<CustomerInfo>[] = [
  // Checkbox
  // {
  //   id: 'select',
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //       className="translate-y-[2px]"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //       className="translate-y-[2px]"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  // Data
  {
    id: 'customer', // id default is accessorKey -> row.getValue(id) // not accessorKey
    accessorKey: 'name', // key in object type
    header: ({ column }) => <DataTableColumnHeader column={column} title="Customer" />,
    cell: ({ row }) => {
      return (
        <div className="flex items-center space-x-2">
          <Avatar className="size-8 rounded-full">
            <AvatarImage src={row.original.avatar ?? undefined} alt="avatar" />
            <AvatarFallback>{row.original.name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-2">
            <span className="font-medium capitalize">{row.original.name}</span>
            <span className="max-w-[500px] truncate font-medium text-muted-foreground">{row.original.id}</span>
          </div>
        </div>
      );
    },
    // filterFn: (row, id, value) => {
    //   return value.includes(row.getValue(id));
    // }, // remove if has accessorKey & id?
  },
  {
    id: 'verified',
    accessorKey: 'isVerified',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Verified" />,
    cell: ({ row }) => {
      const verified = isVerifiedOptions.find((item) => item.value === row.getValue('verified'))!;
      return (
        <div className="flex w-[100px] items-center">
          <verified.icon className={cn(verified.className, 'mr-2 size-4')} />
          <span className="capitalize">{verified.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'gender',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      let gender = genderOptions.find((item) => item.value === row.original.gender);
      if (!gender) {
        gender = genderOptions[2]; // default
      }

      return (
        <div className="flex w-[100px] items-center">
          <gender.icon className={cn(gender.className, 'mr-2 size-4 text-muted-foreground')} />
          <span className="capitalize">{gender.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'birthday',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Birthday" />,
    cell: ({ row }) => {
      return <div className="flex items-center text-sm font-medium">{row.original.birthday ?? 'Private'}</div>;
    },
    enableSorting: false,
  },
  {
    id: 'address',
    accessorFn: (row) => {
      if (!row.address) return '';
      let address = row.address.country ?? '';
      if (row.address.province) {
        address = `${row.address.province}, ${row.address.country}`;
      }
      return address;
    },
    header: ({ column }) => <DataTableColumnHeader column={column} title="Address" />,
    cell: ({ row }) => {
      return <div className="flex items-center font-medium">{row.getValue('address')}</div>;
    },
    enableSorting: false,
  },
  {
    id: 'joined',
    accessorKey: 'createdAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Joined" />,
    cell: ({ row }) => {
      return (
        <div className="flex items-center text-sm font-medium">{format(row.original.createdAt, 'dd MMM yyyy')}</div>
      );
    },
    enableSorting: false,
  },
  // Actions
  // {
  //   id: 'actions',
  //   cell: ({ row }) => <TaskDataTableRowActions row={row} />,
  // },
];
