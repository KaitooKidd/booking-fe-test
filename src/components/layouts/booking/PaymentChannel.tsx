import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Dispatch, SetStateAction } from 'react';
import { Label } from '~/components/ui/label';
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group';
import { Tooltip, TooltipContent, TooltipTrigger } from '~/components/ui/tooltip';
import { cn } from '~/utils/ui.util';

const paymentChannels = [
  {
    id: 'vn_pay',
    name: 'VN Pay',
    image: '/images/vn_pay.png',
    isEnabled: true,
  },
  {
    id: 'stripe',
    name: 'Stripe',
    image: '/images/stripe.png',
    isEnabled: false,
  },
  // {
  //   id: 'momo',
  //   name: 'Momo',
  //   image: '/images/momo.png',
  //   isEnabled: false,
  // },
  {
    id: 'paypal',
    name: 'Paypal',
    image: '/images/paypal.png',
    isEnabled: false,
  },
];

interface PaymentChannelProps {
  channel: string;
  setChannel: Dispatch<SetStateAction<string>>;
}

export default function PaymentChannel({ channel, setChannel }: PaymentChannelProps) {
  const t = useTranslations('BookRoom.payment');

  return (
    <div>
      <h3 className="mb-6 text-xl font-semibold">{t('title')}</h3>
      <RadioGroup defaultValue={channel} className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {paymentChannels.map((channel) => (
          <Tooltip key={channel.id}>
            <TooltipTrigger asChild>
              <div className="curser-pointer flex-center relative space-x-5 rounded-md border border-transparent p-2 hover:border-primary/30 has-[button[data-state=checked]]:border-indigo-500 has-[button:disabled]:opacity-50">
                <RadioGroupItem
                  value={channel.id}
                  id={channel.id}
                  className="hidden"
                  disabled={!channel.isEnabled}
                  onChange={() => setChannel(channel.id)}
                />
                <Label htmlFor={channel.id} className="flex-center relative !m-0 flex-col">
                  <div className="aspect-square h-44 overflow-hidden">
                    <Image
                      src={channel.image}
                      alt={channel.name}
                      priority
                      fill
                      className="cursor-pointer object-contain"
                    />
                  </div>

                  {/* <div className={cn('text-lg font-semibold')}>
                    {channel.name}
                    {!channel.isEnabled && <span className="text-sm text-muted-foreground"> ({t('pending')})</span>}
                  </div> */}
                </Label>
                <span
                  className={cn(
                    'absolute right-2 top-2 size-2 rounded-full bg-green-500',
                    !channel.isEnabled && 'bg-red-500',
                  )}
                ></span>
              </div>
            </TooltipTrigger>
            <TooltipContent>{channel.name}</TooltipContent>
          </Tooltip>
        ))}
      </RadioGroup>
    </div>
  );
}
