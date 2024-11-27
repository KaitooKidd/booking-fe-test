'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Footer from '~/components/layouts/footer/Footer';
import { Button } from '~/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group';
import { Separator } from '~/components/ui/separator';
import { Textarea } from '~/components/ui/textarea';
import { toast } from '~/components/ui/use-toast';

const FormSchema = z.object({
  username: z.string().min(2, 'Name is too short.'),
  email: z.string().email(),
  phone: z.string().default(''),
  gender: z.enum(['private', 'male', 'female']).default('private'),
  hotelName: z.string(),
  address: z.string(),
  content: z.string().min(10, 'Message is too short.'),
});

export default function ContactPage() {
  const t = useTranslations('Contact');

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: '',
      email: '',
      phone: '',
      gender: 'private',
      hotelName: '',
      address: '',
      content: '',
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    // toast({
    //   title: 'You submitted the following values:',
    //   description: (
    //     <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
    //       <code className="text-white">{JSON.stringify(data, null, 2)}</code>
    //     </pre>
    //   ),
    // });

    const formData = new FormData();
    formData.append('entry.2005620554', data.username);
    formData.append('entry.1045781291', data.email);
    formData.append('entry.1166974658', data.phone);
    formData.append('entry.239240657', data.gender);
    formData.append('entry.1832547484', data.hotelName);
    formData.append('entry.1065046570', data.address);
    formData.append('entry.839337160', data.content);

    try {
      const response = await fetch(
        'https://docs.google.com/forms/u/0/d/e/1FAIpQLSe_VTO24zWekzhYYaW11fzgIFAk4NENYgs-97w3aaOLQ4BbNg/formResponse',
        { method: 'POST', body: formData, mode: 'no-cors' },
      );
      console.log(response);

      toast({
        title: t('toast.success'),
        description: t('toast.successDesc'),
      });
    } catch (error) {
      console.log(error);
      toast({
        title: t('toast.failure'),
        description: t('toast.failureDesc'),
      });
    }
  }

  return (
    <>
      <Image
        src="/images/contact-bg.jpg"
        alt="Contact"
        width={1920}
        height={1080}
        objectFit="cover"
        className="rounded-md"
      />
      <div className="my-10 flex flex-col gap-12 lg:flex-row lg:gap-4 [&>*]:flex-1">
        {/* Contact Summary */}
        <div aria-label="contact-summary">
          {/* Description */}
          <div aria-label="contact-description" className="space-y-2">
            <h1 className="font-cormorant text-2xl font-bold">{t('summary.title')}</h1>
            <p className="text-sm">{t('summary.description')}</p>
          </div>

          {/* Contact Info */}
          <div aria-label="contact-info" className="mt-8 space-y-2 lg:mt-12">
            <h1 className="font-cormorant text-xl font-semibold">{t('summary.info.heading')}</h1>
            <ul className="space-y-1.5 text-sm">
              <li>
                <label className="inline-block min-w-[80px] font-medium">
                  <MapPin className="mr-2 inline-block size-4" />
                  {t('summary.info.address')}
                </label>
                <span className="ml-0.5 mr-2">:</span>
                {t('summary.info.addressValue')}
              </li>
              <li>
                <label className="inline-block min-w-[80px] font-medium">
                  <Phone className="mr-2 inline-block size-4" />
                  {t('summary.info.phone')}
                </label>
                <span className="ml-0.5 mr-2">:</span>+84 987 654 321
              </li>
              <li>
                <label className="inline-block min-w-[80px] font-medium">
                  <Mail className="mr-2 inline-block size-4" />
                  {t('summary.info.email')}
                </label>
                <span className="ml-0.5 mr-2">:</span>contact.uet.booking@gmail.com
              </li>
            </ul>
          </div>

          {/* Business Hours */}
          <div aria-label="contact-hours" className="mt-8 space-y-2 lg:mt-12">
            <h1 className="font-cormorant text-xl font-semibold">{t('summary.business.heading')}</h1>
            <ul className="space-y-1.5 text-sm">
              <li>
                <label className="inline-block min-w-[132px] font-medium">
                  <Clock className="mr-2 inline-block size-4" />
                  {t('summary.business.mondayToFriday')}
                </label>
                <span className="ml-0.5 mr-2">:</span>8:00 AM - 5:00 PM
              </li>
              <li>
                <label className="inline-block min-w-[132px] font-medium">
                  <Clock className="mr-2 inline-block size-4" />
                  {t('summary.business.saturday')}
                </label>
                <span className="ml-0.5 mr-2">:</span>8:00 AM - 12:00 PM
              </li>
              <li>
                <label className="inline-block min-w-[132px] font-medium">
                  <Clock className="mr-2 inline-block size-4" />
                  {t('summary.business.sunday')}
                </label>
                <span className="ml-0.5 mr-2">:</span>
                {t('summary.business.closed')}
              </li>
            </ul>
          </div>
        </div>

        {/* Contact Form - Register Hotel */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-3.5">
            <h1 className="font-cormorant text-2xl font-bold">{t('register.title')}</h1>

            {/* User Info */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('register.email')}</FormLabel>
                    <FormControl>
                      <Input placeholder={'abc@example.com'} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('register.name')}</FormLabel>
                    <FormControl>
                      <Input placeholder={'John Doe'} {...field} />
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
                    <FormLabel>{t('register.phone')}</FormLabel>
                    <FormControl>
                      <Input placeholder={'0987654321'} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>{t('register.gender.label')}</FormLabel>
                    <FormControl>
                      <RadioGroup onValueChange={field.onChange} value={field.value} className="flex gap-5">
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="private" />
                          </FormControl>
                          <FormLabel className="font-normal">{t('register.gender.private')}</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="male" />
                          </FormControl>
                          <FormLabel className="font-normal">{t('register.gender.male')}</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="female" />
                          </FormControl>
                          <FormLabel className="font-normal">{t('register.gender.female')}</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* Hotel Info */}
            <FormField
              control={form.control}
              name="hotelName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('register.hotelName')}</FormLabel>
                  <FormControl>
                    <Input placeholder={'Flamingo Resort'} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('register.hotelAddress')}</FormLabel>
                  <FormControl>
                    <Input placeholder={'Hai Phong, Viet Nam'} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('register.content')}</FormLabel>
                  <FormControl>
                    <Textarea placeholder={t('register.contentPlaceholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">{t('register.submit')}</Button>
          </form>
        </Form>
      </div>

      <Footer />
    </>
  );
}
