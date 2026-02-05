// 核心数据类型定义（基于 PRD 第2章数据模型）

// ============ 照片相关 ============
export type PhotoCategory = 
  | 'living_room'    // 客厅
  | 'bedroom'        // 卧室
  | 'kitchen'        // 厨房
  | 'bathroom'       // 卫生间
  | 'window_balcony' // 窗外/阳台/采光
  | 'entrance'       // 入户/门锁（可选）
  | 'community'      // 小区环境/楼道（可选）
  | 'equipment';     // 设备铭牌（可选）

export interface Photo {
  id: string;
  category: PhotoCategory;
  blobPath: string;      // IndexedDB Blob 存储路径
  thumbBlobPath: string; // 缩略图路径
  createdAt: number;     // 时间戳
}

// ============ 语音备忘录 ============
export interface VoiceMemo {
  id: string;
  audioBlobPath: string;
  durationMs: number;
  createdAt: number;
  transcriptText?: string; // 可选：语音转文字
}

// ============ 维度相关 ============
export type DimensionType = 
  | 'rating'   // 0-10评分（滑杆）
  | 'boolean'  // 是/否/不清楚
  | 'select'   // 枚举选择
  | 'number'   // 数值（分钟/元/㎡）
  | 'text';    // 文本

export type DimensionGroup = 
  | 'subjective'  // 主观体验
  | 'commute'     // 通勤与位置
  | 'cost'        // 成本条款
  | 'facility'    // 设施条件
  | 'risk'        // 风险提示
  | 'custom';     // 自定义

export interface DimensionScoringRule {
  type: 'linear' | 'inverted' | 'fixed';
  // linear: 越大越好 (value - min) / (max - min) * 100
  // inverted: 越小越好 (max - value) / (max - min) * 100
  // fixed: 固定映射（用于 select/boolean）
  min?: number;
  max?: number;
  fixedMap?: Record<string, number>; // 例如：{ "是": 100, "否": 0, "不清楚": 50 }
}

export interface DimensionOption {
  value: string;
  label: string;
  score: number; // 该选项对应的分数 0-100
}

export interface Dimension {
  id: string;
  name: string;
  group: DimensionGroup;
  type: DimensionType;
  scoring: DimensionScoringRule;
  defaultEnabled: boolean;
  defaultWeight: number;      // 0-100
  defaultVisible: boolean;    // 是否在录入页默认精简组显示
  options?: DimensionOption[]; // select 类型的选项
  helpText?: string;          // 录入提示（点i显示）
  unit?: string;              // 单位：分钟/元/㎡/米
}

export type DimensionValue = 
  | number           // rating/number 类型
  | boolean          // boolean 类型（是=true，否=false，不清楚=null）
  | string           // select/text 类型
  | null;            // 未填写

// ============ 分数计算相关 ============
export interface ScoreBreakdown {
  totalScore: number;
  contributions: Array<{
    dimensionId: string;
    dimensionName: string;
    rawValue: DimensionValue;
    score: number;        // 该维度的 0-100 分数
    weight: number;
    contribution: number; // 贡献值
  }>;
}

// ============ 房源（Visit） ============
export type VisitStatus = 'none' | 'candidate' | 'rejected';

export interface Visit {
  id: string;
  indexNo: string;           // 自增编号："01", "02", ...
  createdAt: number;
  updatedAt: number;
  title: string;             // 默认："房源 12"，可改
  community: string;         // 小区/地址
  geo?: {
    lat: number;
    lng: number;
    accuracy: number;
  };
  
  // 基础信息
  rent?: number;             // 租金（元/月）
  deposit?: string;          // 押付方式：押一付一等
  area?: number;             // 面积（㎡）
  floor?: number;            // 楼层
  totalFloor?: number;       // 总楼层
  orientation?: string[];    // 朝向：['S', 'N'] 或 ['南北通透']
  status: VisitStatus;
  
  // 速记
  quickNoteText?: string;
  voiceMemos: VoiceMemo[];
  
  // 照片
  photos: Photo[];
  
  // 维度值（key 为 dimensionId）
  values: Record<string, DimensionValue>;
  
  // 计算结果
  computed: {
    totalScore?: number;
    breakdown?: ScoreBreakdown;
  };
}

// ============ 权重方案 ============
export interface ScoreProfile {
  id: string;
  name: string;              // "均衡"、"通勤更重"等
  weights: Record<string, number>;   // dimensionId -> weight (0-100)
  enabled: Record<string, boolean>;  // dimensionId -> 是否启用
  updatedAt: number;
}

// ============ 全局配置 ============
export interface WorkLocation {
  id: string;
  name: string;
  address: string;
  lat?: number;
  lng?: number;
}

export interface Home {
  id?: string;  // Dexie主键
  workLocations: WorkLocation[];
  activeWorkLocationId: string;
  unitSystem: 'metric' | 'imperial'; // 暂时只用 metric
  scoreProfileId: string;            // 当前使用的权重方案ID
  defaultVisibleDimensions: string[]; // 默认展示维度集合（精简组）
}

// ============ 筛选条件 ============
export interface FilterConditions {
  status: VisitStatus | 'all';
  rentMin?: number;
  rentMax?: number;
  commuteMin?: number;
  commuteMax?: number;
  mustConditions: Record<string, DimensionValue>; // 例如：{ cookable: true, elevator: true }
}

// ============ 排序选项 ============
export type SortOption = 
  | 'totalScore'
  | 'createdAt'
  | 'rent'
  | 'commute';

export interface SortConfig {
  by: SortOption;
  order: 'asc' | 'desc';
}
