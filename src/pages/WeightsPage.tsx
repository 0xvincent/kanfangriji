// 权重设置页
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../stores/appStore';

export default function WeightsPage() {
  const navigate = useNavigate();
  const { dimensions, currentProfile, updateProfile } = useAppStore();
  
  const [weights, setWeights] = useState<Record<string, number>>({});
  const [enabled, setEnabled] = useState<Record<string, boolean>>({});
  const [hasChanges, setHasChanges] = useState(false);

  // 初始化权重
  useEffect(() => {
    if (currentProfile) {
      setWeights(currentProfile.weights);
      setEnabled(currentProfile.enabled);
    }
  }, [currentProfile]);

  // 计算总权重
  const totalWeight = Object.entries(weights)
    .filter(([id]) => enabled[id])
    .reduce((sum, [, weight]) => sum + weight, 0);

  // 获取启用的维度
  const enabledDimensions = dimensions.filter(d => enabled[d.id]);

  // 处理权重变化
  const handleWeightChange = (dimensionId: string, value: number) => {
    setWeights(prev => ({ ...prev, [dimensionId]: value }));
    setHasChanges(true);
  };

  // 处理启用/禁用
  const handleToggle = (dimensionId: string) => {
    setEnabled(prev => ({ ...prev, [dimensionId]: !prev[dimensionId] }));
    setHasChanges(true);
  };

  // 一键归一化
  const handleNormalize = () => {
    const enabledIds = Object.keys(enabled).filter(id => enabled[id]);
    if (enabledIds.length === 0) return;

    const currentTotal = enabledIds.reduce((sum, id) => sum + (weights[id] || 0), 0);
    if (currentTotal === 0) return;

    const normalized: Record<string, number> = {};
    enabledIds.forEach(id => {
      normalized[id] = Math.round((weights[id] / currentTotal) * 100);
    });

    setWeights(prev => ({ ...prev, ...normalized }));
    setHasChanges(true);
  };

  // 重置为默认
  const handleReset = () => {
    if (!currentProfile) return;
    setWeights(currentProfile.weights);
    setEnabled(currentProfile.enabled);
    setHasChanges(false);
  };

  // 保存
  const handleSave = async () => {
    if (!currentProfile) return;
    
    try {
      await updateProfile(currentProfile.id, { weights, enabled });
      setHasChanges(false);
      // 提示保存成功
      alert('权重方案已保存');
    } catch (error) {
      alert('保存失败，请重试');
    }
  };

  // 应用预设
  const applyPreset = (preset: 'balanced' | 'commute' | 'cost' | 'comfort') => {
    const presets = {
      balanced: { // 均衡
        commute_min: 25,
        rent: 20,
        light: 15,
        noise: 15,
        damp_smell: 15,
        condition: 10
      },
      commute: { // 通勤更重
        commute_min: 40,
        rent: 15,
        light: 15,
        noise: 15,
        damp_smell: 10,
        condition: 5
      },
      cost: { // 省钱更重
        rent: 40,
        commute_min: 20,
        light: 15,
        noise: 10,
        damp_smell: 10,
        condition: 5
      },
      comfort: { // 舒适更重
        light: 25,
        noise: 20,
        damp_smell: 20,
        space_comfort: 15,
        condition: 15,
        commute_min: 5
      }
    };

    setWeights(prev => ({ ...prev, ...presets[preset] }));
    setHasChanges(true);
  };
  
  return (
    <div className="min-h-screen bg-white pb-24">
      <header className="sticky top-0 z-10 h-12 px-l flex items-center justify-between border-b border-border-line bg-white">
        <button onClick={() => navigate('/')} className="text-primary font-medium">← 返回</button>
        <h1 className="text-section-title">权重设置</h1>
        <div className="w-12" /> {/* 占位符 */}
      </header>

      <main className="px-l py-xl space-y-xl">
        {/* 当前方案信息 */}
        <section>
          <div className="flex justify-between items-center mb-m">
            <h2 className="text-section-title">当前方案：{currentProfile?.name}</h2>
            <span className="text-secondary">
              总权重：{totalWeight}
            </span>
          </div>
          {totalWeight !== 100 && (
            <div className="text-xs text-yellow-600 bg-yellow-50 px-m py-s rounded-lg">
              ⚠️ 总权重不等于100，建议点击下方"一键归一化"
            </div>
          )}
        </section>

        {/* 权重列表 */}
        <section>
          <h3 className="text-body font-semibold mb-m">维度权重</h3>
          <div className="space-y-l">
            {enabledDimensions.map((dimension) => (
              <div key={dimension.id} className="space-y-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-m flex-1">
                    <label className="text-body">{dimension.name}</label>
                    <button
                      onClick={() => handleToggle(dimension.id)}
                      className={`w-12 h-6 rounded-full relative transition-colors ${
                        enabled[dimension.id] ? 'bg-primary' : 'bg-gray-300'
                      }`}
                    >
                      <div
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          enabled[dimension.id] ? 'translate-x-7' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  <span className="text-body font-semibold w-12 text-right">
                    {weights[dimension.id] || 0}
                  </span>
                </div>
                
                {enabled[dimension.id] && (
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={weights[dimension.id] || 0}
                    onChange={(e) => handleWeightChange(dimension.id, parseInt(e.target.value))}
                    className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                )}
              </div>
            ))}
          </div>
        </section>

        {/* 快速操作 */}
        <section>
          <h3 className="text-body font-semibold mb-m">快速操作</h3>
          <div className="flex gap-s mb-m">
            <button
              onClick={handleNormalize}
              className="flex-1 py-m bg-primary text-white rounded-button text-body font-semibold"
            >
              一键归一化
            </button>
            <button
              onClick={handleReset}
              className="flex-1 py-m border border-border-line rounded-button text-body"
            >
              重置默认
            </button>
          </div>
        </section>

        {/* 预设方案 */}
        <section>
          <h3 className="text-body font-semibold mb-m">预设方案</h3>
          <div className="grid grid-cols-2 gap-s">
            <button
              onClick={() => applyPreset('balanced')}
              className="py-m border border-border-line rounded-lg text-body hover:bg-gray-50"
            >
              ⚖️ 均衡
            </button>
            <button
              onClick={() => applyPreset('commute')}
              className="py-m border border-border-line rounded-lg text-body hover:bg-gray-50"
            >
              🚇 通勤更重
            </button>
            <button
              onClick={() => applyPreset('cost')}
              className="py-m border border-border-line rounded-lg text-body hover:bg-gray-50"
            >
              💰 省钱更重
            </button>
            <button
              onClick={() => applyPreset('comfort')}
              className="py-m border border-border-line rounded-lg text-body hover:bg-gray-50"
            >
              ☀️ 舒适更重
            </button>
          </div>
        </section>
      </main>
      
      {/* 底部固定按钮栏 */}
      {hasChanges && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3 safe-area-bottom">
          <div className="flex gap-3">
            <button
              onClick={handleReset}
              className="flex-1 h-11 rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 active:scale-98 transition-all"
            >
              重置
            </button>
            <button
              onClick={handleSave}
              className="flex-1 h-11 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 active:scale-98 transition-all shadow-sm"
            >
              保存修改
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
