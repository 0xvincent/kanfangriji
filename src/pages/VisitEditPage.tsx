// 房源编辑页（新建/编辑）

import { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppStore } from '../stores/appStore';
import type { Photo, VoiceMemo, DimensionValue } from '../types';
import { PHOTO_CATEGORIES } from '../types/dimensions';
import PhotoSection from '../components/PhotoSection';
import VoiceRecorderComponent from '../components/VoiceRecorder';
import DimensionInput from '../components/DimensionInput';

export default function VisitEditPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getVisit, addVisit, updateVisit, dimensions } = useAppStore();
  
  const [community, setCommunity] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [rent, setRent] = useState('');
  const [quickNote, setQuickNote] = useState('');
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [voiceMemos, setVoiceMemos] = useState<VoiceMemo[]>([]);
  const [activeTab, setActiveTab] = useState<'text' | 'voice'>('text');
  const [values, setValues] = useState<Record<string, DimensionValue>>({});
  
  // 第一个输入框的 ref，用于自动聚焦
  const firstInputRef = useRef<HTMLInputElement>(null);

  // 获取启用的维度（启用 = 显示 + 参与计算）
  const visibleDimensions = dimensions.filter(d => d.defaultEnabled);

  // 页面加载时自动聚焦第一个输入框
  useEffect(() => {
    // 延迟 100ms 聚焦，确保 DOM 已渲染
    const timer = setTimeout(() => {
      firstInputRef.current?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (id) {
      const visit = getVisit(id);
      if (visit) {
        setCommunity(visit.community);
        setSourceUrl(visit.sourceUrl || '');
        setRent(visit.rent?.toString() || '');
        setQuickNote(visit.quickNoteText || '');
        setPhotos(visit.photos);
        setVoiceMemos(visit.voiceMemos);
        setValues(visit.values || {});
      }
    }
  }, [id, getVisit]);

  // 自动保存（300ms防抖）
  useEffect(() => {
    if (!id) return;
    
    const timer = setTimeout(() => {
      updateVisit(id, {
        community,
        sourceUrl: sourceUrl || undefined,
        rent: rent ? parseFloat(rent) : undefined,
        quickNoteText: quickNote,
        photos,
        voiceMemos,
        values
      }).catch(err => console.error('自动保存失败:', err));
    }, 300);
    
    return () => clearTimeout(timer);
  }, [id, community, sourceUrl, rent, quickNote, photos, voiceMemos, values, updateVisit]);

  const handleSave = async () => {
    try {
      if (id) {
        await updateVisit(id, {
          community,
          sourceUrl: sourceUrl || undefined,
          rent: rent ? parseFloat(rent) : undefined,
          quickNoteText: quickNote,
          photos,
          voiceMemos,
          values
        });
      } else {
        await addVisit({
          community,
          sourceUrl: sourceUrl || undefined,
          rent: rent ? parseFloat(rent) : undefined,
          quickNoteText: quickNote,
          photos,
          voiceMemos,
          values
        });
      }
      // 导航到首页，使用 replace 避免历史记录堆积
      navigate('/', { replace: true });
    } catch (error) {
      console.error('保存失败:', error);
      alert('保存失败，请重试');
    }
  };

  const handleDimensionChange = (dimensionId: string, value: DimensionValue) => {
    setValues(prev => ({
      ...prev,
      [dimensionId]: value
    }));
  };

  return (
    <div className="min-h-screen bg-bg-page pb-24">
      {/* 顶部导航 */}
      <header className="sticky top-0 z-10 bg-white border-b border-line">
        <div className="safe-top-spacer" />
        <div className="h-11 px-4 flex items-center justify-center">
          <h1 className="text-lg font-medium text-main">{id ? '编辑房源' : '新建房源'}</h1>
        </div>
      </header>

      <main className="px-4 py-6 space-y-6">
        {/* 基础信息卡片 */}
        <section className="bg-white rounded-2xl p-5 shadow-sm border border-line">
          <h2 className="text-base font-semibold text-main mb-5 flex items-center">
            <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            基础信息
          </h2>
          <div className="space-y-5">
            {/* 小区/地址 */}
            <div>
              <label className="text-sm font-medium text-main block mb-2">
                小区/地址 <span className="text-red-500">*</span>
              </label>
              <input
                ref={firstInputRef}
                type="text"
                value={community}
                onChange={(e) => setCommunity(e.target.value)}
                placeholder="请输入小区名称或地址"
                className="w-full h-12 px-4 bg-hover border border-line rounded-xl text-base text-main placeholder-text-hint focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
            </div>
            
            {/* 房源链接 */}
            <div>
              <label className="text-sm font-medium text-main block mb-2">
                房源链接
                <span className="text-text-hint ml-1">（链家/贝壳等）</span>
              </label>
              <input
                type="url"
                value={sourceUrl}
                onChange={(e) => setSourceUrl(e.target.value)}
                placeholder="https://..."
                className="w-full h-12 px-4 bg-hover border border-line rounded-xl text-base text-main placeholder-text-hint focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
            </div>
            
            {/* 租金滑动条 */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-main">
                  月租金
                </label>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-primary">
                    {rent ? Math.round(parseFloat(rent) / 100) * 100 : 0}
                  </span>
                  <span className="text-sm text-secondary">元/月</span>
                </div>
              </div>
              <div className="space-y-3">
                {/* 滑动条 */}
                <input
                  type="range"
                  min="0"
                  max="20000"
                  step="100"
                  value={rent || '0'}
                  onChange={(e) => setRent(e.target.value)}
                  className="w-full h-2 bg-hover rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #2383E2 0%, #2383E2 ${((parseFloat(rent || '0')) / 20000) * 100}%, #F7F6F3 ${((parseFloat(rent || '0')) / 20000) * 100}%, #F7F6F3 100%)`
                  }}
                />
                {/* 刻度标记 */}
                <div className="flex justify-between text-xs text-hint">
                  <span>0</span>
                  <span>5k</span>
                  <span>10k</span>
                  <span>15k</span>
                  <span>20k</span>
                </div>
                {/* 快速选择按钮 */}
                <div className="flex gap-2 flex-wrap">
                  {[2000, 3000, 4000, 5000, 6000, 8000].map(value => (
                    <button
                      key={value}
                      onClick={() => setRent(value.toString())}
                      className={`flex-1 min-w-[60px] h-9 rounded-lg text-sm font-medium transition-all ${
                        rent === value.toString()
                          ? 'bg-primary text-white'
                          : 'bg-hover text-secondary hover:bg-gray-200'
                      }`}
                    >
                      {value >= 1000 ? `${value / 1000}k` : value}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 照片分类卡片 */}
        <section className="bg-white rounded-2xl p-5 shadow-sm border border-line">
          <h2 className="text-base font-semibold text-main mb-5 flex items-center">
            <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            照片
          </h2>
          <div className="space-y-4">
            {PHOTO_CATEGORIES.map((category) => (
              <PhotoSection
                key={category.id}
                category={category.id as any}
                label={category.label}
                photos={photos}
                onPhotosChange={setPhotos}
              />
            ))}
          </div>
        </section>

        {/* 速记卡片 */}
        <section className="bg-white rounded-2xl p-5 shadow-sm border border-line">
          <h2 className="text-base font-semibold text-main mb-5 flex items-center">
            <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            速记
          </h2>
                  
          {/* Tab切换 */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setActiveTab('text')}
              className={`flex-1 h-10 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'text'
                  ? 'bg-primary text-white'
                  : 'bg-hover text-secondary hover:bg-gray-200'
              }`}
            >
              📝 打字
            </button>
            <button
              onClick={() => setActiveTab('voice')}
              className={`flex-1 h-10 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'voice'
                  ? 'bg-primary text-white'
                  : 'bg-hover text-secondary hover:bg-gray-200'
              }`}
            >
              🎤 语音
            </button>
          </div>
                  
          {activeTab === 'text' ? (
            <textarea
              value={quickNote}
              onChange={(e) => setQuickNote(e.target.value)}
              placeholder="一句话：最喜欢/最担心的合一点"
              className="w-full min-h-[120px] bg-hover border border-line rounded-xl p-4 text-base text-main placeholder-text-hint outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none transition-all"
            />
          ) : (
            <VoiceRecorderComponent
              memos={voiceMemos}
              onMemosChange={setVoiceMemos}
            />
          )}
        </section>

        {/* 重点项评分卡片 */}
        <section className="bg-white rounded-2xl p-5 shadow-sm border border-line">
          <h2 className="text-base font-semibold text-main mb-5 flex items-center">
            <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            重点项
          </h2>
          <div className="space-y-6">
            {visibleDimensions.map((dimension) => (
              <DimensionInput
                key={dimension.id}
                dimension={dimension}
                value={values[dimension.id] ?? null}
                onChange={(value) => handleDimensionChange(dimension.id, value)}
              />
            ))}

            {/* 引导添加更多维度 */}
            {dimensions.length > visibleDimensions.length && (
              <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="flex-1">
                    <p className="text-sm text-gray-700 mb-2">
                      还有 <span className="font-semibold text-blue-600">{dimensions.length - visibleDimensions.length}</span> 个维度未启用
                    </p>
                    <p className="text-xs text-secondary mb-3">
                      启用后，所有房源都将同步添加该维度，方便对比
                    </p>
                    <button
                      onClick={() => navigate('/dimensions')}
                      className="text-sm text-blue-500 hover:text-blue-600 font-medium flex items-center gap-1"
                    >
                      去维度管理
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* 底部固定按钮栏 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-line px-4 py-4 flex gap-3 shadow-lg">
        <button
          onClick={() => navigate('/')}
          className="flex-1 h-12 rounded-xl border-2 border-gray-300 text-main font-semibold hover:bg-hover active:scale-98 transition-all"
        >
          取消
        </button>
        <button
          onClick={handleSave}
          disabled={!community.trim()}
          className="flex-1 h-12 rounded-xl bg-primary text-white font-semibold hover:bg-blue-600 active:scale-98 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {id ? '保存' : '完成'}
        </button>
      </div>
    </div>
  );
}
