'use client';

import {
  AirVent,
  Bath,
  Bed,
  BedDouble,
  Castle,
  Home,
  Loader2,
  MountainSnow,
  Pencil,
  Ship,
  Trash,
  Trees,
  Tv,
  Users,
  UtensilsCrossed,
  VolumeX,
  Wifi,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useState } from 'react';
import { KeyedMutator, mutate } from 'swr';
import { HotelApi, HotelSchema, RoomSchema, hotelEndpoints } from '~/apis/hotel.api';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '~/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
import { Separator } from '~/components/ui/separator';
import { useToast } from '~/components/ui/use-toast';
import { splitNumber } from '~/utils/common.util';
import AmenityWrapper from '../amenities/AmenityWrapper';
import RoomForm from './RoomForm';
import RoomAmenities from '../amenities/RoomAmenities';

interface RoomCardProps {
  hotel: HotelSchema;
  room: RoomSchema;
  mutateHotel?: KeyedMutator<HotelSchema>;
  canManage?: boolean;
}

export default function RoomCard({
  room,
  hotel,
  mutateHotel,
  canManage = false, // Manage Hotel Room
}: RoomCardProps) {
  const t = useTranslations('RoomCard');
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [roomDialogOpen, setRoomDialogOpen] = useState(false);

  function handleToggleRoomDialog() {
    setRoomDialogOpen((prev) => !prev);
  }

  async function handleDeleteRoom() {
    setIsLoading(true);
    const { isSuccess } = await HotelApi.deleteRoom(hotel.id, room.id);
    if (isSuccess) {
      toast({ variant: 'success', description: t('toast.deleteSuccess') });
      setIsLoading(false);
      // router.refresh();
      // router.push(routeConfig.A_MANAGE_HOTELS + `/${hotel.id}`);
      mutate(hotelEndpoints.getById(hotel.id));
    } else {
      toast({ variant: 'destructive', description: t('toast.deleteFailure') });
      setIsLoading(false);
    }
  }

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle>{room.title}</CardTitle>
        <CardDescription>{room.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {/* Cover */}
        <div className="relative aspect-square h-[200px] overflow-hidden rounded-lg">
          <Image fill priority src={room.imageUrl} alt="room" className="object-cover" /> {/* TODO: placeholder */}
        </div>

        {/* Amenities */}
        <RoomAmenities room={room} />

        <Separator />

        {/* Price */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p>
              {t('price.roomPrice')} <span className="text-xs">(VND/{t('price.hour')})</span>:{' '}
            </p>
            <span className="font-bold">{splitNumber(room.roomPrice)}</span>
          </div>
          {room.breakFastPrice > 0 && (
            <div className="flex items-center justify-between">
              <p>
                {t('price.breakFast')} <span className="text-xs">(VND)</span>:{' '}
              </p>
              <span className="font-bold">{splitNumber(room.breakFastPrice)}</span>
            </div>
          )}
        </div>

        <Separator />
      </CardContent>
      {canManage && mutateHotel && (
        <CardFooter>
          <div className="flex w-full justify-between">
            {/* Delete Button */}
            <Button disabled={isLoading} type="button" variant="outline" onClick={handleDeleteRoom}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 size-4" />
                  {t('footer.deleting')}
                </>
              ) : (
                <>
                  <Trash className="mr-2 size-4" />
                  {t('footer.delete')}
                </>
              )}
            </Button>

            {/* Edit Dialog */}
            <Dialog open={roomDialogOpen} onOpenChange={setRoomDialogOpen}>
              <DialogTrigger asChild>
                <Button className="max-w-[150px]">
                  <Pencil className="mr-2 size-4" />
                  {t('footer.editTrigger')}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-[900px] w-[90%]">
                <DialogHeader className="px-2">
                  <DialogTitle>{t('footer.editTitle')}</DialogTitle>
                  <DialogDescription>{t('footer.editDesc')}</DialogDescription>
                </DialogHeader>
                <RoomForm
                  hotel={hotel}
                  room={room}
                  handleToggleDialog={handleToggleRoomDialog}
                  mutateHotel={mutateHotel}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
