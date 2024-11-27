import {
  AirVent,
  Bath,
  Bed,
  BedDouble,
  Castle,
  Home,
  MountainSnow,
  Ship,
  Trees,
  Tv,
  Users,
  UtensilsCrossed,
  VolumeX,
  Wifi,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { HTMLAttributes } from 'react';
import { RoomSchema } from '~/apis/hotel.api';
import { cn } from '~/utils/ui.util';
import AmenityWrapper from './AmenityWrapper';

interface RoomAmenitiesProps extends HTMLAttributes<HTMLDivElement> {
  room: RoomSchema;
}

export default function RoomAmenities({ className, room, ...props }: RoomAmenitiesProps) {
  const t = useTranslations('RoomCard');

  return (
    <div className={cn('grid grid-cols-2 content-start gap-4 text-sm', className)} {...props}>
      <AmenityWrapper>
        <Bed className="size-4" /> {room.bedCount} {t('amenities.bed')}
      </AmenityWrapper>
      <AmenityWrapper>
        <Users className="size-4" /> {room.guestCount} {t('amenities.guest')}
      </AmenityWrapper>
      <AmenityWrapper>
        <Bath className="size-4" /> {room.bathroomCount} {t('amenities.bathroom')}
      </AmenityWrapper>
      {room.kingBed > 0 && (
        <AmenityWrapper>
          <BedDouble className="size-4" />
          {room.kingBed} {t('amenities.kingBed')}
        </AmenityWrapper>
      )}
      {room.queenBed > 0 && (
        <AmenityWrapper>
          <Bed className="size-4" />
          {room.queenBed} {t('amenities.queenBed')}
        </AmenityWrapper>
      )}
      {room.roomService && (
        <AmenityWrapper>
          <UtensilsCrossed className="size-4" />
          {t('amenities.roomService')}
        </AmenityWrapper>
      )}
      {room.tv && (
        <AmenityWrapper>
          <Tv className="size-4" />
          {t('amenities.tv')}
        </AmenityWrapper>
      )}
      {room.balcony && (
        <AmenityWrapper>
          <Home className="size-4" />
          {t('amenities.balcony')}
        </AmenityWrapper>
      )}
      {room.freeWifi && (
        <AmenityWrapper>
          <Wifi className="size-4" />
          {t('amenities.freeWifi')}
        </AmenityWrapper>
      )}
      {room.cityView && (
        <AmenityWrapper>
          <Castle className="size-4" />
          {t('amenities.cityView')}
        </AmenityWrapper>
      )}
      {room.oceanView && (
        <AmenityWrapper>
          <Ship className="size-4" />
          {t('amenities.oceanView')}
        </AmenityWrapper>
      )}
      {room.forestView && (
        <AmenityWrapper>
          <Trees className="size-4" />
          {t('amenities.forestView')}
        </AmenityWrapper>
      )}
      {room.mountainView && (
        <AmenityWrapper>
          <MountainSnow className="size-4" />
          {t('amenities.mountainView')}
        </AmenityWrapper>
      )}
      {room.airCondition && (
        <AmenityWrapper>
          <AirVent className="size-4" />
          {t('amenities.airCondition')}
        </AmenityWrapper>
      )}
      {room.soundProofed && (
        <AmenityWrapper>
          <VolumeX className="size-4" />
          {t('amenities.soundProofed')}
        </AmenityWrapper>
      )}
    </div>
  );
}
