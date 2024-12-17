'use server';
import { v2 as cloudinary } from 'cloudinary';
import { StorageUploadResponse } from '~/apis/storage.api';

// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Hàm tạo đường dẫn file
const generateFilePath = (originalname: string, folder: string, prefix: string): string => {
  return `${prefix ? `${prefix}-` : ''}${Date.now()}-${originalname.replace(/\s/g, '_')}`;
};

// Hàm upload file lên Cloudinary
export const uploadFile2 = async (formData: FormData, prefix = ''): Promise<StorageUploadResponse | null> => {
  const file = formData.get('file') as File;
  const folder = formData.get('folder') as string;
  if (!file) throw new Error('File is required');
  // Kiểm tra file có nội dung
  if (file.size === 0) {
    return Promise.resolve(null);
  }
  const filePath = generateFilePath(file.name, folder, prefix);
  // Đọc nội dung file thành Buffer
  const arrayBuffer = await file.arrayBuffer();

  return new Promise((resolve, reject) => {
    const buffer = Buffer.from(arrayBuffer);
    cloudinary.uploader
      .upload_stream({ folder: folder, public_id: filePath }, (error, result) => {
        if (error) {
          reject(error);
        } else if (result) {
          resolve({ key: result.public_id, url: result.secure_url });
        } else {
          reject(new Error('Upload failed without an error message.'));
        }
      })
      .end(buffer);
  });
};

export const uploadMultiFiles = async (formData: FormData, prefix = ''): Promise<StorageUploadResponse[] | null> => {
  const files = formData.getAll('files') as File[];
  const folder = formData.get('folder') as string;

  if (!files || files.length === 0) throw new Error('Files are required');

  const validFiles = files.filter((file) => file.size > 0);
  if (validFiles.length === 0) {
    return Promise.resolve(null);
  }

  const uploadPromises = validFiles.map(async (file) => {
    const filePath = generateFilePath(file.name, folder, prefix);
    const arrayBuffer = await file.arrayBuffer();

    return new Promise<StorageUploadResponse>((resolve, reject) => {
      const buffer = Buffer.from(arrayBuffer);
      cloudinary.uploader
        .upload_stream({ folder: folder, public_id: filePath }, (error, result) => {
          if (error) {
            reject(error);
          } else if (result) {
            resolve({ key: result.public_id, url: result.secure_url });
          } else {
            reject(new Error('Upload failed without an error message.'));
          }
        })
        .end(buffer);
    });
  });

  try {
    const uploadResults = await Promise.all(uploadPromises);
    return uploadResults;
  } catch (error) {
    console.error('Error uploading files:', error);
    throw error;
  }
};
