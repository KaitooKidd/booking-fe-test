import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { ReactElement, ReactNode, useEffect, useState } from 'react';
import { UseFormReturn, useForm } from 'react-hook-form';
import * as z from 'zod';
import { ReviewApi, ReviewSchema } from '~/apis/review.api';
import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import StyledRating from '~/components/ui/rating';
import { Textarea } from '~/components/ui/textarea';
import { toast } from '~/components/ui/use-toast';
import { roundToNDecimal } from '~/utils/common.util';
import { cn } from '~/utils/ui.util';

interface ReviewModelProps {
  title: string;
  description: string | ReactElement | readonly ReactNode[];
  buttonLabel: string;
  bookingId?: string;
  onReviewSubmit?: () => void;
  review?: ReviewSchema;
}

function getTotalRate(
  form: UseFormReturn<
    {
      staffRating: number;
      facilityRating: number;
      cleanlinessRating: number;
      comfortRating: number;
      valueForMoneyRating: number;
      locationRating: number;
      comment: string;
    },
    any,
    undefined
  >,
) {
  const values = form.getValues();
  const total = Object.values(values).reduce((acc: number, value) => acc + (typeof value === 'number' ? value : 0), 0);
  return roundToNDecimal((total * 2) / 6, 1);
}

export default function ReviewModel({
  title,
  description,
  buttonLabel,
  bookingId,
  review,
  onReviewSubmit,
}: ReviewModelProps) {
  const t = useTranslations('Review');

  const formSchema = z.object({
    staffRating: z.coerce.number().min(0.5, { message: t('form.ratingRequired') }),
    facilityRating: z.coerce.number().min(0.5, { message: t('form.ratingRequired') }),
    cleanlinessRating: z.coerce.number().min(0.5, { message: t('form.ratingRequired') }),
    comfortRating: z.coerce.number().min(0.5, { message: t('form.ratingRequired') }),
    valueForMoneyRating: z.coerce.number().min(0.5, { message: t('form.ratingRequired') }),
    locationRating: z.coerce.number().min(0.5, { message: t('form.ratingRequired') }),
    comment: z.string().min(3, { message: t('form.commentRequired') }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: review
      ? {
          staffRating: review.staffRating,
          facilityRating: review.facilityRating,
          cleanlinessRating: review.cleanlinessRating,
          comfortRating: review.comfortRating,
          valueForMoneyRating: review.valueForMoneyRating,
          locationRating: review.locationRating,
          comment: review.comment,
        }
      : {
          staffRating: 5,
          facilityRating: 5,
          cleanlinessRating: 5,
          comfortRating: 5,
          valueForMoneyRating: 5,
          locationRating: 5,
          comment: '',
        },
  });

  const [totalRate, setTotalRate] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const isReadOnly = !bookingId && !!review;

  useEffect(() => {
    setTotalRate(getTotalRate(form));
  }, [
    form.watch('staffRating'),
    form.watch('facilityRating'),
    form.watch('cleanlinessRating'),
    form.watch('comfortRating'),
    form.watch('valueForMoneyRating'),
    form.watch('locationRating'),
  ]);

  async function onSubmit(data: z.infer<typeof formSchema>) {
    if (isReadOnly) return;
    if (!bookingId) return toast({ variant: 'destructive', title: t('toast.missingParams') });

    setIsLoading(true);
    const { isSuccess } = await ReviewApi.create({ ...data, bookingId });

    if (isSuccess) {
      toast({ variant: 'success', title: t('toast.success') });
      if (onReviewSubmit) onReviewSubmit();
    } else {
      toast({ variant: 'destructive', title: t('toast.failure') });
    }
    setIsLoading(false);
  }

  function localeConverter(value: string) {
    return t(`rateDesc.${value}`);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button disabled={isLoading}>{buttonLabel}</Button>
      </DialogTrigger>
      <DialogContent className="w-[90%] max-w-[900px] overflow-y-auto 2xl:max-w-[1200px]">
        <DialogHeader className="px-2">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 p-2 md:space-y-4">
            {/* Rates */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3 [&>*]:w-full">
              <FormField
                control={form.control}
                name="staffRating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('form.staff')}</FormLabel>
                    <FormControl>
                      <StyledRating
                        stars={field.value}
                        onRateChange={field.onChange}
                        localeConverter={localeConverter}
                        readOnly={isReadOnly}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="facilityRating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('form.facility')}</FormLabel>
                    <FormControl>
                      <StyledRating
                        stars={field.value}
                        onRateChange={field.onChange}
                        localeConverter={localeConverter}
                        readOnly={isReadOnly}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cleanlinessRating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('form.cleanliness')}</FormLabel>
                    <FormControl>
                      <StyledRating
                        stars={field.value}
                        onRateChange={field.onChange}
                        localeConverter={localeConverter}
                        readOnly={isReadOnly}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="comfortRating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('form.comfort')}</FormLabel>
                    <FormControl>
                      <StyledRating
                        stars={field.value}
                        onRateChange={field.onChange}
                        localeConverter={localeConverter}
                        readOnly={isReadOnly}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="valueForMoneyRating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('form.valueForMoney')}</FormLabel>
                    <FormControl>
                      <StyledRating
                        stars={field.value}
                        onRateChange={field.onChange}
                        localeConverter={localeConverter}
                        readOnly={isReadOnly}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="locationRating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('form.location')}</FormLabel>
                    <FormControl>
                      <StyledRating
                        stars={field.value}
                        onRateChange={field.onChange}
                        localeConverter={localeConverter}
                        readOnly={isReadOnly}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Comment */}
            <div>
              <FormField
                control={form.control}
                name="comment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-end justify-between">
                      <span>{t('form.comment')}</span>
                      <span
                        className={cn('rounded-lg bg-foreground p-2 text-primary-foreground', {
                          'bg-red-500': totalRate < 3,
                          'bg-orange-500': 3 <= totalRate && totalRate < 5,
                          'bg-green-500': 5 <= totalRate && totalRate < 8,
                          'bg-blue-500': 8 <= totalRate,
                        })}
                      >
                        {totalRate} / 10
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Textarea placeholder={t('form.commentPlaceholder')} {...field} readOnly={isReadOnly} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>

        {/* Button */}
        {!isReadOnly && (
          <DialogFooter className="space-x-4">
            <DialogClose asChild>
              <Button variant="secondary">{t('form.cancel')}</Button>
            </DialogClose>
            <Button type="submit" onClick={form.handleSubmit(onSubmit)}>
              {t('form.submit')}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
