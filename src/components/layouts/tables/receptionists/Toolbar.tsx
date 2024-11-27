import { Table } from '@tanstack/react-table';
import { Input } from '~/components/ui/input';
import { DataTableViewOptions } from '../DataTableViewOptions';
import { DataTableFacetedFilter } from '../DataTableFacetedFilter';
import { Button } from '~/components/ui/button';
import { Cross2Icon } from '@radix-ui/react-icons';
import { genderOptions, isVerifiedOptions } from '../customers/data';
import { HotelReceptionist } from '~/apis/hotel.api';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  hotels: Omit<HotelReceptionist, 'receptionists'>[];
}

export function ReceptionistDataTableToolbar<TData>({ table, hotels }: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter receptionist..."
          value={(table.getColumn('receptionist')?.getFilterValue() as string) ?? ''}
          onChange={(event) => table.getColumn('receptionist')?.setFilterValue(event.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        <DataTableFacetedFilter
          column={table.getColumn('hotel')}
          title="Hotel"
          options={hotels.map((item) => ({
            label: item.name,
            value: item.id,
          }))}
        />
        {table.getColumn('verified') && (
          <DataTableFacetedFilter
            column={table.getColumn('verified')}
            title="Verified"
            options={isVerifiedOptions as any}
          />
        )}
        {table.getColumn('gender') && (
          <DataTableFacetedFilter column={table.getColumn('gender')} title="Gender" options={genderOptions} />
        )}
        {isFiltered && (
          <Button variant="ghost" onClick={() => table.resetColumnFilters()} className="h-8 px-2 lg:px-3">
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
