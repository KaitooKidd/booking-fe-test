'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { SearchCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '~/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '~/components/ui/form';
import { toast } from '~/components/ui/use-toast';
import useHotelFilters from '~/hooks/useHotelFilters';
import HotelSearchLocation from './HotelSearchLocation';
import HotelSearchPeople from './HotelSearchPeople';
import HotelSearchTimeRange from './HotelSearchTimeRange';

const formSchema = z.object({
  location: z.string().optional(),
  timeRange: z
    .object({ from: z.date().optional(), to: z.date().optional() })
    .transform((o) => ({ ...o, from: o.from }))
    .optional(),
  people: z.object({
    guest: z.number().default(0),
    // adult: z.number().optional(),
    // children: z.number().optional(),
    // infant: z.number().optional(),
  }),
});

export type HotelSearchBarSchema = z.infer<typeof formSchema>;

export default function HotelSearchBar() {
  const t = useTranslations();
  const { searchBar, setSearchBar } = useHotelFilters();

  const form = useForm<HotelSearchBarSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: searchBar,
  });

  function onSubmit(values: HotelSearchBarSchema) {
    // toast({
    //   title: 'You submitted the following values:',
    //   description: (
    //     <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
    //       <code className="text-white">{JSON.stringify(values, null, 2)}</code>
    //     </pre>
    //   ),
    // });
    setSearchBar(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="search-bar-shadow first- flex divide-x-2 rounded-full py-4 [&>*]:px-4 [&>*]:first-of-type:ml-4">
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <HotelSearchLocation value={field.value} setValue={(value) => field.onChange(value)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="timeRange"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <HotelSearchTimeRange date={field.value} setDate={(value) => field.onChange(value)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="people.guest"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <HotelSearchPeople guest={field.value} setGuest={(value) => field.onChange(value)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="ml-auto border-none p-0">
            <Button
              type="submit"
              variant="ghost"
              className="rounded-full bg-red-500 !text-white hover:bg-red-600"
              size="icon"
            >
              <SearchCheck size={20} />
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
