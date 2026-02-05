// 默认维度库定义（基于 PRD 第3章）

import type { Dimension } from '../types';

export const DEFAULT_DIMENSIONS: Dimension[] = [
  // ============ 默认核心组（15项）============
  
  // 1. 通勤时间（最重要）
  {
    id: 'commute_min',
    name: '通勤时间',
    group: 'commute',
    type: 'number',
    scoring: { 
      type: 'inverted',
      min: 15,  // 最优：15分钟
      max: 90   // 最差：90分钟
    },
    defaultEnabled: true,
    defaultWeight: 25,
    defaultVisible: true,
    unit: '分钟',
    helpText: '单程通勤时间，按正常上班时间估算'
  },
  
  // 2. 租金
  {
    id: 'rent',
    name: '月租金',
    group: 'cost',
    type: 'number',
    scoring: { 
      type: 'inverted',
      min: 2000,
      max: 8000
    },
    defaultEnabled: true,
    defaultWeight: 20,
    defaultVisible: true,
    unit: '元/月',
    helpText: '每月租金（不含水电）'
  },
  
  // 3. 采光
  {
    id: 'light',
    name: '采光',
    group: 'subjective',
    type: 'rating',
    scoring: { type: 'linear' },
    defaultEnabled: true,
    defaultWeight: 15,
    defaultVisible: true,
    helpText: '0：白天也很暗\n5：需要开灯\n10：通透明亮'
  },
  
  // 4. 噪音
  {
    id: 'noise',
    name: '噪音',
    group: 'subjective',
    type: 'rating',
    scoring: { type: 'linear' },
    defaultEnabled: true,
    defaultWeight: 12,
    defaultVisible: true,
    helpText: '0：明显车流/施工/隆壁噪\n5：偶尔听到\n10：几乎安静'
  },
  
  // 5. 潮湿/异味
  {
    id: 'damp_smell',
    name: '潮湿/异味',
    group: 'subjective',
    type: 'rating',
    scoring: { type: 'linear' },
    defaultEnabled: true,
    defaultWeight: 12,
    defaultVisible: true,
    helpText: '0：霉味/烟味明显\n5：轻微但可接受\n10：无异味、干爽'
  },
  
  // 6. 装修条件
  {
    id: 'condition',
    name: '装修条件',
    group: 'subjective',
    type: 'rating',
    scoring: { type: 'linear' },
    defaultEnabled: true,
    defaultWeight: 10,
    defaultVisible: true,
    helpText: '0：破旧、需大修\n5：正常使用\n10：新装修、维护好'
  },
  
  // 7. 空间大小
  {
    id: 'space_comfort',
    name: '空间大小',
    group: 'subjective',
    type: 'rating',
    scoring: { type: 'linear' },
    defaultEnabled: true,
    defaultWeight: 10,
    defaultVisible: true,
    helpText: '0：压抑、拥挤\n5：正常\n10：宽敢、动线好'
  },
  
  // 8. 卧室朝向
  {
    id: 'bedroom_orientation',
    name: '卧室朝向',
    group: 'subjective',
    type: 'select',
    scoring: { 
      type: 'fixed',
      fixedMap: { '南': 100, '东南': 90, '西南': 80, '东': 70, '西': 50, '北': 30, '不清楚': 50 }
    },
    defaultEnabled: true,
    defaultWeight: 8,
    defaultVisible: true,
    options: [
      { value: '南', label: '南', score: 100 },
      { value: '东南', label: '东南', score: 90 },
      { value: '西南', label: '西南', score: 80 },
      { value: '东', label: '东', score: 70 },
      { value: '西', label: '西', score: 50 },
      { value: '北', label: '北', score: 30 },
      { value: '不清楚', label: '不清楚', score: 50 }
    ],
    helpText: '卧室窗户朝向，影响采光和通风'
  },
  
  // 9. 楼层位置
  {
    id: 'floor_level',
    name: '楼层位置',
    group: 'subjective',
    type: 'select',
    scoring: { 
      type: 'fixed',
      fixedMap: { '中楼层': 100, '高楼层': 90, '次高楼层': 80, '次低楼层': 60, '低楼层': 40, '顶楼': 50, '不清楚': 50 }
    },
    defaultEnabled: true,
    defaultWeight: 8,
    defaultVisible: true,
    options: [
      { value: '中楼层', label: '中楼层(6-20层)', score: 100 },
      { value: '高楼层', label: '高楼层(20层+)', score: 90 },
      { value: '次高楼层', label: '次高楼层(21-30层)', score: 80 },
      { value: '次低楼层', label: '次低楼层(3-5层)', score: 60 },
      { value: '低楼层', label: '低楼层(1-2层)', score: 40 },
      { value: '顶楼', label: '顶楼', score: 50 },
      { value: '不清楚', label: '不清楚', score: 50 }
    ],
    helpText: '低楼层有噪音潮湿，顶楼可能漏雨暴晒'
  },
  
  // 10. 有电梯
  {
    id: 'elevator',
    name: '有电梯',
    group: 'facility',
    type: 'boolean',
    scoring: { 
      type: 'fixed',
      fixedMap: { 'true': 100, 'false': 0, 'null': 50 }
    },
    defaultEnabled: true,
    defaultWeight: 8,
    defaultVisible: true,
    helpText: '楼栋是否有电梯（3楼以上很重要）'
  },
  
  // 11. 独立卫生间
  {
    id: 'private_bathroom',
    name: '独立卫生间',
    group: 'facility',
    type: 'boolean',
    scoring: { 
      type: 'fixed',
      fixedMap: { 'true': 100, 'false': 0, 'null': 50 }
    },
    defaultEnabled: true,
    defaultWeight: 12,
    defaultVisible: true,
    helpText: '是否有独立卫生间（非共用）'
  },
  
  // 12. 空调配置
  {
    id: 'ac_config',
    name: '空调配置',
    group: 'facility',
    type: 'select',
    scoring: { 
      type: 'fixed',
      fixedMap: { '客厅+卧室': 100, '仅卧室': 80, '仅客厅': 60, '无': 0, '不清楚': 50 }
    },
    defaultEnabled: true,
    defaultWeight: 8,
    defaultVisible: true,
    options: [
      { value: '客厅+卧室', label: '客厅+卧室都有', score: 100 },
      { value: '仅卧室', label: '仅卧室有', score: 80 },
      { value: '仅客厅', label: '仅客厅有', score: 60 },
      { value: '无', label: '无', score: 0 },
      { value: '不清楚', label: '不清楚', score: 50 }
    ],
    helpText: '空调是否配备及位置'
  },
  
  // 13. 洗衣机
  {
    id: 'washing_machine',
    name: '洗衣机',
    group: 'facility',
    type: 'boolean',
    scoring: { 
      type: 'fixed',
      fixedMap: { 'true': 100, 'false': 0, 'null': 50 }
    },
    defaultEnabled: true,
    defaultWeight: 6,
    defaultVisible: true,
    helpText: '是否配备洗衣机'
  },
  
  // 14. 冰箱
  {
    id: 'refrigerator',
    name: '冰箱',
    group: 'facility',
    type: 'boolean',
    scoring: { 
      type: 'fixed',
      fixedMap: { 'true': 100, 'false': 0, 'null': 50 }
    },
    defaultEnabled: true,
    defaultWeight: 6,
    defaultVisible: true,
    helpText: '是否配备冰箱'
  },
  
  // 15. 中介费
  {
    id: 'agent_fee',
    name: '中介费',
    group: 'cost',
    type: 'select',
    scoring: { 
      type: 'fixed',
      fixedMap: { '无': 100, '半月': 70, '一月': 40, '一月半': 20, '两月': 0, '不清楚': 50 }
    },
    defaultEnabled: true,
    defaultWeight: 5,
    defaultVisible: true,
    options: [
      { value: '无', label: '无中介费', score: 100 },
      { value: '半月', label: '半月房租', score: 70 },
      { value: '一月', label: '一月房租', score: 40 },
      { value: '一月半', label: '1.5月房租', score: 20 },
      { value: '两月', label: '两月房租', score: 0 },
      { value: '不清楚', label: '不清楚', score: 50 }
    ],
    helpText: '一次性支付的中介费用'
  },

    
  // ============ 备选维度库（可启用）============
    
  // 主观体验
  {
    id: 'ventilation',
    name: '通风',
    group: 'subjective',
    type: 'rating',
    scoring: { type: 'linear' },
    defaultEnabled: false,
    defaultWeight: 8,
    defaultVisible: false,
    helpText: '0：空气不流通\n5：正常\n10：南北通透'
  },
  {
    id: 'privacy',
    name: '隐私性',
    group: 'subjective',
    type: 'rating',
    scoring: { type: 'linear' },
    defaultEnabled: false,
    defaultWeight: 8,
    defaultVisible: false,
    helpText: '0：窗户被直视\n5：一般\n10：隐私性好'
  },
  {
    id: 'storage',
    name: '收纳空间',
    group: 'subjective',
    type: 'rating',
    scoring: { type: 'linear' },
    defaultEnabled: false,
    defaultWeight: 6,
    defaultVisible: false,
    helpText: '0：几乎没有\n5：一般\n10：柜子充足'
  },
  {
    id: 'view',
    name: '视野景观',
    group: 'subjective',
    type: 'rating',
    scoring: { type: 'linear' },
    defaultEnabled: false,
    defaultWeight: 5,
    defaultVisible: false,
    helpText: '0：对着墙\n5：一般\n10：景观好'
  },
    
  // 通勤与位置
  {
    id: 'metro_walk_min',
    name: '到地铁站步行',
    group: 'commute',
    type: 'number',
    scoring: { type: 'inverted', min: 3, max: 20 },
    defaultEnabled: false,
    defaultWeight: 8,
    defaultVisible: false,
    unit: '分钟',
    helpText: '到最近地铁站的步行时间'
  },
  {
    id: 'nearby_mall',
    name: '周边商场',
    group: 'commute',
    type: 'rating',
    scoring: { type: 'linear' },
    defaultEnabled: false,
    defaultWeight: 5,
    defaultVisible: false,
    helpText: '0：几乎没有\n5：步行10-15分\n10：楼下大型商场'
  },
    
  // 成本条款
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
    defaultWeight: 8,
    defaultVisible: false,
    options: [
      { value: '押一付一', label: '押一付一', score: 100 },
      { value: '押一付三', label: '押一付三', score: 60 },
      { value: '半年付', label: '半年付', score: 30 },
      { value: '年付', label: '年付', score: 10 },
      { value: '其他', label: '其他', score: 50 }
    ],
    helpText: '租金支付方式，影响资金压力'
  },
  {
    id: 'utility_type',
    name: '水电类型',
    group: 'cost',
    type: 'select',
    scoring: { 
      type: 'fixed',
      fixedMap: { '民水民电': 100, '商水商电': 40, '不清楚': 50 }
    },
    defaultEnabled: false,
    defaultWeight: 8,
    defaultVisible: false,
    options: [
      { value: '民水民电', label: '民水民电', score: 100 },
      { value: '商水商电', label: '商水商电', score: 40 },
      { value: '不清楚', label: '不清楚', score: 50 }
    ],
    helpText: '商水商电费用较高'
  },
  {
    id: 'property_fee',
    name: '物业费',
    group: 'cost',
    type: 'select',
    scoring: { 
      type: 'fixed',
      fixedMap: { '包含': 100, '不含': 60, '无物业': 80, '不清楚': 50 }
    },
    defaultEnabled: false,
    defaultWeight: 5,
    defaultVisible: false,
    options: [
      { value: '包含', label: '包含在租金内', score: 100 },
      { value: '不含', label: '需单独付', score: 60 },
      { value: '无物业', label: '无物业', score: 80 },
      { value: '不清楚', label: '不清楚', score: 50 }
    ],
    helpText: '物业费支付情况'
  },
    
  // 设施条件
  {
    id: 'hot_water',
    name: '热水器',
    group: 'facility',
    type: 'select',
    scoring: { 
      type: 'fixed',
      fixedMap: { '燃气': 100, '电热水器': 70, '集中供热水': 80, '无': 0, '不清楚': 50 }
    },
    defaultEnabled: false,
    defaultWeight: 8,
    defaultVisible: false,
    options: [
      { value: '燃气', label: '燃气热水器', score: 100 },
      { value: '电热水器', label: '电热水器', score: 70 },
      { value: '集中供热水', label: '集中供热水', score: 80 },
      { value: '无', label: '无', score: 0 },
      { value: '不清楚', label: '不清楚', score: 50 }
    ],
    helpText: '燃气最佳，电热水器较慢'
  },
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
    defaultWeight: 8,
    defaultVisible: false,
    helpText: '是否有厨房可以做饭'
  },
  {
    id: 'pet_allowed',
    name: '可养宠物',
    group: 'facility',
    type: 'select',
    scoring: { 
      type: 'fixed',
      fixedMap: { '可': 100, '不可': 0, '不清楚': 50 }
    },
    defaultEnabled: false,
    defaultWeight: 5,
    defaultVisible: false,
    options: [
      { value: '可', label: '可养', score: 100 },
      { value: '不可', label: '不可养', score: 0 },
      { value: '不清楚', label: '不清楚', score: 50 }
    ],
    helpText: '房东是否允许养猫狗等宠物'
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
    defaultWeight: 5,
    defaultVisible: false,
    options: [
      { value: '固定', label: '固定车位', score: 100 },
      { value: '临停', label: '临时停车', score: 60 },
      { value: '无', label: '无', score: 0 },
      { value: '不清楚', label: '不清楚', score: 50 }
    ],
    helpText: '小区是否有车位'
  },
  {
    id: 'security',
    name: '门禁安全',
    group: 'facility',
    type: 'rating',
    scoring: { type: 'linear' },
    defaultEnabled: false,
    defaultWeight: 6,
    defaultVisible: false,
    helpText: '0：没有门禁\n5：一般\n10：安全严格'
  },
    
  // 风险提示
  {
    id: 'mold_risk',
    name: '霉点风险',
    group: 'risk',
    type: 'boolean',
    scoring: { 
      type: 'fixed',
      fixedMap: { 'true': 0, 'false': 100, 'null': 50 }
    },
    defaultEnabled: false,
    defaultWeight: 10,
    defaultVisible: false,
    helpText: '墙角/窗框是否有霉点'
  },
  {
    id: 'landlord_reliability',
    name: '房东靠谱度',
    group: 'risk',
    type: 'select',
    scoring: { 
      type: 'fixed',
      fixedMap: { '好': 100, '一般': 50, '差': 0 }
    },
    defaultEnabled: false,
    defaultWeight: 8,
    defaultVisible: false,
    options: [
      { value: '好', label: '好', score: 100 },
      { value: '一般', label: '一般', score: 50 },
      { value: '差', label: '差', score: 0 }
    ],
    helpText: '房东/中介的靠谱程度'
  }
];

// 默认权重方案
export const DEFAULT_SCORE_PROFILE = {
  id: 'balanced',
  name: '均衡',
  weights: {
    commute_min: 25,
    rent: 20,
    light: 12,
    noise: 10,
    damp_smell: 10,
    condition: 8,
    space_comfort: 8,
    private_bathroom: 12,
    bedroom_orientation: 6,
    floor_level: 6,
    elevator: 6,
    ac_config: 6,
    washing_machine: 4,
    refrigerator: 4,
    agent_fee: 3
  },
  enabled: {
    commute_min: true,
    rent: true,
    light: true,
    noise: true,
    damp_smell: true,
    condition: true,
    space_comfort: true,
    private_bathroom: true,
    bedroom_orientation: true,
    floor_level: true,
    elevator: true,
    ac_config: true,
    washing_machine: true,
    refrigerator: true,
    agent_fee: true
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
