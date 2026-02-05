// 全局状态管理（使用 Zustand）

import { create } from 'zustand';
import type { Visit, Dimension, ScoreProfile, Home } from '../types';
import * as db from '../db/operations';
import { calculateTotalScore } from '../utils/scoring';

interface AppState {
  // 数据
  visits: Visit[];
  dimensions: Dimension[];
  currentProfile: ScoreProfile | null;
  home: Home | null;
  
  // UI状态
  isLoading: boolean;
  error: string | null;
  
  // 初始化
  initialize: () => Promise<void>;
  
  // Visits操作
  loadVisits: () => Promise<void>;
  addVisit: (data: Partial<Visit>) => Promise<Visit>;
  updateVisit: (id: string, data: Partial<Visit>) => Promise<void>;
  deleteVisit: (id: string) => Promise<void>;
  getVisit: (id: string) => Visit | undefined;
  
  // Dimensions操作
  loadDimensions: () => Promise<void>;
  addDimension: (dimension: Dimension) => Promise<void>;
  updateDimension: (id: string, data: Partial<Dimension>) => Promise<void>;
  
  // ScoreProfile操作
  loadCurrentProfile: () => Promise<void>;
  updateProfile: (id: string, data: Partial<ScoreProfile>) => Promise<void>;
  
  // 错误处理
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // 初始状态
  visits: [],
  dimensions: [],
  currentProfile: null,
  home: null,
  isLoading: false,
  error: null as string | null,

  // 初始化应用
  initialize: async () => {
    set({ isLoading: true });
    try {
      console.log('🔵 开始初始化数据库...');
      await db.initializeDB();
      console.log('✅ 数据库初始化完成');
      
      console.log('🔵 加载房源列表...');
      await get().loadVisits();
      console.log('✅ 房源列表加载完成');
      
      console.log('🔵 加载维度列表...');
      await get().loadDimensions();
      console.log('✅ 维度列表加载完成');
      
      console.log('🔵 加载权重方案...');
      await get().loadCurrentProfile();
      console.log('✅ 权重方案加载完成');
      
      console.log('🔵 加载全局配置...');
      const home = await db.getHome();
      console.log('✅ 全局配置:', home);
      
      set({ home, isLoading: false });
      console.log('🎉 应用初始化完成！');
    } catch (error) {
      console.error('❌ 初始化失败:', error);
      console.error('错误堆栈:', (error as Error).stack);
      set({ error: '应用初始化失败', isLoading: false });
    }
  },

  // 加载房源列表
  loadVisits: async () => {
    try {
      const visits = await db.getAllVisits();
      set({ visits, error: null });
    } catch (error) {
      console.error('加载房源失败:', error);
      // 加载失败不锁死页面
    }
  },

  // 添加房源
  addVisit: async (data) => {
    try {
      const newVisit = await db.createVisit(data);
      
      // 计算总分
      const { dimensions, currentProfile } = get();
      if (currentProfile) {
        const breakdown = calculateTotalScore(newVisit, dimensions, currentProfile);
        await db.updateVisit(newVisit.id, {
          computed: {
            totalScore: breakdown.totalScore,
            breakdown
          }
        });
      }
      
      // 重新加载列表
      await get().loadVisits();
      console.log('✅ 房源添加成功');
      return newVisit;
    } catch (error) {
      console.error('❗️ 添加房源失败:', error);
      throw error;
    }
  },

  // 更新房源
  updateVisit: async (id, data) => {
    try {
      await db.updateVisit(id, data);
      
      // 重新计算总分
      const { dimensions, currentProfile } = get();
      const visit = await db.getVisit(id);
      if (visit && currentProfile) {
        const breakdown = calculateTotalScore(visit, dimensions, currentProfile);
        await db.updateVisit(id, {
          computed: {
            totalScore: breakdown.totalScore,
            breakdown
          }
        });
      }
      
      // 重新加载列表并清除错误状态
      await get().loadVisits();
      console.log('✅ 房源更新成功');
    } catch (error) {
      console.error('❗️ 更新房源失败:', error);
      throw error;
    }
  },

  // 删除房源
  deleteVisit: async (id) => {
    try {
      await db.deleteVisit(id);
      set(state => ({
        visits: state.visits.filter(v => v.id !== id),
        error: null
      }));
    } catch (error) {
      console.error('删除房源失败:', error);
      throw error;
    }
  },

  // 获取单个房源
  getVisit: (id) => {
    return get().visits.find(v => v.id === id);
  },

  // 加载维度列表
  loadDimensions: async () => {
    try {
      const dimensions = await db.getAllDimensions();
      set({ dimensions });
    } catch (error) {
      console.error('加载维度失败:', error);
    }
  },

  // 添加自定义维度
  addDimension: async (dimension) => {
    try {
      await db.createDimension(dimension);
      set(state => ({ dimensions: [...state.dimensions, dimension] }));
    } catch (error) {
      console.error('添加维度失败:', error);
      throw error;
    }
  },

  // 更新维度
  updateDimension: async (id, data) => {
    try {
      await db.updateDimension(id, data);
      set(state => ({
        dimensions: state.dimensions.map(d => 
          d.id === id ? { ...d, ...data } : d
        )
      }));
    } catch (error) {
      console.error('更新维度失败:', error);
      throw error;
    }
  },

  // 加载当前权重方案
  loadCurrentProfile: async () => {
    try {
      const home = await db.getHome();
      if (home?.scoreProfileId) {
        const profile = await db.getScoreProfile(home.scoreProfileId);
        set({ currentProfile: profile || null });
      }
    } catch (error) {
      console.error('加载权重方案失败:', error);
    }
  },

  // 更新权重方案
  updateProfile: async (id, data) => {
    try {
      await db.updateScoreProfile(id, data);
      await get().loadCurrentProfile();
      
      // 权重变更后重新计算所有房源的总分
      const { visits, dimensions, currentProfile } = get();
      if (currentProfile) {
        for (const visit of visits) {
          const breakdown = calculateTotalScore(visit, dimensions, currentProfile);
          await db.updateVisit(visit.id, {
            computed: {
              totalScore: breakdown.totalScore,
              breakdown
            }
          });
        }
        // 重新加载列表
        await get().loadVisits();
      }
    } catch (error) {
      console.error('更新权重方案失败:', error);
      throw error;
    }
  },

  // 设置错误
  setError: (error) => set({ error }),
  
  // 清除错误
  clearError: () => set({ error: null })
}));
