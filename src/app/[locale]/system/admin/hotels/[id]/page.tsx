'use client';

import HotelForm from '~/components/layouts/hotels/HotelForm';
import useHotel from '~/hooks/useHotel';

interface EditHotelPageProps {
  params: {
    locale: string;
    id: string;
  };
}

// nextjs.org/docs/app/api-reference/functions/use-params
// nextjs.org/docs/app/building-your-application/routing/dynamic-routes
// use "fetch" instead of "axios" to get data from server

const EditHotelPage = ({ params }: EditHotelPageProps) => {
  const { isLoading, data, error, mutate } = useHotel(+params.id);
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Hotel not found</div>;
  return <HotelForm hotel={data} mutateHotel={mutate} />;
};

// const EditHotelPage = ({ params }: EditHotelPageProps) => {
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [data, setData] = useState<HotelSchema | null>(null);

//   useEffect(() => {
//     const fetchHotel = async () => {
//       setIsLoading(true);
//       const response = await HotelApi.getHotelById(+params.id);
//       if (response.isSuccess) {
//         setData(response.data);
//       } else {
//         setError(response.error);
//       }
//       setIsLoading(false);
//     };
//     fetchHotel();
//   }, [params.id]);

//   if (isLoading) return <div>Loading...</div>;
//   if (error || !data) return <div>Hotel not found</div>;

//   return <HotelForm hotel={data} />;
// };

export default EditHotelPage;
