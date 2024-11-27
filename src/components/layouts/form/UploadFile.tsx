import { LoaderIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';
import { StorageApi, StorageUploadResponse } from '~/apis/storage.api';
import { Button, buttonVariants } from '~/components/ui/button';
import { Input } from '~/components/ui/input';

interface Props {
  folder?: string;
  onUploadComplete?: (_file: StorageUploadResponse) => void;
  onUploadError?: (_error: any) => void;
}

const UploadFile = ({ folder = 'default', onUploadComplete, onUploadError }: Props) => {
  // const [file, setFile] = useState<File | null>(null);
  // const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // const handleFileChange1 = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const selectedFile = event.target.files?.[0];
  //   if (selectedFile) {
  //     setFile(selectedFile);
  //     const fileReader = new FileReader();
  //     fileReader.onload = () => {
  //       setPreviewUrl(fileReader.result as string);
  //     };
  //     fileReader.readAsDataURL(selectedFile);
  //   }
  // };

  // const handleUpload = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
  //   e.preventDefault();
  //   // Implement your upload logic here
  //   // console.log('Uploading file:', file);
  // };

  const [uploadResult, setUploadResult] = useState<StorageUploadResponse | null>();
  const [loading, setLoading] = useState(false);

  const t = useTranslations('Shared.upload');

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];

    if (selectedFile) {
      setLoading(true);
      if (uploadResult) {
        // await StorageApi.deleteFile(uploadResult.key); // TODO: uncomment this line
      }

      // upload new file
      const uploadResponse = await StorageApi.uploadFile(selectedFile, folder);
      if (uploadResponse.isSuccess) {
        setUploadResult(uploadResponse.data);
        if (onUploadComplete) onUploadComplete(uploadResponse.data);
      } else {
        if (onUploadError) onUploadError(uploadResponse.error);
      }
      setLoading(false);
    }
  };

  return !loading ? (
    <div
      className={buttonVariants({
        variant: 'outline',
        className: 'flex-center relative z-0 !cursor-pointer',
      })}
    >
      <Input id="file" type="file" onChange={handleFileChange} className="z-10 opacity-0" />
      <span className="absolute inset-0 p-2 text-center align-middle">{t('title')}</span>
    </div>
  ) : (
    <Button variant="outline" size="icon" disabled>
      <LoaderIcon className="size-4 animate-spin" />
    </Button>
  );
};

export default UploadFile;
