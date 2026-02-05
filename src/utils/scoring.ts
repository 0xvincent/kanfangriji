// 评分系统核心逻辑

import type { 
  Dimension, 
  DimensionValue, 
  ScoreProfile, 
  ScoreBreakdown,
  Visit 
} from '../types';
import { clamp } from './helpers';

/**
 * 将维度值转换为 0-100 的分数
 */
export function dimensionValueToScore(
  value: DimensionValue,
  dimension: Dimension
): number | null {
  if (value === null || value === undefined) {
    return null; // 未填写不参与计算
  }

  const { type, scoring } = dimension;

  switch (type) {
    case 'rating':
      // rating: 0-10 → 0-100
      return (value as number) / 10 * 100;

    case 'boolean':
      // boolean: true=100, false=0, null=50
      if (typeof value === 'boolean') {
        return value ? 100 : 0;
      }
      // 不清楚的情况
      return scoring.fixedMap?.['null'] ?? 50;

    case 'select':
    case 'text':
      // 使用固定映射
      const stringValue = value as string;
      return scoring.fixedMap?.[stringValue] ?? 50;

    case 'number':
      const numValue = value as number;
      
      if (scoring.type === 'linear') {
        // 越大越好：(value - min) / (max - min) * 100
        const min = scoring.min ?? 0;
        const max = scoring.max ?? 100;
        const clamped = clamp(numValue, min, max);
        return ((clamped - min) / (max - min)) * 100;
      } else if (scoring.type === 'inverted') {
        // 越小越好：(max - value) / (max - min) * 100
        const min = scoring.min ?? 0;
        const max = scoring.max ?? 100;
        const clamped = clamp(numValue, min, max);
        return ((max - clamped) / (max - min)) * 100;
      }
      return 50; // 默认中间值

    default:
      return null;
  }
}

/**
 * 计算总分
 */
export function calculateTotalScore(
  visit: Visit,
  dimensions: Dimension[],
  profile: ScoreProfile
): ScoreBreakdown {
  const contributions: ScoreBreakdown['contributions'] = [];
  let totalWeightedScore = 0;
  let totalWeight = 0;

  for (const dimension of dimensions) {
    // 只计算启用的维度
    if (!profile.enabled[dimension.id]) continue;

    const value = visit.values[dimension.id];
    const score = dimensionValueToScore(value, dimension);
    
    // 未填写的维度不参与计算
    if (score === null) continue;

    const weight = profile.weights[dimension.id] || 0;
    const contribution = (score * weight) / 100;

    contributions.push({
      dimensionId: dimension.id,
      dimensionName: dimension.name,
      rawValue: value,
      score,
      weight,
      contribution
    });

    totalWeightedScore += contribution;
    totalWeight += weight;
  }

  // 计算最终总分（0-100）
  const totalScore = totalWeight > 0 
    ? Math.round((totalWeightedScore / totalWeight) * 100)
    : 0;

  // 按贡献值排序
  contributions.sort((a, b) => b.contribution - a.contribution);

  return {
    totalScore,
    contributions
  };
}

/**
 * 生成标签
 * - 分数 ≥ 80 的前2项 → 正向标签
 * - 分数 ≤ 30 的前1项 → 风险标签
 */
export function generateTags(breakdown: ScoreBreakdown): {
  positive: string[];
  risk: string[];
} {
  const positive: string[] = [];
  const risk: string[] = [];

  for (const item of breakdown.contributions) {
    if (item.score >= 80 && positive.length < 2) {
      positive.push(item.dimensionName);
    } else if (item.score <= 30 && risk.length < 1) {
      risk.push(item.dimensionName);
    }
  }

  return { positive, risk };
}

/**
 * 批量计算所有房源的总分
 */
export function calculateAllScores(
  visits: Visit[],
  dimensions: Dimension[],
  profile: ScoreProfile
): Visit[] {
  return visits.map(visit => {
    const breakdown = calculateTotalScore(visit, dimensions, profile);
    return {
      ...visit,
      computed: {
        totalScore: breakdown.totalScore,
        breakdown
      }
    };
  });
}

/**
 * 排序房源
 */
export function sortVisits(
  visits: Visit[],
  sortBy: 'totalScore' | 'createdAt' | 'rent' | 'commute',
  order: 'asc' | 'desc' = 'desc'
): Visit[] {
  const sorted = [...visits].sort((a, b) => {
    let valueA: number;
    let valueB: number;

    switch (sortBy) {
      case 'totalScore':
        valueA = a.computed.totalScore || 0;
        valueB = b.computed.totalScore || 0;
        break;
      case 'createdAt':
        valueA = a.createdAt;
        valueB = b.createdAt;
        break;
      case 'rent':
        valueA = a.rent || 0;
        valueB = b.rent || 0;
        break;
      case 'commute':
        valueA = (a.values.commute_min as number) || 999;
        valueB = (b.values.commute_min as number) || 999;
        break;
      default:
        return 0;
    }

    return order === 'desc' ? valueB - valueA : valueA - valueB;
  });

  return sorted;
}

/**
 * 筛选房源
 */
export function filterVisits(
  visits: Visit[],
  filters: {
    status?: 'all' | 'none' | 'candidate' | 'rejected';
    rentMin?: number;
    rentMax?: number;
    commuteMin?: number;
    commuteMax?: number;
    mustConditions?: Record<string, DimensionValue>;
  }
): Visit[] {
  return visits.filter(visit => {
    // 状态筛选
    if (filters.status && filters.status !== 'all') {
      if (visit.status !== filters.status) return false;
    }

    // 租金筛选
    if (filters.rentMin !== undefined && visit.rent !== undefined) {
      if (visit.rent < filters.rentMin) return false;
    }
    if (filters.rentMax !== undefined && visit.rent !== undefined) {
      if (visit.rent > filters.rentMax) return false;
    }

    // 通勤筛选
    const commute = visit.values.commute_min as number | undefined;
    if (filters.commuteMin !== undefined && commute !== undefined) {
      if (commute < filters.commuteMin) return false;
    }
    if (filters.commuteMax !== undefined && commute !== undefined) {
      if (commute > filters.commuteMax) return false;
    }

    // 必须条件筛选
    if (filters.mustConditions) {
      for (const [key, expectedValue] of Object.entries(filters.mustConditions)) {
        const actualValue = visit.values[key];
        if (actualValue !== expectedValue) return false;
      }
    }

    return true;
  });
}
