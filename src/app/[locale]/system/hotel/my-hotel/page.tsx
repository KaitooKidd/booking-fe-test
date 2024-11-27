'use client';

import HotelForm from '~/components/layouts/hotels/HotelForm';
import { UserRole } from '~/configs/role.config';
import { useAuth } from '~/contexts/auth.context';
import useMyHotel from '~/hooks/useMyHotel';

interface MyHotelPageProps {}

const MyHotelPage = ({}: MyHotelPageProps) => {
  const { isLoading, data, error, mutate } = useMyHotel();
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) return <div>Not Authenticated</div>;
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Hotel not found</div>;

  return (
    <HotelForm
      hotel={data}
      mutateHotel={mutate}
      viewOnly={![UserRole.ADMIN, UserRole.HOTEL_MANAGER].includes(user.role)}
    />
  );
};

export default MyHotelPage;
