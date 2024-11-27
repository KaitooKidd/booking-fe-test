import { CalendarIcon } from '@radix-ui/react-icons';
import { useTranslations } from 'next-intl';
import { HotelSchema, RoomSchema } from '~/apis/hotel.api';
import { Button } from '~/components/ui/button';

interface RecommendMergeRoomsProps {
  hotel: HotelSchema;
  rooms: { room: RoomSchema; time: { start: string; end: string } }[];
}

export default function RecommendMergeRooms({ hotel, rooms }: RecommendMergeRoomsProps) {
  const t = useTranslations();

  if (rooms.length === 0) {
    return <div className="mt-5 text-center font-medium">{t('HotelDetails.recommendation.timeRequired')}</div>;
  }

  return (
    <div className="mt-5 grid grid-cols-1 gap-4">
      {rooms.map((room, index) => (
        <div key={index} className="rounded-lg border border-gray-200 p-4">
          <h4 className="text-lg font-semibold">{room.room.title}</h4>
          <div className="justify-start text-left font-normal">
            <CalendarIcon className="mr-2 inline-block h-4 w-4" />
            {room.time.start} - {room.time.end}
          </div>
        </div>
      ))}
      <div className="text-right">
        <Button>{t('RoomCard.footer.bookingDialogAction')}</Button>
      </div>
    </div>
  );
}
