import { XIcon } from 'lucide-react';
import { useState } from 'react';
import { ProfileInfo } from '~/apis/profile.api';
import { StorageApi, StorageUploadResponse } from '~/apis/storage.api';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Input } from '~/components/ui/input';
import { cn } from '~/utils/ui.util';

interface ProfileAvatarProps {
  data: ProfileInfo;
  onUploadSuccess?: (value: StorageUploadResponse) => void;
  onUploadError?: (error: any) => void;
}

export default function ProfileAvatar({ data, onUploadSuccess, onUploadError }: ProfileAvatarProps) {
  const [previewAvatar, setPreviewAvatar] = useState<string>(data.avatar ?? '');
  const [loading, setLoading] = useState(false);

  async function handleChangeAvatar(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const url = URL.createObjectURL(file);
    setPreviewAvatar(url);

    const response = await StorageApi.uploadFile(file, 'avatars'); // TODO: delete old avatar from storages
    console.log(response);
    if (response.isSuccess) {
      onUploadSuccess?.(response.data);
    } else {
      onUploadError?.(response.error);
    }
    setLoading(false);
    // event.target.value = '';

    return () => URL.revokeObjectURL(url);
  }

  function resetPreviewAvatar() {
    setPreviewAvatar(data.avatar ?? '');
  }

  return (
    <div aria-label="avatar" className="relative z-0">
      <Avatar className="size-28 rounded-full">
        <AvatarImage src={previewAvatar} alt="avatar" className="object-cover" />
        <AvatarFallback>{data.name.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <Input
        type="file"
        accept="image/*"
        className="absolute inset-0 z-10 h-full w-full cursor-pointer !opacity-0"
        onChange={handleChangeAvatar}
        disabled={loading}
      />
      <XIcon
        onClick={resetPreviewAvatar}
        className={cn(
          'absolute right-0 top-0 z-20 cursor-pointer rounded-full bg-background/50 fill-foreground/50 p-0.5 invert',
          !previewAvatar || previewAvatar === data.avatar ? 'hidden' : 'block',
        )}
      />
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-gray-700 bg-opacity-50">
          <svg
            className="h-5 w-5 animate-spin text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V2.5"></path>
          </svg>
        </div>
      )}
    </div>
  );
}
