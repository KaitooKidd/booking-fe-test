// 'use client';

// import { zodResolver } from '@hookform/resolvers/zod';
// import { getCookie } from 'cookies-next';
// import { Loader2Icon, PencilLineIcon, XCircleIcon } from 'lucide-react';
// import { useTranslations } from 'next-intl';
// import Image from 'next/image';
// import { useEffect, useState } from 'react';
// import { useForm } from 'react-hook-form';
// import * as z from 'zod';
// import { HotelSchema } from '~/apis/hotel.api';
// import { VnDistrict, VnProvince, VnWard } from '~/apis/location.api';
// import { StorageApi } from '~/apis/storage.api';
// import { Button } from '~/components/ui/button';
// import { Checkbox } from '~/components/ui/checkbox';
// import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
// import { Input } from '~/components/ui/input';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
// import { Textarea } from '~/components/ui/textarea';
// import { useToast } from '~/components/ui/use-toast';
// import useVnLocation from '~/hooks/useVnLocation';
// import UploadFile, { StorageResult } from '../form/UploadFile';

// interface HotelFormProps {
//   hotel?: HotelSchema;
// }

// function HotelFormOld({ hotel }: HotelFormProps) {
//   const locale = getCookie('NEXT_LOCALE')! as 'en' | 'vn';
//   const t = useTranslations();
//   const { toast } = useToast();

//   const gallerySchema = z.object({
//     url: z.string().url({ message: t('HotelForm.error.galleryUrl') }),
//     key: z.string().optional(),
//   });

//   const formSchema = z.object({
//     email: z.string().email({ message: t('HotelForm.error.email') }),
//     name: z.string().min(3, { message: t('HotelForm.error.name') }),
//     description: z.string().min(10, { message: t('HotelForm.error.description') }),
//     imageUrl: z.string().url({ message: t('HotelForm.error.imageUrl') }),
//     imageKey: z.string().optional(),
//     country: z.string().min(1, { message: t('HotelForm.error.country') }),
//     province: z.string().min(1, { message: t('HotelForm.error.province') }),
//     address: z.string().min(1, { message: t('HotelForm.error.address') }),
//     district: z.string().optional(),
//     ward: z.string().optional(),
//     gallery: z.array(gallerySchema).optional(),
//     gym: z.boolean().optional(),
//     bar: z.boolean().optional(),
//     restaurant: z.boolean().optional(),
//     freeParking: z.boolean().optional(),
//     movieNight: z.boolean().optional(),
//     coffeeShop: z.boolean().optional(),
//     spa: z.boolean().optional(),
//     laundry: z.boolean().optional(),
//     shopping: z.boolean().optional(),
//     bikeRental: z.boolean().optional(),
//     swimmingPool: z.boolean().optional(),
//   });

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: hotel
//       ? {
//           ...hotel,
//           ...(hotel.address && {
//             address: hotel.address.details,
//             country: hotel.address.country,
//             province: hotel.address.province,
//             district: hotel.address?.district,
//             ward: hotel.address?.ward,
//           }),
//         }
//       : {
//           email: '',
//           name: '',
//           description: '',
//           imageUrl: '',
//           imageKey: '',
//           country: '',
//           province: '',
//           address: '',
//           district: '',
//           ward: '',
//           gallery: [],
//           gym: false,
//           bar: false,
//           restaurant: false,
//           freeParking: false,
//           movieNight: false,
//           coffeeShop: false,
//           spa: false,
//           laundry: false,
//           shopping: false,
//           bikeRental: false,
//           swimmingPool: false,
//         },
//   });
//   console.log({ hotel, form: form.getValues() });

//   const [preview, setPreview] = useState<StorageResult | null>(
//     hotel ? { url: hotel?.imageUrl, key: hotel?.imageKey } : null,
//   );
//   const [previewIsDeleting, setPreviewIsDeleting] = useState<boolean>(false);
//   const [isLoading, setIsLoading] = useState<boolean>(false);

//   const [provinces, setProvinces] = useState<VnProvince[]>([]);
//   const [districts, setDistricts] = useState<VnDistrict[]>([]);
//   const [wards, setWards] = useState<VnWard[]>([]);

//   const { getProvinces, getProvinceByName, getDistrictByName, getVnLocationFieldName } = useVnLocation();

//   useEffect(() => {
//     if (typeof preview?.url === 'string') {
//       form.setValue('imageUrl', preview.url, {
//         shouldDirty: true,
//         shouldValidate: true,
//         shouldTouch: true,
//       });
//       form.setValue('imageKey', preview.key ?? undefined);
//     }
//   }, [preview]);

//   useEffect(() => {
//     // const selectedCountry = form.watch('country');
//     // if (selectedCountry) {
//     //   setProvinces(getProvinces());
//     // }
//     setProvinces(getProvinces());
//   }, [form.watch('country')]);

//   useEffect(() => {
//     const selectedProvince = form.watch('province');
//     if (selectedProvince) {
//       setDistricts(getProvinceByName(provinces, selectedProvince, locale)?.districts ?? []);
//     }
//   }, [form.watch('province')]);

//   useEffect(() => {
//     const selectedDistrict = form.watch('district');
//     if (selectedDistrict) {
//       setWards(getDistrictByName(districts, selectedDistrict, locale)?.wards ?? []);
//     }
//   }, [form.watch('district')]);

//   function onSubmit(values: z.infer<typeof formSchema>) {
//     console.log(values);
//   }

//   async function handleDeleteImage() {
//     setPreviewIsDeleting(true);
//     const { isSuccess } = await StorageApi.deleteFile(preview!.key);
//     setPreviewIsDeleting(false);
//     if (isSuccess) {
//       setPreview(null);
//       toast({ variant: 'success', description: t('HotelForm.toast.removeSuccess') });
//     } else {
//       toast({ variant: 'destructive', description: t('HotelForm.toast.removeFailure') });
//     }
//   }

//   return (
//     <div className="space-y-6">
//       <h3 className="text-lg font-semibold">{t(!hotel ? 'HotelForm.title.create' : 'HotelForm.title.edit')}</h3>
//       <Form {...form}>
//         <form onSubmit={form.handleSubmit(onSubmit)}>
//           <div className="flex flex-col gap-6 md:flex-row">
//             {/* Part 1: left */}
//             <div className="flex flex-1 flex-col gap-6">
//               <FormField
//                 control={form.control}
//                 name="name"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>{t('HotelForm.label.name')}</FormLabel>
//                     <FormDescription>{t('HotelForm.desc.name')}</FormDescription>
//                     <FormControl>
//                       <Input placeholder={t('HotelForm.placeholder.name')} {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="description"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>{t('HotelForm.label.description')}</FormLabel>
//                     <FormDescription>{t('HotelForm.desc.description')}</FormDescription>
//                     <FormControl>
//                       <Textarea placeholder={t('HotelForm.placeholder.description')} {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <div>
//                 <FormLabel>{t('HotelForm.label.amenities')}</FormLabel>
//                 <FormDescription>{t('HotelForm.desc.amenities')}</FormDescription>
//                 <div className="mt-2 grid grid-cols-2 gap-4">
//                   <FormField
//                     control={form.control}
//                     name="gym"
//                     render={({ field }) => (
//                       <FormItem className="flex flex-row items-end space-x-3 rounded-md border p-4">
//                         <FormControl>
//                           <Checkbox checked={field.value} onCheckedChange={field.onChange} />
//                         </FormControl>
//                         <FormLabel>{t('HotelForm.label.gym')}</FormLabel>
//                       </FormItem>
//                     )}
//                   />
//                   <FormField
//                     control={form.control}
//                     name="bar"
//                     render={({ field }) => (
//                       <FormItem className="flex flex-row items-end space-x-3 rounded-md border p-4">
//                         <FormControl>
//                           <Checkbox checked={field.value} onCheckedChange={field.onChange} />
//                         </FormControl>
//                         <FormLabel>{t('HotelForm.label.bar')}</FormLabel>
//                       </FormItem>
//                     )}
//                   />
//                   <FormField
//                     control={form.control}
//                     name="restaurant"
//                     render={({ field }) => (
//                       <FormItem className="flex flex-row items-end space-x-3 rounded-md border p-4">
//                         <FormControl>
//                           <Checkbox checked={field.value} onCheckedChange={field.onChange} />
//                         </FormControl>
//                         <FormLabel>{t('HotelForm.label.restaurant')}</FormLabel>
//                       </FormItem>
//                     )}
//                   />
//                   <FormField
//                     control={form.control}
//                     name="freeParking"
//                     render={({ field }) => (
//                       <FormItem className="flex flex-row items-end space-x-3 rounded-md border p-4">
//                         <FormControl>
//                           <Checkbox checked={field.value} onCheckedChange={field.onChange} />
//                         </FormControl>
//                         <FormLabel>{t('HotelForm.label.freeParking')}</FormLabel>
//                       </FormItem>
//                     )}
//                   />
//                   <FormField
//                     control={form.control}
//                     name="movieNight"
//                     render={({ field }) => (
//                       <FormItem className="flex flex-row items-end space-x-3 rounded-md border p-4">
//                         <FormControl>
//                           <Checkbox checked={field.value} onCheckedChange={field.onChange} />
//                         </FormControl>
//                         <FormLabel>{t('HotelForm.label.movieNight')}</FormLabel>
//                       </FormItem>
//                     )}
//                   />
//                   <FormField
//                     control={form.control}
//                     name="coffeeShop"
//                     render={({ field }) => (
//                       <FormItem className="flex flex-row items-end space-x-3 rounded-md border p-4">
//                         <FormControl>
//                           <Checkbox checked={field.value} onCheckedChange={field.onChange} />
//                         </FormControl>
//                         <FormLabel>{t('HotelForm.label.coffeeShop')}</FormLabel>
//                       </FormItem>
//                     )}
//                   />
//                   <FormField
//                     control={form.control}
//                     name="spa"
//                     render={({ field }) => (
//                       <FormItem className="flex flex-row items-end space-x-3 rounded-md border p-4">
//                         <FormControl>
//                           <Checkbox checked={field.value} onCheckedChange={field.onChange} />
//                         </FormControl>
//                         <FormLabel>{t('HotelForm.label.spa')}</FormLabel>
//                       </FormItem>
//                     )}
//                   />
//                   <FormField
//                     control={form.control}
//                     name="laundry"
//                     render={({ field }) => (
//                       <FormItem className="flex flex-row items-end space-x-3 rounded-md border p-4">
//                         <FormControl>
//                           <Checkbox checked={field.value} onCheckedChange={field.onChange} />
//                         </FormControl>
//                         <FormLabel>{t('HotelForm.label.laundry')}</FormLabel>
//                       </FormItem>
//                     )}
//                   />
//                   <FormField
//                     control={form.control}
//                     name="shopping"
//                     render={({ field }) => (
//                       <FormItem className="flex flex-row items-end space-x-3 rounded-md border p-4">
//                         <FormControl>
//                           <Checkbox checked={field.value} onCheckedChange={field.onChange} />
//                         </FormControl>
//                         <FormLabel>{t('HotelForm.label.shopping')}</FormLabel>
//                       </FormItem>
//                     )}
//                   />
//                   <FormField
//                     control={form.control}
//                     name="bikeRental"
//                     render={({ field }) => (
//                       <FormItem className="flex flex-row items-end space-x-3 rounded-md border p-4">
//                         <FormControl>
//                           <Checkbox checked={field.value} onCheckedChange={field.onChange} />
//                         </FormControl>
//                         <FormLabel>{t('HotelForm.label.bikeRental')}</FormLabel>
//                       </FormItem>
//                     )}
//                   />
//                   <FormField
//                     control={form.control}
//                     name="swimmingPool"
//                     render={({ field }) => (
//                       <FormItem className="flex flex-row items-end space-x-3 rounded-md border p-4">
//                         <FormControl>
//                           <Checkbox checked={field.value} onCheckedChange={field.onChange} />
//                         </FormControl>
//                         <FormLabel>{t('HotelForm.label.swimmingPool')}</FormLabel>
//                       </FormItem>
//                     )}
//                   />
//                 </div>
//               </div>

//               <FormField
//                 control={form.control}
//                 name="imageUrl"
//                 render={({ field }) => (
//                   <FormItem className="flex flex-col space-y-3">
//                     <FormLabel>{t('HotelForm.label.image')}</FormLabel>
//                     <FormDescription>{t('HotelForm.desc.image')}</FormDescription>
//                     <FormControl>
//                       {preview ? (
//                         <div className="relative mt-4 max-h-[400px] min-h-[400px] min-w-[200px] max-w-[400px]">
//                           <Image fill src={preview.url} alt="Hotel image" className="object-contain" />
//                           <Button
//                             type="button"
//                             size="icon"
//                             variant="ghost"
//                             className="absolute -right-3 top-0"
//                             onClick={handleDeleteImage}
//                           >
//                             {previewIsDeleting ? <Loader2Icon /> : <XCircleIcon />}
//                           </Button>
//                         </div>
//                       ) : (
//                         <div className="mt-4 flex max-w-[400px] flex-col items-center rounded border-2 border-dashed border-primary/50 p-12">
//                           <UploadFile
//                             folder="hotels"
//                             onUploadComplete={(res) => {
//                               setPreview(res);
//                               toast({ variant: 'success', description: t('HotelForm.toast.uploadSuccess') });
//                             }}
//                             onUploadError={() => {
//                               toast({ variant: 'destructive', description: t('HotelForm.toast.uploadFailed') });
//                             }}
//                           />
//                         </div>
//                       )}
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>

//             {/* Part2: right */}
//             <div className="flex flex-1 flex-col gap-6">
//               {/* Grid 2 cols */}
//               <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
//                 <FormField
//                   control={form.control}
//                   name="country"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>{t('HotelForm.label.country')}</FormLabel>
//                       <FormDescription>{t('HotelForm.desc.country')}</FormDescription>
//                       <Select
//                         // disabled={isLoading}
//                         onValueChange={field.onChange}
//                         value={field.value}
//                         defaultValue={field.value}
//                       >
//                         <SelectTrigger>
//                           <SelectValue defaultValue={field.value} placeholder={t('HotelForm.placeholder.country')} />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value={t('HotelForm.label.vn')}>{t('HotelForm.label.vn')}</SelectItem>
//                         </SelectContent>
//                       </Select>
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="province"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>{t('HotelForm.label.province')}</FormLabel>
//                       <FormDescription>{t('HotelForm.desc.province')}</FormDescription>
//                       <Select
//                         // disabled={isLoading}
//                         // disabled={!form.watch('province')}
//                         disabled={!form.watch('country') && provinces.length < 1}
//                         onValueChange={field.onChange}
//                         value={field.value}
//                         defaultValue={field.value}
//                       >
//                         <SelectTrigger>
//                           <SelectValue defaultValue={field.value} placeholder={t('HotelForm.placeholder.province')} />
//                         </SelectTrigger>
//                         <SelectContent>
//                           {provinces.map((item) => (
//                             <SelectItem key={item.code} value={item[getVnLocationFieldName(locale)]}>
//                               {item[getVnLocationFieldName(locale)]}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="district"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>{t('HotelForm.label.district')}</FormLabel>
//                       <FormDescription>{t('HotelForm.desc.district')}</FormDescription>
//                       <Select
//                         // disabled={isLoading}
//                         disabled={!form.watch('province') && districts.length < 1}
//                         onValueChange={field.onChange}
//                         value={field.value}
//                         defaultValue={field.value}
//                       >
//                         <SelectTrigger>
//                           <SelectValue defaultValue={field.value} placeholder={t('HotelForm.placeholder.district')} />
//                         </SelectTrigger>
//                         <SelectContent>
//                           {districts.map((item) => (
//                             <SelectItem key={item.code} value={item[getVnLocationFieldName(locale)]}>
//                               {item[getVnLocationFieldName(locale)]}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="ward"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>{t('HotelForm.label.ward')}</FormLabel>
//                       <FormDescription>{t('HotelForm.desc.ward')}</FormDescription>
//                       <Select
//                         // disabled={isLoading}
//                         disabled={!form.watch('district') && wards.length < 1}
//                         onValueChange={field.onChange}
//                         value={field.value}
//                         defaultValue={field.value}
//                       >
//                         <SelectTrigger>
//                           <SelectValue defaultValue={field.value} placeholder={t('HotelForm.placeholder.ward')} />
//                         </SelectTrigger>
//                         <SelectContent>
//                           {wards.map((item) => (
//                             <SelectItem key={item.code} value={item[getVnLocationFieldName(locale)]}>
//                               {item[getVnLocationFieldName(locale)]}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                     </FormItem>
//                   )}
//                 />
//               </div>

//               {/* Address */}
//               <FormField
//                 control={form.control}
//                 name="address"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>{t('HotelForm.label.address')}</FormLabel>
//                     <FormDescription>{t('HotelForm.desc.address')}</FormDescription>
//                     <FormControl>
//                       <Textarea placeholder={t('HotelForm.placeholder.address')} {...field} />
//                     </FormControl>
//                   </FormItem>
//                 )}
//               />

//               {/* Button */}
//               <div className="flex flex-wrap justify-between gap-2">
//                 {hotel ? (
//                   <Button className="max-w-[150px]" disabled={isLoading}>
//                     {isLoading ? (
//                       <>
//                         <Loader2Icon className="mr-2 size-4 animate-spin" />
//                         {t('HotelForm.button.updating')}
//                       </>
//                     ) : (
//                       <>
//                         <PencilLineIcon className="mr-2 size-4" />
//                         {t('HotelForm.button.update')}
//                       </>
//                     )}
//                   </Button>
//                 ) : (
//                   <Button className="max-w-[150px]" disabled={isLoading}>
//                     {isLoading ? (
//                       <>
//                         <Loader2Icon className="mr-2 size-4 animate-spin" />
//                         {t('HotelForm.button.creating')}
//                       </>
//                     ) : (
//                       <>
//                         <PencilLineIcon className="mr-2 size-4" />
//                         {t('HotelForm.button.create')}
//                       </>
//                     )}
//                   </Button>
//                 )}
//               </div>
//             </div>
//           </div>
//         </form>
//       </Form>
//     </div>
//   );
// }
