// 照片分类组件

import { useState, useEffect } from 'react';
import type { Photo, PhotoCategory } from '../types';
import { capturePhoto, pickPhoto } from '../utils/imageProcessor';
import { getPhotoBlob, deletePhotoBlob } from '../db/operations';
import { createPhotoURL, revokePhotoURL } from '../utils/imageProcessor';

interface PhotoSectionProps {
  category: PhotoCategory;
  label: string;
  photos: Photo[];
  onPhotosChange: (photos: Photo[]) => void;
}

export default function PhotoSection({ category, label, photos, onPhotosChange }: PhotoSectionProps) {
  const [photoUrls, setPhotoUrls] = useState<Record<string, string>>({});
  const categoryPhotos = photos.filter(p => p.category === category);

  // 加载照片URL
  useEffect(() => {
    const loadPhotoUrls = async () => {
      const urls: Record<string, string> = {};
      for (const photo of categoryPhotos) {
        const blob = await getPhotoBlob(photo.thumbBlobPath);
        if (blob) {
          urls[photo.id] = createPhotoURL(blob);
        }
      }
      setPhotoUrls(urls);
    };
    
    loadPhotoUrls();
    
    // 清理函数
    return () => {
      Object.values(photoUrls).forEach(url => revokePhotoURL(url));
    };
  }, [categoryPhotos.length]);

  const handleAddPhoto = async (method: 'camera' | 'gallery') => {
    try {
      const newPhoto = method === 'camera' 
        ? await capturePhoto(category)
        : await pickPhoto(category);
      
      onPhotosChange([...photos, newPhoto]);
    } catch (error) {
      console.error('添加照片失败:', error);
    }
  };

  const handleDeletePhoto = async (photo: Photo) => {
    try {
      await deletePhotoBlob(photo.blobPath);
      await deletePhotoBlob(photo.thumbBlobPath);
      onPhotosChange(photos.filter(p => p.id !== photo.id));
      
      // 清理URL
      if (photoUrls[photo.id]) {
        revokePhotoURL(photoUrls[photo.id]);
      }
    } catch (error) {
      console.error('删除照片失败:', error);
    }
  };

  return (
    <div className="border border-border-line rounded-lg p-m">
      <div className="flex justify-between items-center mb-s">
        <span className="text-body">{label}</span>
        <span className="text-secondary">{categoryPhotos.length} 张</span>
      </div>

      {/* 照片缩略图列表 */}
      {categoryPhotos.length > 0 && (
        <div className="flex gap-s mb-s overflow-x-auto pb-s">
          {categoryPhotos.map((photo) => (
            <div key={photo.id} className="relative flex-shrink-0">
              <img
                src={photoUrls[photo.id]}
                alt={label}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <button
                onClick={() => handleDeletePhoto(photo)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 添加按钮 */}
      <div className="flex gap-s">
        <button
          onClick={() => handleAddPhoto('camera')}
          className="flex-1 text-primary text-secondary py-s border border-border-line rounded-lg hover:bg-gray-50"
        >
          📷 拍照
        </button>
        <button
          onClick={() => handleAddPhoto('gallery')}
          className="flex-1 text-primary text-secondary py-s border border-border-line rounded-lg hover:bg-gray-50"
        >
          🖼️ 相册
        </button>
      </div>
    </div>
  );
}
