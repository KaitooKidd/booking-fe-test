import { LoaderIcon, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';
import { StorageApi } from '~/apis/storage.api';
import { Button } from '~/components/ui/button';
import { cn } from '~/utils/ui.util';

type PartialStorageResult = {
  url: string;
  key?: string | null;
};

interface UploadMultipleFilesProps {
  initialFiles?: PartialStorageResult[];
  onUploadSuccess?: (file: PartialStorageResult[]) => void;
  onUploadError?: (error: any) => void;
  onRemoveSuccess?: (file: PartialStorageResult[]) => void;
  onRemoveError?: (error: any) => void;
}

const UploadMultipleFiles: React.FC<UploadMultipleFilesProps> = ({
  initialFiles = [],
  onUploadSuccess,
  onUploadError,
  onRemoveSuccess,
  onRemoveError,
}) => {
  const [previews, setPreviews] = useState<string[]>(initialFiles.map((item) => item.url));
  const [uploadedFiles, setUploadedFiles] = useState<PartialStorageResult[]>(initialFiles);
  const [isLoading, setIsLoading] = useState(false);

  const t = useTranslations('Shared.uploadMultiple');

  useEffect(() => {
    setPreviews(initialFiles.map((item) => item.url));
    setUploadedFiles(initialFiles);
  }, [initialFiles]);

  const handleAddFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(event.target.files ?? []);
    const objectUrls: string[] = newFiles.map((file) => URL.createObjectURL(file));
    setPreviews((prevPreviews) => [...prevPreviews, ...objectUrls]);
    event.target.value = '';
    handleUpload(newFiles);
    return () => {
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  };

  const handleUpload = async (files: File[]) => {
    setIsLoading(true);
    const response = await StorageApi.uploadMultipleFiles(files, 'hotels');
    if (response.isSuccess) {
      const newUploadedFiles = [...uploadedFiles, ...response.data];
      setUploadedFiles(newUploadedFiles);
      onUploadSuccess?.(newUploadedFiles);
    } else {
      onUploadError?.(response.error);
    }
    setIsLoading(false);
  };

  const handleRemove = (index: number) => {
    setIsLoading(true);

    const updatedPreviews = [...previews];
    updatedPreviews.splice(index, 1);
    setPreviews(updatedPreviews);

    const updatedUploadedFiles = [...uploadedFiles];
    const removedData = updatedUploadedFiles.splice(index, 1)[0];
    setUploadedFiles(updatedUploadedFiles);

    if (removedData) {
      const isSuccess = true; // TODO: api
      if (isSuccess) {
        onRemoveSuccess?.(updatedUploadedFiles);
      } else {
        onRemoveError?.(new Error('Failed to remove image'));
      }
    }
    setIsLoading(false);
  };

  const handleClear = () => {
    setIsLoading(true);
    // TODO: remove all images
    setPreviews([]);
    setUploadedFiles([]);
    setIsLoading(false);
  };

  return (
    <div className={cn('w-full')}>
      {/* <Input id="select-multiple-files" type="file" multiple onChange={handleSelectFiles} /> */}
      <div className="mb-4 flex items-center justify-end gap-2 px-4">
        <Button className="relative z-0" variant="outline" disabled={isLoading}>
          {isLoading ? (
            <>
              <LoaderIcon className="mr-2 size-4 animate-spin" />
              {t('handling')}
            </>
          ) : (
            <span>{t('title')}</span>
          )}
          <input
            id="add-multiple-files"
            type="file"
            multiple
            onChange={handleAddFiles}
            className="absolute inset-0 z-10 h-full w-full cursor-pointer bg-transparent opacity-0"
          />
        </Button>
        {previews.length > 0 && (
          <Button className="ml-4" variant="outline" onClick={handleClear} disabled={isLoading}>
            {t('clear')}
          </Button>
        )}
      </div>
      {previews.length > 0 ? (
        <div className="grid max-h-[500px] grid-cols-2 gap-4 overflow-y-auto md:grid-cols-3">
          {previews.map((preview, index) => (
            <div key={index} className="relative">
              <img src={preview} alt={`Preview ${index}`} className="h-auto max-w-full rounded-lg object-cover" />
              <Button
                disabled={isLoading}
                onClick={(e) => {
                  e.preventDefault();
                  handleRemove(index);
                }}
                variant="outline"
                size="icon"
                className={cn(
                  'absolute right-2 top-2 size-5 cursor-pointer rounded-full bg-background/80 fill-primary p-1 hover:bg-background',
                  isLoading && 'animate-spin',
                )}
              >
                <X />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-4 flex w-full flex-col items-center rounded border-2 border-dashed border-primary/50 p-12">
          <p>{t('noImage')}</p>
        </div>
      )}
    </div>
  );
};

export default UploadMultipleFiles;
