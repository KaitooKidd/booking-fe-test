import { Cigarette, KeyRound, PawPrint } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { HotelSchema } from '~/apis/hotel.api';
import { Switch } from '~/components/ui/switch';

interface HotelDetailRulesProps {
  hotel: HotelSchema;
}

export default function HotelDetailRules({ hotel }: HotelDetailRulesProps) {
  const t = useTranslations();

  return (
    <>
      <div aria-label="allow-rules" className="grid grid-cols-2 gap-x-20 gap-y-10">
        <div className="flex h-10 items-center">
          <PawPrint className="mr-2" size={18} />
          <span>{t('HotelDetails.rules.pets')}</span>
          <Switch id="pets" checked={hotel.allowPets} className="ml-auto !cursor-default" />
        </div>
        <div className="flex h-10 items-center">
          <Cigarette className="mr-2" size={18} />
          <span>{t('HotelDetails.rules.smoking')}</span>
          <Switch id="smoking" checked={hotel.allowSmoking} className="ml-auto !cursor-default" />
        </div>
      </div>
      <div aria-label="time-rule" className="mt-2 space-y-2">
        <div className="flex items-center">
          <p className="flex w-40 items-center font-medium">
            <KeyRound size={18} className="mr-2" />
            {t('HotelDetails.rules.checkInTitle')}
          </p>
          <p>
            {hotel.timeRules.checkIn.start
              ? hotel.timeRules.checkIn.end
                ? t.rich('HotelDetails.rules.checkInBetween', {
                    start: hotel.timeRules.checkIn.start,
                    end: hotel.timeRules.checkIn.end,
                    highline: (value) => <span className="font-medium italic underline">{value}</span>,
                  })
                : t.rich('HotelDetails.rules.checkInAfter', {
                    start: hotel.timeRules.checkIn.start,
                    highline: (value) => <span className="font-medium italic underline">{value}</span>,
                  })
              : t.rich('HotelDetails.rules.checkIn', {
                  highline: (value) => <span className="font-medium italic underline">{value}</span>,
                })}
          </p>
        </div>
        <div className="flex items-center">
          <p className="flex w-40 items-center font-medium">
            <KeyRound size={18} className="mr-2" />
            {t('HotelDetails.rules.checkOutTitle')}
          </p>
          <p>
            {hotel.timeRules.checkOut.end
              ? hotel.timeRules.checkOut.start
                ? t.rich('HotelDetails.rules.checkOutBetween', {
                    start: hotel.timeRules.checkOut.start,
                    end: hotel.timeRules.checkOut.end,
                    highline: (value) => <span className="font-medium italic underline">{value}</span>,
                  })
                : t.rich('HotelDetails.rules.checkOutBefore', {
                    end: hotel.timeRules.checkOut.end,
                    highline: (value) => <span className="font-medium italic underline">{value}</span>,
                  })
              : t.rich('HotelDetails.rules.checkOut', {
                  highline: (value) => <span className="font-medium italic underline">{value}</span>,
                })}
          </p>
        </div>
      </div>
    </>
  );
}
