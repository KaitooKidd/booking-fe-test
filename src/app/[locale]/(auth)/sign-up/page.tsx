'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ReloadIcon } from '@radix-ui/react-icons';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import GuestGuard from '~/components/guards/guest.guard';
import OAuth2 from '~/components/layouts/auth/Oauth2';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '~/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { useToast } from '~/components/ui/use-toast';
import { routeConfig } from '~/configs/route.config';
import { useAuth } from '~/contexts/auth.context';
import { ILink, useIRouter } from '~/locales/i18nNavigation';

export default function SignUpPage() {
  const { isLoading, signUpWithGoogle, signUpWithPassword } = useAuth();
  const { toast } = useToast();
  const router = useIRouter();
  const t = useTranslations('SignUp');

  // NOTE: place in ReactComponent to use intl -> refactor to use https://github.com/aiji42/zod-i18n
  const formSchema = useMemo(
    () =>
      z
        .object({
          email: z.string().email({ message: t('invalidEmail') }),
          password: z.string().min(8, { message: t('invalidPassword') }), // TODO: regex for strong password
          confirmPassword: z.string(),
        })
        .refine((data) => data.password === data.confirmPassword, {
          message: t('invalidConfirmPassword'),
          path: ['confirmPassword'],
        }),
    [t],
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '', password: '', confirmPassword: '' },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { isSuccess, type, message } = await signUpWithPassword(values.email, values.password);
    if (!isSuccess) {
      if (type === 'form') {
        form.setError('email', { message });
      } else if (type === 'toast') {
        toast({ title: t('failed'), description: message }); // TODO: localize msg
      }
    } else {
      toast({ variant: 'success', title: message });
      router.push(`${routeConfig.VERIFY_EMAIL}?to=${values.email}`);
    }
  }

  async function handleSignUpWithGoogle() {
    const { isSuccess, type, message } = await signUpWithGoogle();
    if (!isSuccess) {
      if (type === 'form') {
        form.setError('email', { message });
      } else if (type === 'toast') {
        toast({ variant: 'destructive', title: t('failed'), description: message }); // TODO: localize msg
      }
    } else {
      toast({ variant: 'success', title: t('success'), description: message });
      router.push(routeConfig.VERIFY_EMAIL);
    }
  }

  return (
    <GuestGuard>
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">{t('title')}</CardTitle>
          <CardDescription>{t('description')}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {/* OAuth2 */}
          <OAuth2 authMethod={handleSignUpWithGoogle} isLoading={isLoading} />

          {/* Separate */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">{t('otherSignUp')}</span>
            </div>
          </div>

          {/* Email & Password */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('email')}</FormLabel>
                    <FormControl>
                      <Input placeholder="m@example.com" {...field} disabled={isLoading} />
                    </FormControl>
                    {/* <FormDescription>This is your public display name.</FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('password')}</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('confirmPassword')}</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
                {t('submit')}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <Button asChild variant="link" className="flex-1">
            <ILink href={routeConfig.SIGN_IN}>{t('signInLink')}</ILink>
          </Button>
        </CardFooter>
      </Card>
    </GuestGuard>
  );
}
