'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarIcon } from '@radix-ui/react-icons';
import { format } from 'date-fns';
import { Loader, Pencil, ShieldAlert, ShieldCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { KeyedMutator } from 'swr';
import { z } from 'zod';
import { ProfileApi, ProfileInfo } from '~/apis/profile.api';
import { Button } from '~/components/ui/button';
import { Calendar } from '~/components/ui/calendar';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group';
import { Separator } from '~/components/ui/separator';
import { toast } from '~/components/ui/use-toast';
import { cn } from '~/utils/ui.util';
import ProfileAvatar from './Avatar';
import CustomDatePickerPopover from '~/components/common/CustomDatePickerPopover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '~/components/ui/tooltip';
import { AuthApi } from '~/apis/auth.api';
import { useIRouter } from '~/locales/i18nNavigation';
import { routeConfig } from '~/configs/route.config';

interface ProfileProps {
  data: ProfileInfo;
  role: string;
  mutate: KeyedMutator<ProfileInfo>;
}

export default function Profile({ data, role, mutate }: ProfileProps) {
  const t = useTranslations('Settings.profile');
  const [isLoading, setIsLoading] = useState(false);
  const router = useIRouter();

  const formSchema = z.object({
    id: z.string().email(),
    name: z
      .string()
      .min(3, { message: t('form.name.require') })
      .max(255),
    avatar: z.string().nullable().optional(),
    avatarKey: z.string().nullable().optional(),
    birthday: z.date().nullable().optional(),
    phone: z.string().optional(),
    gender: z.enum(['private', 'male', 'female']),
    address: z.object({
      details: z.string(),
      ward: z.string(),
      district: z.string(),
      province: z.string(),
      country: z.string(),
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...data,
      // id: data.id,
      // name: data.name,
      // avatar: data.avatar,
      // avatarKey: data.avatarKey,
      birthday: data.birthday ? new Date(data.birthday) : undefined,
      gender: (data.gender as any) ?? 'private',
      phone: data.phone ?? undefined,
      address: data.address
        ? {
            details: data.address.details ?? '',
            ward: data.address.ward ?? '',
            district: data.address.district ?? '',
            province: data.address.province ?? '',
            country: data.address.country ?? '',
          }
        : {
            details: '',
            ward: '',
            district: '',
            province: '',
            country: '',
          },
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // toast({
    //   title: 'You submitted the following values:',
    //   description: (
    //     <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
    //       <code className="text-white">{JSON.stringify(values, null, 2)}</code>
    //     </pre>
    //   ),
    // });
    const transformedData = {
      ...data,
      ...values,
      email: values.id,
      birthday: values.birthday ? format(values.birthday, 'yyyy-MM-dd') : null,
      address:
        values.address && values.address.country && values.address.province && values.address.details
          ? { ...(data.address && data.address), ...values.address }
          : undefined,
    };
    setIsLoading(true);
    const response = await ProfileApi.updateProfile(role, transformedData);
    if (response.isSuccess) {
      toast({ variant: 'success', title: t('toast.successTitle'), description: t('toast.successDesc') });
      mutate();
    } else {
      toast({ variant: 'destructive', title: t('toast.failureTitle'), description: t('toast.failureDesc') });
    }
    setIsLoading(false);
  }

  async function handleResendVerificationEmail() {
    setIsLoading(true);
    const response = await AuthApi.resendVerificationEmail();
    if (response.isSuccess) {
      toast({ variant: 'success', title: t('toast.verification.success') });
      router.push(`${routeConfig.VERIFY_EMAIL}?to=${data.id}`);
    } else {
      toast({ variant: 'destructive', title: t('toast.verification.failure') });
    }
    setIsLoading(false);
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">{t('title')}</h3>
        <p className="text-sm text-muted-foreground">{t('description')}</p>
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex gap-8">
            <ProfileAvatar
              data={data}
              onUploadSuccess={(value) => {
                form.setValue('avatar', value.url);
                form.setValue('avatarKey', value.key);
              }}
              // onUploadError={(error) => {
              //   toast({
              //     variant: 'destructive',
              //     title: t('toast.avatarFailureTitle'),
              //     description: t('toast.avatarFailureDesc'),
              //   });
              // }}
            />
            <FormField
              control={form.control}
              name="id"
              disabled={isLoading}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className="flex items-center gap-2">
                    <span>{t('form.email.label')}</span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        {data.isVerified ? (
                          <ShieldCheck className="text-green-500" />
                        ) : (
                          <ShieldAlert
                            className="text-yellow-500 hover:cursor-pointer"
                            onClick={handleResendVerificationEmail}
                          />
                        )}
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{t('verification.tooltip', { verified: data.isVerified })}</p>
                      </TooltipContent>
                    </Tooltip>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="abc@gmail.com" readOnly {...field} />
                  </FormControl>
                  <FormDescription>{t('form.email.description')}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="name"
            disabled={isLoading}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('form.name.label')}</FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} />
                </FormControl>
                <FormDescription>{t('form.name.description')}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>{t('form.gender.label')}</FormLabel>
                <FormDescription>{t('form.gender.description')}</FormDescription>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="flex gap-5"
                    disabled={isLoading}
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="private" />
                      </FormControl>
                      <FormLabel className="font-normal">{t('form.gender.private')}</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="male" />
                      </FormControl>
                      <FormLabel className="font-normal">{t('form.gender.male')}</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="female" />
                      </FormControl>
                      <FormLabel className="font-normal">{t('form.gender.female')}</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div aria-label="phone-gender" className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="phone"
              disabled={isLoading}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('form.phone.label')}</FormLabel>
                  <FormDescription>{t('form.phone.description')}</FormDescription>
                  <FormControl>
                    <Input placeholder="0987654321" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="birthday"
              disabled={isLoading}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('form.birthday.label')}</FormLabel>
                  <FormDescription>{t('form.birthday.description')}</FormDescription>
                  <CustomDatePickerPopover
                    selected={field.value ?? undefined}
                    onSelect={field.onChange}
                    disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                    trigger={
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-[240px] pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground',
                          )}
                        >
                          {field.value ? format(field.value, 'yyyy-MM-dd') : <span>{t('form.birthday.select')}</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    }
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div aria-label="address" className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="address.country"
              disabled={isLoading}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('form.address.country.label')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('form.address.country.placeholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address.province"
              disabled={isLoading}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('form.address.province.label')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('form.address.province.placeholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address.district"
              disabled={isLoading}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('form.address.district.label')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('form.address.district.placeholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address.ward"
              disabled={isLoading}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('form.address.ward.label')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('form.address.ward.placeholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address.details"
              disabled={isLoading}
              render={({ field }) => (
                <FormItem className="grid-cols-sp col-span-2 flex flex-col">
                  <FormLabel>{t('form.address.details.label')}</FormLabel>
                  <FormDescription>{t('form.address.details.description')}</FormDescription>
                  <FormControl>
                    <Input placeholder={t('form.address.details.placeholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader className="mr-2 size-4 animate-spin" />
                {t('form.submit.updating')}
              </>
            ) : (
              <>
                <Pencil className="mr-2 size-4" />
                {t('form.submit.update')}
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
