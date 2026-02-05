// 图片处理工具

import imageCompression from 'browser-image-compression';
import type { Photo, PhotoCategory } from '../types';
import { generateId } from './helpers';
import { savePhotoBlob } from '../db/operations';

// 压缩配置
const THUMBNAIL_OPTIONS = {
  maxSizeMB: 0.1,
  maxWidthOrHeight: 300,
  useWebWorker: true
};

const FULL_IMAGE_OPTIONS = {
  maxSizeMB: 1,
  maxWidthOrHeight: 1920,
  useWebWorker: true
};

/**
 * 处理照片：压缩并生成缩略图
 * @param file 原始文件
 * @param category 照片分类
 * @returns Photo 对象
 */
export async function processPhoto(
  file: File,
  category: PhotoCategory
): Promise<Photo> {
  const photoId = generateId();
  const thumbId = `${photoId}-thumb`;

  try {
    // 压缩原图
    const compressedFile = await imageCompression(file, FULL_IMAGE_OPTIONS);
    const fullBlob = await compressedFile;

    // 生成缩略图
    const thumbnailFile = await imageCompression(file, THUMBNAIL_OPTIONS);
    const thumbBlob = await thumbnailFile;

    // 保存到 IndexedDB
    await savePhotoBlob(photoId, fullBlob);
    await savePhotoBlob(thumbId, thumbBlob);

    const photo: Photo = {
      id: photoId,
      category,
      blobPath: photoId,
      thumbBlobPath: thumbId,
      createdAt: Date.now()
    };

    return photo;
  } catch (error) {
    console.error('图片处理失败:', error);
    throw error;
  }
}

/**
 * 从文件选择器处理多个照片
 */
export async function processMultiplePhotos(
  files: FileList | File[],
  category: PhotoCategory
): Promise<Photo[]> {
  const fileArray = Array.from(files);
  const promises = fileArray.map(file => processPhoto(file, category));
  return Promise.all(promises);
}

/**
 * 创建照片的 Object URL（用于预览）
 */
export function createPhotoURL(blob: Blob): string {
  return URL.createObjectURL(blob);
}

/**
 * 释放 Object URL
 */
export function revokePhotoURL(url: string): void {
  URL.revokeObjectURL(url);
}

/**
 * 从摄像头拍照
 */
export async function capturePhoto(category: PhotoCategory): Promise<Photo> {
  return new Promise((resolve, reject) => {
    // 创建 file input
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment'; // 使用后置摄像头

    input.onchange = async (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        try {
          const photo = await processPhoto(target.files[0], category);
          resolve(photo);
        } catch (error) {
          reject(error);
        }
      } else {
        reject(new Error('未选择照片'));
      }
    };

    input.click();
  });
}

/**
 * 从相册选择照片
 */
export async function pickPhoto(category: PhotoCategory): Promise<Photo> {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = async (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        try {
          const photo = await processPhoto(target.files[0], category);
          resolve(photo);
        } catch (error) {
          reject(error);
        }
      } else {
        reject(new Error('未选择照片'));
      }
    };

    input.click();
  });
}
