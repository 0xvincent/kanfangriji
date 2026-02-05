// 维度录入控件组件

import type { Dimension, DimensionValue } from '../types';

interface DimensionInputProps {
  dimension: Dimension;
  value: DimensionValue;
  onChange: (value: DimensionValue) => void;
}

export default function DimensionInput({ dimension, value, onChange }: DimensionInputProps) {
  const { type, name, helpText, unit, options } = dimension;

  const renderInput = () => {
    switch (type) {
      case 'rating':
        // 0-10 点选按钮（简洁版）
        const ratingValue = (value as number) ?? null;
        const scores = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        
        return (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-base font-medium text-gray-700">{name}</label>
              <span className="text-2xl font-semibold text-blue-500">
                {ratingValue !== null ? ratingValue : '-'}
              </span>
            </div>
            
            {/* 分数按钮 */}
            <div className="grid grid-cols-11 gap-2">
              {scores.map((score) => (
                <button
                  key={score}
                  onClick={() => onChange(score)}
                  className={`h-10 rounded-lg text-base font-medium transition-all ${
                    ratingValue === score
                      ? 'bg-blue-500 text-white shadow-sm'
                      : 'bg-gray-100 text-secondary hover:bg-gray-200 active:scale-95'
                  }`}
                >
                  {score}
                </button>
              ))}
            </div>
            
            {helpText && (
              <div className="text-sm text-secondary leading-relaxed">
                {helpText}
              </div>
            )}
          </div>
        );

      case 'boolean':
        // 三态按钮：是/否/不清楚
        const boolValue = value;
        return (
          <div>
            <label className="text-body block mb-m font-medium">{name}</label>
            <div className="flex gap-2">
              <button
                onClick={() => onChange(true)}
                className={`flex-1 py-3 rounded-lg border text-base font-medium transition-all ${
                  boolValue === true
                    ? 'bg-blue-500 text-white border-blue-500 shadow-sm'
                    : 'border-border-line text-text-secondary hover:bg-hover active:scale-95'
                }`}
              >
                是
              </button>
              <button
                onClick={() => onChange(false)}
                className={`flex-1 py-3 rounded-lg border text-base font-medium transition-all ${
                  boolValue === false
                    ? 'bg-blue-500 text-white border-blue-500 shadow-sm'
                    : 'border-border-line text-text-secondary hover:bg-hover active:scale-95'
                }`}
              >
                否
              </button>
              <button
                onClick={() => onChange(null)}
                className={`flex-1 py-3 rounded-lg border text-base font-medium transition-all ${
                  boolValue === null
                    ? 'bg-gray-200 border-gray-300 text-gray-700'
                    : 'border-border-line text-text-hint hover:bg-hover active:scale-95'
                }`}
              >
                不清楚
              </button>
            </div>
            {helpText && (
              <div className="text-secondary text-sm mt-m text-text-hint leading-relaxed">
                {helpText}
              </div>
            )}
          </div>
        );

      case 'number':
        // 数字输入
        return (
          <div>
            <label className="text-body block mb-m font-medium">{name}</label>
            <div className="flex items-center gap-m">
              <input
                type="number"
                value={(value as number) || ''}
                onChange={(e) => onChange(e.target.value ? parseFloat(e.target.value) : null)}
                placeholder="请输入"
                className="flex-1 border-b-2 border-border-line py-3 text-base focus:border-blue-500 outline-none"
              />
              {unit && <span className="text-base text-text-secondary">{unit}</span>}
            </div>
            {helpText && (
              <div className="text-secondary text-sm mt-m text-text-hint leading-relaxed">
                {helpText}
              </div>
            )}
          </div>
        );

      case 'select':
        // 按钮组选择（一次点击）
        const selectValue = value as string;
        return (
          <div>
            <label className="text-body block mb-m font-medium">{name}</label>
            <div className="grid grid-cols-2 gap-2">
              {/* 不清楚选项 */}
              <button
                onClick={() => onChange(null)}
                className={`py-3 px-3 rounded-lg border text-sm font-medium transition-all ${
                  selectValue === null || selectValue === '' || selectValue === '不清楚'
                    ? 'bg-gray-200 border-gray-300 text-gray-700'
                    : 'border-border-line text-text-secondary hover:bg-hover'
                }`}
              >
                不清楚
              </button>
              
              {/* 其他选项 */}
              {options?.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => onChange(opt.value)}
                  className={`py-3 px-3 rounded-lg border text-sm font-medium transition-all ${
                    selectValue === opt.value
                      ? 'bg-blue-500 text-white border-blue-500 shadow-sm'
                      : 'border-border-line text-text-secondary hover:bg-hover'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            {helpText && (
              <div className="text-secondary text-xs mt-m text-text-hint leading-relaxed">
                {helpText}
              </div>
            )}
          </div>
        );

      case 'text':
        // 文本输入
        return (
          <div>
            <label className="text-body block mb-m font-medium">{name}</label>
            <input
              type="text"
              value={(value as string) || ''}
              onChange={(e) => onChange(e.target.value || null)}
              placeholder="请输入"
              className="w-full border-b-2 border-border-line py-3 text-base focus:border-blue-500 outline-none"
            />
            {helpText && (
              <div className="text-secondary text-sm mt-m text-text-hint leading-relaxed">
                {helpText}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return <div>{renderInput()}</div>;
}
