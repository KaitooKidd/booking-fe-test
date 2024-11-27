import { Icons } from '~/components/common/Icons';
import { routeConfig } from '~/configs/route.config';
import { ILink } from '~/locales/i18nNavigation';

export default function Logo() {
  return (
    <ILink href={routeConfig.HOME} className="flex cursor-pointer items-center space-x-1">
      <Icons.logo className="size-8 lg:size-10" />
      <span className="font-bold max-sm:text-sm">
        <span className="text-red-500">UET</span> Booking
      </span>
    </ILink>
  );
}
