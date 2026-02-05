// 数据库操作层

import { db } from './index';
import type { Visit, Dimension, ScoreProfile, Home } from '../types';
import { DEFAULT_DIMENSIONS, DEFAULT_SCORE_PROFILE } from '../types/dimensions';
import { generateId } from '../utils/helpers';

// 数据库版本号（更新维度时递增）
const DB_VERSION = 3;

// 请求持久化存储权限（防止数据丢失）
async function requestPersistentStorage() {
  if (navigator.storage && navigator.storage.persist) {
    const isPersisted = await navigator.storage.persisted();
    
    if (!isPersisted) {
      const result = await navigator.storage.persist();
      if (result) {
        console.log('✅ 持久化存储已启用，数据不会丢失');
      } else {
        console.warn('⚠️ 未能启用持久化存储，数据可能被清理');
      }
    } else {
      console.log('✅ 已启用持久化存储');
    }
  }
}

// ============ 初始化数据库 ============
export async function initializeDB() {
  // 第一步：请求持久化存储
  await requestPersistentStorage();
  
  const homeCount = await db.home.count();
  
  if (homeCount === 0) {
    // 首次初始化：创建全部默认数据
    const defaultHome: Home = {
      id: 'main',
      workLocations: [],
      activeWorkLocationId: '',
      unitSystem: 'metric',
      scoreProfileId: 'balanced',
      defaultVisibleDimensions: DEFAULT_DIMENSIONS
        .filter(d => d.defaultVisible)
        .map(d => d.id),
      dbVersion: DB_VERSION  // 记录版本
    };
    await db.home.add(defaultHome);
    await db.dimensions.bulkAdd(DEFAULT_DIMENSIONS);
    await db.scoreProfiles.add(DEFAULT_SCORE_PROFILE);
    console.log('✅ 数据库首次初始化完成');
  } else {
    // 检查版本号，如果不匹配则强制更新
    const home = await db.home.get('main');
    const currentVersion = home?.dbVersion || 1;
    
    if (currentVersion < DB_VERSION) {
      console.log(`🔄 检测到数据库版本更新 (${currentVersion} → ${DB_VERSION}), 开始更新...`);
      await updateDimensionsAndProfiles();
      
      // 更新版本号
      await db.home.update('main', { dbVersion: DB_VERSION });
      console.log(`✅ 数据库已更新到版本 ${DB_VERSION}`);
    }
  }
}

// 更新维度和权重配置（增量更新）
async function updateDimensionsAndProfiles() {
  // 1. 更新维度：添加缺失的维度
  const existingDimensions = await db.dimensions.toArray();
  const existingIds = new Set(existingDimensions.map(d => d.id));
  
  const newDimensions = DEFAULT_DIMENSIONS.filter(d => !existingIds.has(d.id));
  if (newDimensions.length > 0) {
    await db.dimensions.bulkAdd(newDimensions);
    console.log(`✅ 添加了 ${newDimensions.length} 个新维度:`, newDimensions.map(d => d.name));
  }
  
  // 2. 更新权重配置：合并新的默认权重
  const balancedProfile = await db.scoreProfiles.get('balanced');
  if (balancedProfile) {
    const updatedProfile = {
      ...balancedProfile,
      weights: {
        ...balancedProfile.weights,
        ...DEFAULT_SCORE_PROFILE.weights  // 合并新权重
      },
      enabled: {
        ...balancedProfile.enabled,
        ...DEFAULT_SCORE_PROFILE.enabled  // 合并新维度启用状态
      },
      updatedAt: Date.now()
    };
    await db.scoreProfiles.update('balanced', updatedProfile);
    console.log('✅ 权重配置已更新');
  }
  
  // 3. 更新 home 的 defaultVisibleDimensions
  const home = await db.home.get('main');
  if (home) {
    const newVisibleDimensions = DEFAULT_DIMENSIONS
      .filter(d => d.defaultVisible)
      .map(d => d.id);
    
    await db.home.update('main', {
      defaultVisibleDimensions: newVisibleDimensions
    });
    console.log('✅ 默认可见维度已更新');
  }
}

// ============ Visit (房源) 操作 ============

export async function createVisit(data: Partial<Visit>): Promise<Visit> {
  const visits = await db.visits.toArray();
  const maxIndexNo = visits.length > 0 
    ? Math.max(...visits.map(v => parseInt(v.indexNo))) 
    : 0;
  const newIndexNo = (maxIndexNo + 1).toString().padStart(2, '0');

  const visit: Visit = {
    id: generateId(),
    indexNo: newIndexNo,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    title: data.title || `房源 ${newIndexNo}`,
    community: data.community || '',
    status: data.status || 'none',
    photos: [],
    voiceMemos: [],
    values: {},
    computed: {},
    ...data
  };

  await db.visits.add(visit);
  return visit;
}

export async function getVisit(id: string): Promise<Visit | undefined> {
  return await db.visits.get(id);
}

export async function getAllVisits(): Promise<Visit[]> {
  return await db.visits.toArray();
}

export async function updateVisit(id: string, data: Partial<Visit>): Promise<void> {
  await db.visits.update(id, {
    ...data,
    updatedAt: Date.now()
  });
}

export async function deleteVisit(id: string): Promise<void> {
  const visit = await db.visits.get(id);
  if (!visit) return;

  // 删除关联的照片 Blob
  for (const photo of visit.photos) {
    await db.photoBlobs.delete(photo.blobPath);
    await db.photoBlobs.delete(photo.thumbBlobPath);
  }

  // 删除关联的音频 Blob
  for (const memo of visit.voiceMemos) {
    await db.audioBlobs.delete(memo.audioBlobPath);
  }

  await db.visits.delete(id);
}

// ============ Photo 操作 ============

export async function savePhotoBlob(id: string, blob: Blob): Promise<void> {
  await db.photoBlobs.put({ id, blob });
}

export async function getPhotoBlob(id: string): Promise<Blob | undefined> {
  const record = await db.photoBlobs.get(id);
  return record?.blob;
}

export async function deletePhotoBlob(id: string): Promise<void> {
  await db.photoBlobs.delete(id);
}

// ============ Audio 操作 ============

export async function saveAudioBlob(id: string, blob: Blob): Promise<void> {
  await db.audioBlobs.put({ id, blob });
}

export async function getAudioBlob(id: string): Promise<Blob | undefined> {
  const record = await db.audioBlobs.get(id);
  return record?.blob;
}

export async function deleteAudioBlob(id: string): Promise<void> {
  await db.audioBlobs.delete(id);
}

// ============ Dimension 操作 ============

export async function getAllDimensions(): Promise<Dimension[]> {
  return await db.dimensions.toArray();
}

export async function getDimension(id: string): Promise<Dimension | undefined> {
  return await db.dimensions.get(id);
}

export async function createDimension(dimension: Dimension): Promise<void> {
  await db.dimensions.add(dimension);
}

export async function updateDimension(id: string, data: Partial<Dimension>): Promise<void> {
  await db.dimensions.update(id, data);
}

export async function deleteDimension(id: string): Promise<void> {
  await db.dimensions.delete(id);
}

// ============ ScoreProfile 操作 ============

export async function getAllScoreProfiles(): Promise<ScoreProfile[]> {
  return await db.scoreProfiles.toArray();
}

export async function getScoreProfile(id: string): Promise<ScoreProfile | undefined> {
  return await db.scoreProfiles.get(id);
}

export async function createScoreProfile(profile: ScoreProfile): Promise<void> {
  await db.scoreProfiles.add(profile);
}

export async function updateScoreProfile(id: string, data: Partial<ScoreProfile>): Promise<void> {
  await db.scoreProfiles.update(id, {
    ...data,
    updatedAt: Date.now()
  });
}

// ============ Home 操作 ============

export async function getHome(): Promise<Home | undefined> {
  const homes = await db.home.toArray();
  return homes[0];
}

export async function updateHome(data: Partial<Home>): Promise<void> {
  const homes = await db.home.toArray();
  if (homes.length > 0) {
    await db.home.update((homes[0] as any).id, data);
  }
}
