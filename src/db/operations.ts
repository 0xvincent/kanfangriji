// 数据库操作层

import { db } from './index';
import type { Visit, Dimension, ScoreProfile, Home } from '../types';
import { DEFAULT_DIMENSIONS, DEFAULT_SCORE_PROFILE } from '../types/dimensions';
import { generateId } from '../utils/helpers';

// ============ 初始化数据库 ============
export async function initializeDB() {
  // 检查是否已初始化
  const homeCount = await db.home.count();
  if (homeCount > 0) return;

  // 初始化全局配置
  const defaultHome: Home = {
    id: 'main',
    workLocations: [],
    activeWorkLocationId: '',
    unitSystem: 'metric',
    scoreProfileId: 'balanced',
    defaultVisibleDimensions: DEFAULT_DIMENSIONS
      .filter(d => d.defaultVisible)
      .map(d => d.id)
  };
  await db.home.add(defaultHome);

  // 初始化维度库
  await db.dimensions.bulkAdd(DEFAULT_DIMENSIONS);

  // 初始化默认权重方案
  await db.scoreProfiles.add(DEFAULT_SCORE_PROFILE);

  console.log('✅ 数据库初始化完成');
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
