import { ArrowBigRight } from 'lucide-react';
import { buttonVariants } from '~/components/ui/button';
import { ILink } from '~/locales/i18nNavigation';

interface GuardDenyProps {
  title: string;
  link: string;
  linkText: string;
}

export default function GuardDeny({ title, link, linkText }: GuardDenyProps) {
  return (
    <div className="flex-center fixed inset-0 z-50 flex-col gap-6 bg-background">
      <h3 className="text-2xl font-bold">{title}</h3>
      <ILink href={link} className={buttonVariants({ variant: 'default' })}>
        {linkText} <ArrowBigRight className="ml-2 size-5" />
      </ILink>
    </div>
  );
}
