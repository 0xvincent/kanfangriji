// 维度管理页
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../stores/appStore';
import type { Dimension, DimensionType, DimensionGroup } from '../types';
import { generateId } from '../utils/helpers';

export default function DimensionsPage() {
  const navigate = useNavigate();
  const { dimensions, addDimension, updateDimension } = useAppStore();
  const [showNewForm, setShowNewForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // 按分组组织维度
  const groupedDimensions: Record<DimensionGroup, Dimension[]> = {
    subjective: dimensions.filter(d => d.group === 'subjective'),
    commute: dimensions.filter(d => d.group === 'commute'),
    cost: dimensions.filter(d => d.group === 'cost'),
    facility: dimensions.filter(d => d.group === 'facility'),
    risk: dimensions.filter(d => d.group === 'risk'),
    custom: dimensions.filter(d => d.group === 'custom')
  };

  const groupNames: Record<DimensionGroup, string> = {
    subjective: '主观体验',
    commute: '通勤与位置',
    cost: '成本条款',
    facility: '设施条件',
    risk: '风险提示',
    custom: '自定义'
  };

  // 切换启用/禁用
  const handleToggleEnabled = async (dimension: Dimension) => {
    await updateDimension(dimension.id, {
      defaultEnabled: !dimension.defaultEnabled
    });
  };

  // 切换默认显示
  const handleToggleVisible = async (dimension: Dimension) => {
    await updateDimension(dimension.id, {
      defaultVisible: !dimension.defaultVisible
    });
  };
  
  return (
    <div className="min-h-screen bg-white pb-32">
      <header className="h-12 px-l flex items-center justify-between border-b border-border-line">
        <button onClick={() => navigate('/')} className="text-primary">返回</button>
        <h1 className="text-section-title">维度管理</h1>
        <button
          onClick={() => setShowNewForm(true)}
          className="text-primary font-semibold"
        >
          + 新建
        </button>
      </header>

      <main className="px-l py-xl space-y-xl">
        {/* 提示 */}
        <div className="bg-blue-50 border-l-4 border-primary px-m py-m text-body">
          <p className="text-xs text-text-secondary">
            • 启用：维度参与总分计算<br/>
            • 默认显示：在录入页精简组中显示
          </p>
        </div>

        {/* 维度列表（分组） */}
        {Object.entries(groupedDimensions).map(([group, dims]) => (
          dims.length > 0 && (
            <section key={group}>
              <h2 className="text-section-title mb-m">{groupNames[group as DimensionGroup]}</h2>
              <div className="space-y-s">
                {dims.map((dimension) => (
                  <div
                    key={dimension.id}
                    className="border border-border-line rounded-lg p-m"
                  >
                    <div className="flex items-center justify-between mb-s">
                      <div className="flex-1">
                        <div className="text-body font-semibold">{dimension.name}</div>
                        <div className="text-secondary text-xs mt-xs">
                          {dimension.type === 'rating' && '评分0-10'}
                          {dimension.type === 'boolean' && '是/否/不清楚'}
                          {dimension.type === 'number' && `数字${dimension.unit ? `(${dimension.unit})` : ''}`}
                          {dimension.type === 'select' && '选择项'}
                          {dimension.type === 'text' && '文本'}
                        </div>
                      </div>

                      <div className="flex gap-m items-center">
                        {/* 默认显示 */}
                        <button
                          onClick={() => handleToggleVisible(dimension)}
                          className={`px-s py-xs rounded-lg text-xs ${
                            dimension.defaultVisible
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-gray-100 text-text-hint'
                          }`}
                        >
                          {dimension.defaultVisible ? '显示' : '隐藏'}
                        </button>

                        {/* 启用/禁用 */}
                        <button
                          onClick={() => handleToggleEnabled(dimension)}
                          className={`w-12 h-6 rounded-full relative transition-colors ${
                            dimension.defaultEnabled ? 'bg-primary' : 'bg-gray-300'
                          }`}
                        >
                          <div
                            className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                              dimension.defaultEnabled ? 'translate-x-7' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    {dimension.helpText && (
                      <div className="text-xs text-text-hint mt-s">
                        {dimension.helpText.split('\n')[0]}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )
        ))}

        {/* 新建维度提示 */}
        {!showNewForm && groupedDimensions.custom.length === 0 && (
          <div className="text-center py-xxl">
            <p className="text-text-hint mb-m">还没有自定义维度</p>
            <button
              onClick={() => setShowNewForm(true)}
              className="text-primary text-body"
            >
              + 点击添加第一个
            </button>
          </div>
        )}
      </main>

      {/* 新建维度弹窗（简化版） */}
      {showNewForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-card p-xl max-w-md w-full mx-l">
            <h3 className="text-section-title mb-xl">新建自定义维度</h3>
            <p className="text-secondary mb-m">
              功能开发中，敬请期待...
            </p>
            <button
              onClick={() => setShowNewForm(false)}
              className="w-full py-m bg-primary text-white rounded-button text-body font-semibold"
            >
              关闭
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
