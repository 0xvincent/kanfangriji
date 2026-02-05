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
        // 0-10 滑杆
        const ratingValue = (value as number) || 5;
        return (
          <div>
            <div className="flex justify-between items-center mb-xs">
              <label className="text-body">{name}</label>
              <span className="text-secondary">
                {value !== null && value !== undefined ? ratingValue : '未评分'}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              step="0.5"
              value={ratingValue}
              onChange={(e) => onChange(parseFloat(e.target.value))}
              className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            {helpText && (
              <div className="text-secondary text-xs mt-xs text-text-hint whitespace-pre-line">
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
            <label className="text-body block mb-s">{name}</label>
            <div className="flex gap-s">
              <button
                onClick={() => onChange(true)}
                className={`flex-1 py-s rounded-lg border ${
                  boolValue === true
                    ? 'bg-primary text-white border-primary'
                    : 'border-border-line text-text-secondary'
                }`}
              >
                是
              </button>
              <button
                onClick={() => onChange(false)}
                className={`flex-1 py-s rounded-lg border ${
                  boolValue === false
                    ? 'bg-primary text-white border-primary'
                    : 'border-border-line text-text-secondary'
                }`}
              >
                否
              </button>
              <button
                onClick={() => onChange(null)}
                className={`flex-1 py-s rounded-lg border ${
                  boolValue === null
                    ? 'bg-gray-200 border-gray-300'
                    : 'border-border-line text-text-hint'
                }`}
              >
                不清楚
              </button>
            </div>
            {helpText && (
              <div className="text-secondary text-xs mt-s text-text-hint">
                {helpText}
              </div>
            )}
          </div>
        );

      case 'number':
        // 数字输入
        return (
          <div>
            <label className="text-body block mb-xs">{name}</label>
            <div className="flex items-center gap-s">
              <input
                type="number"
                value={(value as number) || ''}
                onChange={(e) => onChange(e.target.value ? parseFloat(e.target.value) : null)}
                placeholder="请输入"
                className="flex-1 border-b border-border-line py-s text-body focus:border-primary outline-none"
              />
              {unit && <span className="text-secondary">{unit}</span>}
            </div>
            {helpText && (
              <div className="text-secondary text-xs mt-s text-text-hint">
                {helpText}
              </div>
            )}
          </div>
        );

      case 'select':
        // 下拉选择
        return (
          <div>
            <label className="text-body block mb-xs">{name}</label>
            <select
              value={(value as string) || ''}
              onChange={(e) => onChange(e.target.value || null)}
              className="w-full border border-border-line rounded-lg px-m py-s text-body focus:border-primary outline-none"
            >
              <option value="">请选择</option>
              {options?.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {helpText && (
              <div className="text-secondary text-xs mt-s text-text-hint">
                {helpText}
              </div>
            )}
          </div>
        );

      case 'text':
        // 文本输入
        return (
          <div>
            <label className="text-body block mb-xs">{name}</label>
            <input
              type="text"
              value={(value as string) || ''}
              onChange={(e) => onChange(e.target.value || null)}
              placeholder="请输入"
              className="w-full border-b border-border-line py-s text-body focus:border-primary outline-none"
            />
            {helpText && (
              <div className="text-secondary text-xs mt-s text-text-hint">
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
