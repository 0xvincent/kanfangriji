// 默认维度库定义（基于 PRD 第3章）

import type { Dimension } from '../types';

export const DEFAULT_DIMENSIONS: Dimension[] = [
  // ============ 默认精简组（9项）============
  // 评分类（0-10滑杆）
  {
    id: 'light',
    name: '采光',
    group: 'subjective',
    type: 'rating',
    scoring: { type: 'linear' },
    defaultEnabled: true,
    defaultWeight: 15,
    defaultVisible: true,
    helpText: '0：白天也很暗\n5：正常，需开灯\n10：通透明亮'
  },
  {
    id: 'noise',
    name: '噪音',
    group: 'subjective',
    type: 'rating',
    scoring: { type: 'linear' },
    defaultEnabled: true,
    defaultWeight: 15,
    defaultVisible: true,
    helpText: '0：明显车流/施工/隔壁吵\n5：偶尔能听到但可接受\n10：几乎安静'
  },
  {
    id: 'damp_smell',
    name: '潮湿/异味',
    group: 'subjective',
    type: 'rating',
    scoring: { type: 'linear' },
    defaultEnabled: true,
    defaultWeight: 15,
    defaultVisible: true,
    helpText: '0：霉味/烟味明显\n5：轻微但可接受\n10：无异味、干爽'
  },
  {
    id: 'space_comfort',
    name: '空间舒适/压抑',
    group: 'subjective',
    type: 'rating',
    scoring: { type: 'linear' },
    defaultEnabled: false,
    defaultWeight: 10,
    defaultVisible: true,
    helpText: '0：压抑、拥挤\n5：正常\n10：通透、动线舒服'
  },
  {
    id: 'condition',
    name: '装修维护',
    group: 'subjective',
    type: 'rating',
    scoring: { type: 'linear' },
    defaultEnabled: true,
    defaultWeight: 10,
    defaultVisible: true,
    helpText: '0：破旧、需大修\n5：正常使用\n10：新装修、维护好'
  },
  
  // 数值类
  {
    id: 'rent',
    name: '租金',
    group: 'cost',
    type: 'number',
    scoring: { 
      type: 'inverted',
      min: 3000,  // 假设最优：3000元
      max: 8000   // 假设最差：8000元（可在用户设置中调整）
    },
    defaultEnabled: true,
    defaultWeight: 20,
    defaultVisible: true,
    unit: '元/月',
    helpText: '月租金（元）'
  },
  {
    id: 'commute_min',
    name: '通勤时间',
    group: 'commute',
    type: 'number',
    scoring: { 
      type: 'inverted',
      min: 20,  // 最优：20分钟
      max: 90   // 最差：90分钟
    },
    defaultEnabled: true,
    defaultWeight: 25,
    defaultVisible: true,
    unit: '分钟',
    helpText: '到公司的通勤时间（分钟）'
  },
  
  // 布尔类
  {
    id: 'cookable',
    name: '可做饭',
    group: 'facility',
    type: 'boolean',
    scoring: { 
      type: 'fixed',
      fixedMap: { 'true': 100, 'false': 0, 'null': 50 }
    },
    defaultEnabled: false,
    defaultWeight: 10,
    defaultVisible: true,
    helpText: '是否有厨房可以做饭'
  },
  {
    id: 'elevator',
    name: '有电梯',
    group: 'facility',
    type: 'boolean',
    scoring: { 
      type: 'fixed',
      fixedMap: { 'true': 100, 'false': 0, 'null': 50 }
    },
    defaultEnabled: false,
    defaultWeight: 10,
    defaultVisible: true,
    helpText: '楼栋是否有电梯'
  },

  // ============ 全量维度库（可启用）============
  // A 主观体验
  {
    id: 'ventilation',
    name: '通风',
    group: 'subjective',
    type: 'rating',
    scoring: { type: 'linear' },
    defaultEnabled: false,
    defaultWeight: 10,
    defaultVisible: false
  },
  {
    id: 'privacy',
    name: '隐私',
    group: 'subjective',
    type: 'rating',
    scoring: { type: 'linear' },
    defaultEnabled: false,
    defaultWeight: 10,
    defaultVisible: false,
    helpText: '窗户是否被对面楼直视'
  },
  {
    id: 'storage',
    name: '收纳',
    group: 'subjective',
    type: 'rating',
    scoring: { type: 'linear' },
    defaultEnabled: false,
    defaultWeight: 10,
    defaultVisible: false,
    helpText: '柜子、储物空间充足程度'
  },
  {
    id: 'sound_insulation',
    name: '隔音主观',
    group: 'subjective',
    type: 'select',
    scoring: { 
      type: 'fixed',
      fixedMap: { '好': 100, '一般': 50, '差': 0 }
    },
    defaultEnabled: false,
    defaultWeight: 10,
    defaultVisible: false,
    options: [
      { value: '好', label: '好', score: 100 },
      { value: '一般', label: '一般', score: 50 },
      { value: '差', label: '差', score: 0 }
    ]
  },
  {
    id: 'light_blocking',
    name: '采光遮挡',
    group: 'subjective',
    type: 'boolean',
    scoring: { 
      type: 'fixed',
      fixedMap: { 'true': 0, 'false': 100, 'null': 50 }
    },
    defaultEnabled: false,
    defaultWeight: 10,
    defaultVisible: false,
    helpText: '窗外是否有建筑物遮挡'
  },
  {
    id: 'view',
    name: '视野',
    group: 'subjective',
    type: 'rating',
    scoring: { type: 'linear' },
    defaultEnabled: false,
    defaultWeight: 10,
    defaultVisible: false
  },

  // B 通勤与位置
  {
    id: 'commute_method',
    name: '通勤方式',
    group: 'commute',
    type: 'select',
    scoring: { type: 'fixed', fixedMap: {} },
    defaultEnabled: false,
    defaultWeight: 0,
    defaultVisible: false,
    options: [
      { value: '地铁', label: '地铁', score: 0 },
      { value: '公交', label: '公交', score: 0 },
      { value: '步行', label: '步行', score: 0 },
      { value: '骑行', label: '骑行', score: 0 },
      { value: '驾车', label: '驾车', score: 0 },
      { value: '混合', label: '混合', score: 0 }
    ]
  },
  {
    id: 'metro_walk_min',
    name: '最近地铁站步行',
    group: 'commute',
    type: 'number',
    scoring: { type: 'inverted', min: 3, max: 20 },
    defaultEnabled: false,
    defaultWeight: 10,
    defaultVisible: false,
    unit: '分钟'
  },

  // C 成本条款
  {
    id: 'deposit_method',
    name: '押付方式',
    group: 'cost',
    type: 'select',
    scoring: { 
      type: 'fixed',
      fixedMap: { '押一付一': 100, '押一付三': 60, '半年付': 30, '年付': 10, '其他': 50 }
    },
    defaultEnabled: false,
    defaultWeight: 10,
    defaultVisible: false,
    options: [
      { value: '押一付一', label: '押一付一', score: 100 },
      { value: '押一付三', label: '押一付三', score: 60 },
      { value: '半年付', label: '半年付', score: 30 },
      { value: '年付', label: '年付', score: 10 },
      { value: '其他', label: '其他', score: 50 }
    ]
  },
  {
    id: 'agent_fee',
    name: '中介费',
    group: 'cost',
    type: 'number',
    scoring: { type: 'inverted', min: 0, max: 5000 },
    defaultEnabled: false,
    defaultWeight: 10,
    defaultVisible: false,
    unit: '元'
  },
  {
    id: 'utility_type',
    name: '水电类型',
    group: 'cost',
    type: 'select',
    scoring: { 
      type: 'fixed',
      fixedMap: { '民水民电': 100, '商水商电': 30, '不清楚': 50 }
    },
    defaultEnabled: false,
    defaultWeight: 10,
    defaultVisible: false,
    options: [
      { value: '民水民电', label: '民水民电', score: 100 },
      { value: '商水商电', label: '商水商电', score: 30 },
      { value: '不清楚', label: '不清楚', score: 50 }
    ]
  },
  {
    id: 'property_fee',
    name: '物业费',
    group: 'cost',
    type: 'number',
    scoring: { type: 'inverted', min: 0, max: 500 },
    defaultEnabled: false,
    defaultWeight: 5,
    defaultVisible: false,
    unit: '元/月'
  },

  // D 设施条件
  {
    id: 'ac_count',
    name: '空调数量',
    group: 'facility',
    type: 'number',
    scoring: { type: 'linear', min: 0, max: 3 },
    defaultEnabled: false,
    defaultWeight: 10,
    defaultVisible: false,
    unit: '台'
  },
  {
    id: 'water_heater',
    name: '热水器类型',
    group: 'facility',
    type: 'select',
    scoring: { 
      type: 'fixed',
      fixedMap: { '燃气': 100, '电': 70, '集中': 80, '不清楚': 50 }
    },
    defaultEnabled: false,
    defaultWeight: 10,
    defaultVisible: false,
    options: [
      { value: '燃气', label: '燃气', score: 100 },
      { value: '电', label: '电', score: 70 },
      { value: '集中', label: '集中', score: 80 },
      { value: '不清楚', label: '不清楚', score: 50 }
    ]
  },
  {
    id: 'washing_machine',
    name: '洗衣机',
    group: 'facility',
    type: 'boolean',
    scoring: { 
      type: 'fixed',
      fixedMap: { 'true': 100, 'false': 0, 'null': 50 }
    },
    defaultEnabled: false,
    defaultWeight: 10,
    defaultVisible: false
  },
  {
    id: 'refrigerator',
    name: '冰箱',
    group: 'facility',
    type: 'boolean',
    scoring: { 
      type: 'fixed',
      fixedMap: { 'true': 100, 'false': 0, 'null': 50 }
    },
    defaultEnabled: false,
    defaultWeight: 10,
    defaultVisible: false
  },
  {
    id: 'network',
    name: '网络',
    group: 'facility',
    type: 'select',
    scoring: { 
      type: 'fixed',
      fixedMap: { '已装': 100, '可装': 70, '不清楚': 50 }
    },
    defaultEnabled: false,
    defaultWeight: 10,
    defaultVisible: false,
    options: [
      { value: '已装', label: '已装', score: 100 },
      { value: '可装', label: '可装', score: 70 },
      { value: '不清楚', label: '不清楚', score: 50 }
    ]
  },
  {
    id: 'parking',
    name: '车位',
    group: 'facility',
    type: 'select',
    scoring: { 
      type: 'fixed',
      fixedMap: { '固定': 100, '临停': 60, '无': 0, '不清楚': 50 }
    },
    defaultEnabled: false,
    defaultWeight: 10,
    defaultVisible: false,
    options: [
      { value: '固定', label: '固定', score: 100 },
      { value: '临停', label: '临停', score: 60 },
      { value: '无', label: '无', score: 0 },
      { value: '不清楚', label: '不清楚', score: 50 }
    ]
  },
  {
    id: 'pet_allowed',
    name: '可养宠',
    group: 'facility',
    type: 'select',
    scoring: { 
      type: 'fixed',
      fixedMap: { '可': 100, '不可': 0, '不清楚': 50 }
    },
    defaultEnabled: false,
    defaultWeight: 10,
    defaultVisible: false,
    options: [
      { value: '可', label: '可', score: 100 },
      { value: '不可', label: '不可', score: 0 },
      { value: '不清楚', label: '不清楚', score: 50 }
    ]
  },
  {
    id: 'security',
    name: '门禁安全感',
    group: 'facility',
    type: 'rating',
    scoring: { type: 'linear' },
    defaultEnabled: false,
    defaultWeight: 10,
    defaultVisible: false
  },

  // E 风险提示
  {
    id: 'mold_risk',
    name: '墙角/窗框霉点',
    group: 'risk',
    type: 'boolean',
    scoring: { 
      type: 'fixed',
      fixedMap: { 'true': 0, 'false': 100, 'null': 50 }
    },
    defaultEnabled: false,
    defaultWeight: 15,
    defaultVisible: false,
    helpText: '是否发现霉点（风险项）'
  },
  {
    id: 'noise_risk',
    name: '主干道噪音风险',
    group: 'risk',
    type: 'boolean',
    scoring: { 
      type: 'fixed',
      fixedMap: { 'true': 0, 'false': 100, 'null': 50 }
    },
    defaultEnabled: false,
    defaultWeight: 15,
    defaultVisible: false
  },
  {
    id: 'damp_risk',
    name: '低楼层潮湿风险',
    group: 'risk',
    type: 'boolean',
    scoring: { 
      type: 'fixed',
      fixedMap: { 'true': 0, 'false': 100, 'null': 50 }
    },
    defaultEnabled: false,
    defaultWeight: 15,
    defaultVisible: false
  },
  {
    id: 'circuit_concern',
    name: '电路/插座老旧担忧',
    group: 'risk',
    type: 'select',
    scoring: { 
      type: 'fixed',
      fixedMap: { '无': 100, '有点': 50, '明显': 0 }
    },
    defaultEnabled: false,
    defaultWeight: 10,
    defaultVisible: false,
    options: [
      { value: '无', label: '无', score: 100 },
      { value: '有点', label: '有点', score: 50 },
      { value: '明显', label: '明显', score: 0 }
    ]
  },
  {
    id: 'landlord_reliability',
    name: '房东/中介靠谱度',
    group: 'risk',
    type: 'select',
    scoring: { 
      type: 'fixed',
      fixedMap: { '好': 100, '一般': 50, '差': 0 }
    },
    defaultEnabled: false,
    defaultWeight: 10,
    defaultVisible: false,
    options: [
      { value: '好', label: '好', score: 100 },
      { value: '一般', label: '一般', score: 50 },
      { value: '差', label: '差', score: 0 }
    ]
  }
];

// 默认权重方案
export const DEFAULT_SCORE_PROFILE = {
  id: 'balanced',
  name: '均衡',
  weights: {
    commute_min: 25,
    rent: 20,
    light: 15,
    noise: 15,
    damp_smell: 15,
    condition: 10
  },
  enabled: {
    commute_min: true,
    rent: true,
    light: true,
    noise: true,
    damp_smell: true,
    condition: true
  },
  updatedAt: Date.now()
};

// 照片分类标签
export const PHOTO_CATEGORIES = [
  { id: 'living_room', label: '客厅', required: true },
  { id: 'bedroom', label: '卧室', required: true },
  { id: 'kitchen', label: '厨房', required: true },
  { id: 'bathroom', label: '卫生间', required: true },
  { id: 'window_balcony', label: '窗外/阳台/采光', required: true },
  { id: 'entrance', label: '入户/门锁', required: false },
  { id: 'community', label: '小区环境/楼道', required: false },
  { id: 'equipment', label: '设备铭牌', required: false }
] as const;
