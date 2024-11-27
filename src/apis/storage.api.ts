import { uploadFile2 } from '~/apis/upload.api';
import { axiosPrivateInstance } from './instances/axios.instance';

const StorageApiEndpoint = {
  upload: '/storage/upload/single',
  uploadMultiple: '/storage/upload/multiple',
  clone: '/storage/upload/url',
  delete: (key: string) => `/storage/${key}`,
};

export type StorageUploadResponse = {
  url: string;
  key: string;
};

export const StorageApi = {
  async uploadFile(file: File, folder: string) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    // return await axiosPrivateInstance.post<StorageUploadResponse>(StorageApiEndpoint.upload, formData, {
    //   headers: { 'Content-Type': 'multipart/form-data' },
    // });
    try {
      const response = await uploadFile2(formData);
      return { isSuccess: true, data: response };
    } catch (error) {
      return { isSuccess: false, error };
    }
  },

  async uploadMultipleFiles(files: File[], folder: string) {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    formData.append('folder', folder);
    return await axiosPrivateInstance.post<StorageUploadResponse[]>(StorageApiEndpoint.uploadMultiple, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  async deleteFile(key: string) {
    return await axiosPrivateInstance.delete<boolean>(StorageApiEndpoint.delete(encodeURIComponent(key)));
  },
};
