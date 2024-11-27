'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarIcon } from '@radix-ui/react-icons';
import { format } from 'date-fns';
import { Button } from '~/components/ui/button';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { HotelApi, HotelReceptionist, ReceptionistInfo } from '~/apis/hotel.api';
import { Calendar } from '~/components/ui/calendar';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { toast } from '~/components/ui/use-toast';
import { cn } from '~/utils/ui.util';
import { Loader2Icon, PencilLineIcon } from 'lucide-react';
import { useState } from 'react';
import CustomDatePickerPopover from '~/components/common/CustomDatePickerPopover';

interface ReceptionistFormProps {
  data?: ReceptionistInfo;
  hotels: Omit<HotelReceptionist, 'receptionists'>[];
  onFilter?: (value: ReceptionistInfo) => void;
  setClose: () => void;
}

export default function ReceptionistForm({ data, hotels, onFilter, setClose }: ReceptionistFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const formSchema = z.object({
    email: z.string().email({
      message: 'Email is required',
    }),
    name: z.string().min(3, { message: 'Name is required' }),
    phone: z.string({ required_error: 'Phone is required' }),
    birthday: z.date({ required_error: 'Birthday is required' }),
    gender: z.string().optional(),
    hotelId: z.string().min(1, 'Hotel is required'), // convert to number
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: data
      ? ({
          ...data,
          email: data.id,
          hotelId: String(data.hotelId),
          birthday: data.birthday ? new Date(data.birthday) : '',
        } as any)
      : {
          email: '',
          name: '',
          phone: '',
          birthday: '',
          gender: '',
          hotelId: '',
        },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    toast({
      title: 'You submitted the following values:',
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(values, null, 2)}</code>
        </pre>
      ),
    });
    const convertedValues = {
      ...values,
      hotelId: Number(values.hotelId),
      birthday: values.birthday ? format(values.birthday, 'yyyy-MM-dd') : undefined,
    };
    if (!convertedValues.gender) {
      delete convertedValues.gender;
    }

    const response = data
      ? await HotelApi.updateReceptionist(convertedValues)
      : await HotelApi.createReceptionist(convertedValues);

    if (response.isSuccess) {
      toast({
        title: data ? 'Receptionist updated!' : 'Receptionist created!',
        variant: 'success',
      });
      if (onFilter) {
        onFilter({ isVerified: true, ...convertedValues, ...response.data });
      }
      // await new Promise((resolve) => setTimeout(resolve, 20000));
    } else {
      let errorMessage = undefined;
      if (response.error?.statusCode === 409) {
        errorMessage = 'Receptionist email already exists';
      } else if (response.error?.statusCode === 404) {
        if (!data) errorMessage = 'Hotel not found';
        else errorMessage = 'Receptionist not found';
      }
      toast({
        title: data ? 'Failed to update receptionist!' : 'Failed to create receptionist!',
        variant: 'destructive',
        ...(errorMessage && { description: errorMessage }),
      });
    }
    setIsLoading(false);
    if (response.isSuccess) setClose();
  }

  return (
    <div className="max-h-[80vh] w-full overflow-y-auto px-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Content */}
          <div className="flex flex-col gap-6 md:flex-row">
            <div className="flex flex-1 flex-col gap-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormDescription>Provide receptionist email</FormDescription>
                    <FormControl>
                      <Input
                        type="email"
                        disabled={!!data || isLoading}
                        placeholder={'abc@example.com'}
                        readOnly={!!data}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormDescription>Provide receptionist name</FormDescription>
                    <FormControl>
                      <Input type="text" disabled={isLoading} placeholder={'John Doe'} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="hotelId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hotel</FormLabel>
                    <FormDescription>Select the hotel of receptionist</FormDescription>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select the hotel" />
                        </SelectTrigger>
                        <SelectContent>
                          {hotels.map((hotel, index) => (
                            <SelectItem key={index} value={String(hotel.id)}>
                              {hotel.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-1 flex-col gap-6">
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <FormDescription>Select the gender</FormDescription>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Private" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormDescription>Provide the phone number</FormDescription>
                    <FormControl>
                      <Input placeholder={'0987654321'} {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="birthday"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date of birth</FormLabel>
                    <FormDescription>Provide the receptionist birthday</FormDescription>
                    <CustomDatePickerPopover
                      selected={field.value}
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
                            {field.value ? format(field.value, 'yyyy-MM-dd') : <span>Pick a date</span>}
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
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-4">
            <Button type="submit" className="max-w-[150px]" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2Icon className="mr-2 size-4 animate-spin" />
                  {!data ? 'Creating' : 'Updating'}
                </>
              ) : (
                <>
                  <PencilLineIcon className="mr-2 size-4" />
                  Submit
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={(e) => {
                e.preventDefault();
                setClose();
              }}
            >
              Close
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
