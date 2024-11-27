import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2Icon, PencilLineIcon, XCircleIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { KeyedMutator } from 'swr';
import * as z from 'zod';
import { HotelApi, HotelSchema, RoomSchema } from '~/apis/hotel.api';
import { StorageApi } from '~/apis/storage.api';
import { Button } from '~/components/ui/button';
import { Checkbox } from '~/components/ui/checkbox';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { useToast } from '~/components/ui/use-toast';
import UploadFile from '../form/UploadFile';

interface RoomFormProps {
  hotel: HotelSchema;
  room?: RoomSchema;
  mutateHotel: KeyedMutator<HotelSchema>;
  handleToggleDialog: () => void;
}

function RoomForm({ hotel, room, handleToggleDialog, mutateHotel }: RoomFormProps) {
  const t = useTranslations();
  const { toast } = useToast();
  // const router = useIRouter();

  const gallerySchema = z.object({
    url: z.string().url({ message: t('HotelForm.error.galleryUrl') }),
    key: z.string().nullable().optional(),
  });

  const formSchema = z.object({
    title: z.string().min(3, { message: t('RoomForm.error.title') }),
    description: z.string().min(10, { message: t('RoomForm.error.description') }),
    imageUrl: z.string().url({ message: t('RoomForm.error.imageUrl') }),
    imageKey: z.string().optional(),
    gallery: z.array(gallerySchema).optional(),
    bedCount: z.coerce.number().min(1, { message: t('RoomForm.error.bedCount') }), // NOTE: coerce for number, or using onChange={(event) => field.onChange(+event.target.value)}
    guestCount: z.coerce.number().min(1, { message: t('RoomForm.error.guestCount') }),
    bathroomCount: z.coerce.number().min(1, { message: t('RoomForm.error.bathroomCount') }),
    kingBed: z.coerce.number().min(0),
    queenBed: z.coerce.number().min(0),
    breakFastPrice: z.coerce.number().optional(),
    roomPrice: z.coerce.number().min(1, { message: t('RoomForm.error.roomPrice') }),
    roomService: z.boolean().optional(),
    tv: z.boolean().optional(),
    balcony: z.boolean().optional(),
    freeWifi: z.boolean().optional(),
    cityView: z.boolean().optional(),
    oceanView: z.boolean().optional(),
    forestView: z.boolean().optional(),
    mountainView: z.boolean().optional(),
    airCondition: z.boolean().optional(),
    soundProofed: z.boolean().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: room
      ? {
          ...room,
          imageKey: room.imageKey ?? undefined,
        }
      : {
          title: '',
          description: '',
          imageUrl: '',
          imageKey: '',
          gallery: [],
          bedCount: 0,
          guestCount: 0,
          bathroomCount: 0,
          kingBed: 0,
          queenBed: 0,
          breakFastPrice: 0,
          roomPrice: 0,
          roomService: false,
          tv: false,
          balcony: false,
          freeWifi: false,
          cityView: false,
          oceanView: false,
          forestView: false,
          mountainView: false,
          airCondition: false,
          soundProofed: false,
        },
  });

  const [preview, setPreview] = useState<{ url: string; key?: string | null } | null>(
    room ? { url: room?.imageUrl, key: room?.imageKey } : null,
  );
  const [previewIsDeleting, setPreviewIsDeleting] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (typeof preview?.url === 'string') {
      form.setValue('imageUrl', preview.url, {
        shouldDirty: true,
        shouldValidate: true,
        shouldTouch: true,
      });
      form.setValue('imageKey', preview.key ?? undefined);
    }
  }, [form, preview]);

  useEffect(() => {
    if (+form.watch('kingBed') + +form.watch('queenBed') > +form.watch('bedCount')) {
      form.setError('bedCount', { message: t('RoomForm.error.bedCountExceed') });
    } else {
      form.clearErrors('bedCount');
    }
  }, [t, form, form.watch('bedCount'), form.watch('kingBed'), form.watch('queenBed')]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    if (room) {
      const { isSuccess } = await HotelApi.updateRoom(hotel.id, room.id, values);
      if (isSuccess) {
        toast({ variant: 'success', description: t('RoomForm.toast.updateSuccess') });
        setIsLoading(false);
        handleToggleDialog();
        // router.refresh();
        // router.push(routeConfig.A_MANAGE_HOTELS + `/${hotel.id}`);
        mutateHotel(); // mutate(hotelEndpoints.getById(hotel.id));
      } else {
        toast({ variant: 'destructive', description: t('RoomForm.toast.updateFailure') });
        setIsLoading(false);
      }
    } else {
      const { isSuccess } = await HotelApi.createRoom(hotel.id, values as any);
      if (isSuccess) {
        toast({ variant: 'success', description: t('RoomForm.toast.createSuccess') });
        setIsLoading(false);
        handleToggleDialog();
        // router.refresh();
        // router.push(routeConfig.A_MANAGE_HOTELS + `/${hotel.id}`);
        mutateHotel(); // mutate(hotelEndpoints.getById(hotel.id));
      } else {
        toast({ variant: 'destructive', description: t('RoomForm.toast.createFailure') });
        setIsLoading(false);
      }
    }
  }

  async function handleDeleteImage() {
    if (!preview?.key) return;

    setPreviewIsDeleting(true);
    const { isSuccess } = await StorageApi.deleteFile(preview!.key);
    setPreviewIsDeleting(false);
    if (isSuccess) {
      setPreview(null);
      toast({ variant: 'success', description: t('RoomForm.toast.removeSuccess') });
    } else {
      toast({ variant: 'destructive', description: t('RoomForm.toast.removeFailure') });
    }
  }

  return (
    <div className="max-h-[75vh] overflow-y-auto px-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Name, desc */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('RoomForm.label.title')}</FormLabel>
                <FormDescription>{t('RoomForm.desc.title')}</FormDescription>
                <FormControl>
                  <Input placeholder={t('RoomForm.placeholder.title')} disabled={isLoading} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('RoomForm.label.description')}</FormLabel>
                <FormDescription>{t('RoomForm.desc.description')}</FormDescription>
                <FormControl>
                  <Input placeholder={t('RoomForm.placeholder.description')} disabled={isLoading} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Amenities */}
          <div>
            <FormLabel>{t('RoomForm.label.amenities')}</FormLabel>
            <FormDescription>{t('RoomForm.label.amenities')}</FormDescription>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <FormField
                control={form.control}
                name="roomService"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-end space-x-3 rounded-md border p-4">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={isLoading} />
                    </FormControl>
                    <FormLabel className="w-full cursor-pointer">{t('RoomForm.label.roomService')}</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tv"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-end space-x-3 rounded-md border p-4">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={isLoading} />
                    </FormControl>
                    <FormLabel className="w-full cursor-pointer">{t('RoomForm.label.tv')}</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="balcony"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-end space-x-3 rounded-md border p-4">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={isLoading} />
                    </FormControl>
                    <FormLabel className="w-full cursor-pointer">{t('RoomForm.label.balcony')}</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="freeWifi"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-end space-x-3 rounded-md border p-4">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={isLoading} />
                    </FormControl>
                    <FormLabel className="w-full cursor-pointer">{t('RoomForm.label.freeWifi')}</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cityView"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-end space-x-3 rounded-md border p-4">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={isLoading} />
                    </FormControl>
                    <FormLabel className="w-full cursor-pointer">{t('RoomForm.label.cityView')}</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="oceanView"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-end space-x-3 rounded-md border p-4">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={isLoading} />
                    </FormControl>
                    <FormLabel className="w-full cursor-pointer">{t('RoomForm.label.oceanView')}</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="forestView"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-end space-x-3 rounded-md border p-4">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={isLoading} />
                    </FormControl>
                    <FormLabel className="w-full cursor-pointer">{t('RoomForm.label.forestView')}</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="mountainView"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-end space-x-3 rounded-md border p-4">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={isLoading} />
                    </FormControl>
                    <FormLabel className="w-full cursor-pointer">{t('RoomForm.label.mountainView')}</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="airCondition"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-end space-x-3 rounded-md border p-4">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={isLoading} />
                    </FormControl>
                    <FormLabel className="w-full cursor-pointer">{t('RoomForm.label.airCondition')}</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="soundProofed"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-end space-x-3 rounded-md border p-4">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={isLoading} />
                    </FormControl>
                    <FormLabel className="w-full cursor-pointer">{t('RoomForm.label.soundProofed')}</FormLabel>
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Image */}
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field: _field }) => (
              <FormItem className="flex flex-col space-y-3">
                <FormLabel>{t('RoomForm.label.image')}</FormLabel>
                <FormDescription>{t('RoomForm.desc.image')}</FormDescription>
                <FormControl>
                  {preview ? (
                    <div className="relative mt-4 max-h-[400px] min-h-[400px] min-w-[200px] max-w-[400px]">
                      <Image fill src={preview.url} alt="Hotel image" className="object-contain" />
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="absolute -right-3 top-0"
                        onClick={handleDeleteImage}
                      >
                        {previewIsDeleting ? <Loader2Icon className="animate-spin" /> : <XCircleIcon />}
                      </Button>
                    </div>
                  ) : (
                    <div className="mt-4 flex max-w-[400px] flex-col items-center rounded border-2 border-dashed border-primary/50 p-12">
                      <UploadFile
                        folder="rooms"
                        onUploadComplete={(res) => {
                          setPreview(res);
                          toast({ variant: 'success', description: t('RoomForm.toast.uploadSuccess') });
                        }}
                        onUploadError={() => {
                          toast({ variant: 'destructive', description: t('RoomForm.toast.uploadFailure') });
                        }}
                      />
                    </div>
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Price and Count */}
          <div className="flex flex-row gap-6">
            <div className="flex flex-1 flex-col gap-6">
              <FormField
                control={form.control}
                name="roomPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('RoomForm.label.roomPrice')}</FormLabel>
                    <FormDescription>{t('RoomForm.desc.roomPrice')}</FormDescription>
                    <FormControl>
                      <Input type="number" min={0} disabled={isLoading} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bedCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('RoomForm.label.bedCount')}</FormLabel>
                    <FormDescription>{t('RoomForm.desc.bedCount')}</FormDescription>
                    <FormControl>
                      <Input type="number" min={0} max={8} disabled={isLoading} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="guestCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('RoomForm.label.guestCount')}</FormLabel>
                    <FormDescription>{t('RoomForm.desc.guestCount')}</FormDescription>
                    <FormControl>
                      <Input type="number" min={0} max={20} disabled={isLoading} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bathroomCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('RoomForm.label.bathroomCount')}</FormLabel>
                    <FormDescription>{t('RoomForm.desc.bathroomCount')}</FormDescription>
                    <FormControl>
                      <Input type="number" min={0} max={20} disabled={isLoading} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-1 flex-col gap-6">
              <FormField
                control={form.control}
                name="breakFastPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('RoomForm.label.breakFastPrice')}</FormLabel>
                    <FormDescription>{t('RoomForm.desc.breakFastPrice')}</FormDescription>
                    <FormControl>
                      <Input type="number" min={0} max={20} disabled={isLoading} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="kingBed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('RoomForm.label.kingBed')}</FormLabel>
                    <FormDescription>{t('RoomForm.desc.kingBed')}</FormDescription>
                    <FormControl>
                      <Input type="number" min={0} max={20} disabled={isLoading} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="queenBed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('RoomForm.label.queenBed')}</FormLabel>
                    <FormDescription>{t('RoomForm.desc.queenBed')}</FormDescription>
                    <FormControl>
                      <Input type="number" min={0} max={20} disabled={isLoading} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Button */}
          <div className="pb-2 pt-4">
            <Button
              type="submit"
              onClick={form.handleSubmit(onSubmit)} // prevent submit hotel form in outer
              className="max-w-[150px]"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2Icon className="mr-2 size-4 animate-spin" />
                  {t(`RoomForm.button.${room ? 'updating' : 'creating'}`)}
                </>
              ) : (
                <>
                  <PencilLineIcon className="mr-2 size-4" />
                  {t(`RoomForm.button.${room ? 'update' : 'create'}`)}
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default RoomForm;
