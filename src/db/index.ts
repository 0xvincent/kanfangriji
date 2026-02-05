// IndexedDB 数据库配置（使用 Dexie.js）

import Dexie, { type Table } from 'dexie';
import type { Visit, Dimension, ScoreProfile, Home, Photo, VoiceMemo } from '../types';

export class HouseNotesDB extends Dexie {
  visits!: Table<Visit>;
  dimensions!: Table<Dimension>;
  scoreProfiles!: Table<ScoreProfile>;
  home!: Table<Home>;
  // Blob 存储（照片和音频）
  photoBlobs!: Table<{ id: string; blob: Blob }>;
  audioBlobs!: Table<{ id: string; blob: Blob }>;

  constructor() {
    super('HouseNotesDB');
    
    this.version(1).stores({
      visits: 'id, indexNo, createdAt, updatedAt, status, *photos, *voiceMemos',
      dimensions: 'id, group, defaultVisible, defaultEnabled',
      scoreProfiles: 'id, updatedAt',
      home: 'id',
      photoBlobs: 'id',
      audioBlobs: 'id'
    });
  }
}

export const db = new HouseNotesDB();
