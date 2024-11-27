'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Rating } from '@mui/material';
import { SlidersHorizontal } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '~/components/ui/button';
import { Checkbox } from '~/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { ScrollArea } from '~/components/ui/scroll-area';
import { toast } from '~/components/ui/use-toast';
import useHotelFilters from '~/hooks/useHotelFilters';
import { cn } from '~/utils/ui.util';

type HotelFilterModalProps = {
  className?: string;
};

const formSchema = z.object({
  priceRange: z.array(z.coerce.number()).length(2, {
    message: 'Price range must have 2 numbers.',
  }),
  rating: z.number().min(0).max(5).default(0),
  gym: z.boolean().default(false),
  bar: z.boolean().default(false),
  restaurant: z.boolean().default(false),
  freeParking: z.boolean().default(false),
  movieNight: z.boolean().default(false),
  coffeeShop: z.boolean().default(false),
  spa: z.boolean().default(false),
  laundry: z.boolean().default(false),
  shopping: z.boolean().default(false),
  bikeRental: z.boolean().default(false),
  swimmingPool: z.boolean().default(false),
  allowPets: z.boolean().default(false),
  allowSmoking: z.boolean().default(false),
});

export type HotelFilterSchema = z.infer<typeof formSchema>;

export default function HotelFilterModal({ className }: HotelFilterModalProps) {
  const t = useTranslations();
  const { filters, setFilters, resetFilters } = useHotelFilters();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<HotelFilterSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: filters,
  });

  function onSubmit(values: HotelFilterSchema) {
    // toast({
    //   title: 'You submitted the following values:',
    //   description: (
    //     <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
    //       <code className="text-white">{JSON.stringify(values, null, 2)}</code>
    //     </pre>
    //   ),
    // });
    setFilters(values);
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className={cn('text-sm', className)}>
          <SlidersHorizontal className="mr-2 size-4" /> {t('HotelFilters.trigger')}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <DialogHeader className="border-b pb-2">
              <DialogTitle>{t('HotelFilters.title')}</DialogTitle>
              <DialogDescription>{t('HotelFilters.description')}</DialogDescription>
            </DialogHeader>

            {/* Content */}
            <ScrollArea className="h-[65vh] w-full">
              <div
                aria-label="hotel-filter-content"
                className="space-y-4 px-1 py-2 [&>div>label]:text-lg [&>div>label]:font-semibold"
              >
                <div aria-label="price-range">
                  <FormLabel>{t('HotelFilters.form.priceRange.title')}</FormLabel>
                  <FormDescription>{t('HotelFilters.form.priceRange.description')}</FormDescription>
                  <div className="mt-2 flex items-center justify-between">
                    <FormField
                      control={form.control}
                      name="priceRange.0"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="number"
                              step={1000}
                              placeholder="100,000"
                              min={0}
                              {...field}
                              onChange={(event) => {
                                if (+event.target.value <= form.getValues('priceRange.1')) {
                                  field.onChange(+event.target.value);
                                }
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <span className="mx-2 h-1 w-4 border-t border-t-primary"></span>
                    <FormField
                      control={form.control}
                      name="priceRange.1"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="number"
                              step={1000}
                              placeholder="5,000,000"
                              min={0}
                              {...field}
                              onChange={(event) => {
                                if (+event.target.value >= form.getValues('priceRange.1')) {
                                  field.onChange(+event.target.value);
                                }
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div aria-label="rating">
                  <FormLabel>{t('HotelFilters.form.rating.title')}</FormLabel>
                  <div className="mt-2 grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="rating"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="flex items-center">
                              <Rating value={field.value} onChange={(_event, value) => field.onChange(value ?? 0)} />
                              <span className="ml-2.5">{field.value}+</span>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div aria-label="amenities">
                  <FormLabel>{t('HotelFilters.form.amenities.title')}</FormLabel>
                  <div className="mt-2 grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="gym"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-end space-x-3 rounded-md border p-4">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <FormLabel className="w-full cursor-pointer">{t('HotelForm.label.gym')}</FormLabel>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="bar"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-end space-x-3 rounded-md border p-4">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <FormLabel className="w-full cursor-pointer">{t('HotelForm.label.bar')}</FormLabel>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="restaurant"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-end space-x-3 rounded-md border p-4">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <FormLabel className="w-full cursor-pointer">{t('HotelForm.label.restaurant')}</FormLabel>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="freeParking"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-end space-x-3 rounded-md border p-4">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <FormLabel className="w-full cursor-pointer">{t('HotelForm.label.freeParking')}</FormLabel>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="movieNight"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-end space-x-3 rounded-md border p-4">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <FormLabel className="w-full cursor-pointer">{t('HotelForm.label.movieNight')}</FormLabel>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="coffeeShop"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-end space-x-3 rounded-md border p-4">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <FormLabel className="w-full cursor-pointer">{t('HotelForm.label.coffeeShop')}</FormLabel>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="spa"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-end space-x-3 rounded-md border p-4">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <FormLabel className="w-full cursor-pointer">{t('HotelForm.label.spa')}</FormLabel>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="laundry"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-end space-x-3 rounded-md border p-4">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <FormLabel className="w-full cursor-pointer">{t('HotelForm.label.laundry')}</FormLabel>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="shopping"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-end space-x-3 rounded-md border p-4">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <FormLabel className="w-full cursor-pointer">{t('HotelForm.label.shopping')}</FormLabel>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="bikeRental"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-end space-x-3 rounded-md border p-4">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <FormLabel className="w-full cursor-pointer">{t('HotelForm.label.bikeRental')}</FormLabel>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="swimmingPool"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-end space-x-3 rounded-md border p-4">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <FormLabel className="w-full cursor-pointer">{t('HotelForm.label.swimmingPool')}</FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div aria-label="hotel-rules">
                  <FormLabel>{t('HotelFilters.form.rules.title')}</FormLabel>
                  <div className="mt-2 grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="allowPets"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-end space-x-3 rounded-md border p-4">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <FormLabel className="w-full cursor-pointer">{t('HotelForm.label.allowPets')}</FormLabel>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="allowSmoking"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-end space-x-3 rounded-md border p-4">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <FormLabel className="w-full cursor-pointer">{t('HotelForm.label.allowSmoking')}</FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </ScrollArea>

            <DialogFooter className="sm:justify-between">
              <Button
                type="reset"
                variant="secondary"
                onClick={(e) => {
                  // form.reset() // undo to previous state
                  e.preventDefault();
                  resetFilters(form.reset);
                }}
              >
                {t('HotelFilters.form.reset')}
              </Button>
              <Button type="submit">{t('HotelFilters.form.apply')}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
