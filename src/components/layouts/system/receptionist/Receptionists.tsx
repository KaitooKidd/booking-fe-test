import { DialogTrigger } from '@radix-ui/react-dialog';
import { UserPlus } from 'lucide-react';
import { ReceptionistInfo } from '~/apis/hotel.api';
import ReceptionistModal from '~/components/layouts/system/receptionist/ReceptionistModal';
import { HotelReceptionistDataTable } from '~/components/layouts/tables/receptionists/DataTable';
import { getHotelReceptionistColumns } from '~/components/layouts/tables/receptionists/columns';
import { Button } from '~/components/ui/button';
import useHotelReceptionists from '~/hooks/useHotelReceptionist';

interface ReceptionistsProps {}

export default function Receptionists({}: ReceptionistsProps) {
  const { isLoading, error, data, mutate } = useHotelReceptionists();
  if (isLoading) return <div>Loading...</div>;
  if (error || !data) return <div>Error!</div>;

  const filterDeleteReceptionist = (email: string) => {
    const filteredReceptionist = data.receptionists.filter((receptionist) => receptionist.id !== email);
    mutate({ ...data, receptionists: filteredReceptionist }, false);
  };

  const filterCreatedReceptionist = (receptionist: ReceptionistInfo) => {
    const newReceptionists = [receptionist, ...data.receptionists];
    mutate({ ...data, receptionists: newReceptionists }, false);
  };

  const filterUpdateReceptionist = (receptionist: ReceptionistInfo) => {
    const updatedReceptionists = data.receptionists.map((item) => (item.id === receptionist.id ? receptionist : item));
    mutate({ ...data, receptionists: updatedReceptionists }, false);
  };

  return (
    <div className="">
      <ReceptionistModal hotels={data.hotels} onFilter={filterCreatedReceptionist}>
        <DialogTrigger asChild>
          <Button className="mb-4" variant={'outline'}>
            <UserPlus className="mr-2 size-4" />
            Create Receptionist
          </Button>
        </DialogTrigger>
      </ReceptionistModal>
      <HotelReceptionistDataTable
        data={data.receptionists}
        columns={getHotelReceptionistColumns(data.hotels, filterUpdateReceptionist, filterDeleteReceptionist)}
        hotels={data.hotels}
      />
    </div>
  );
}
