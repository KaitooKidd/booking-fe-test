import { Icons } from '~/components/common/Icons';
import { Button } from '~/components/ui/button';

interface OAuth2Props {
  authMethod: () => Promise<void>;
  isLoading: boolean;
}

export default function OAuth2({ authMethod, isLoading }: OAuth2Props) {
  return (
    <div className="grid grid-cols-2 gap-6">
      <Button variant="outline" className="hover:!cursor-not-allowed" disabled={isLoading}>
        <Icons.facebookColorful className="mr-2 h-6 w-6" />
        Facebook
      </Button>
      <Button variant="outline" onClick={authMethod} disabled={isLoading}>
        <Icons.googleColorful className="mr-2 h-6 w-6" />
        Google
      </Button>
    </div>
  );
}
