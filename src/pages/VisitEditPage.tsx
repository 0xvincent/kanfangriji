// 房源编辑页（新建/编辑）

import { useEffect, useState } from 'react';
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

  // 获取启用的维度（启用 = 显示 + 参与计算）
  const visibleDimensions = dimensions.filter(d => d.defaultEnabled);

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
    <div className="min-h-screen bg-white pb-24">
      {/* 顶部导航 - 只保留标题 */}
      <header className="h-12 px-4 flex items-center justify-center border-b border-gray-100">
        <h1 className="text-base font-medium text-gray-900">{id ? '编辑房源' : '新建房源'}</h1>
      </header>

      <main className="px-4 py-6 space-y-8">
        {/* 基础信息 */}
        <section>
          <h2 className="text-section-title mb-m">基础信息</h2>
          <div className="space-y-m">
            <div>
              <label className="text-secondary text-secondary block mb-xs">
                小区/地址
              </label>
              <input
                type="text"
                value={community}
                onChange={(e) => setCommunity(e.target.value)}
                placeholder="请输入小区名称或地址"
                className="w-full border-b border-border-line py-s text-body focus:border-primary outline-none"
              />
            </div>
            
            <div>
              <label className="text-secondary text-secondary block mb-xs">
                房源链接（链家/贝壳等）
              </label>
              <input
                type="url"
                value={sourceUrl}
                onChange={(e) => setSourceUrl(e.target.value)}
                placeholder="https://..."
                className="w-full border-b border-border-line py-s text-body focus:border-primary outline-none text-sm"
              />
            </div>
            
            <div>
              <label className="text-secondary text-secondary block mb-xs">
                租金（元/月）
              </label>
              <input
                type="number"
                value={rent}
                onChange={(e) => setRent(e.target.value)}
                placeholder="请输入月租金"
                className="w-full border-b border-border-line py-s text-body focus:border-primary outline-none"
              />
            </div>
          </div>
        </section>

        {/* 照片分类 */}
        <section>
          <h2 className="text-section-title mb-m">照片</h2>
          <div className="space-y-m">
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

        {/* 速记 */}
        <section>
          <h2 className="text-section-title mb-m">速记</h2>
                  
          {/* Tab切换 */}
          <div className="flex gap-s mb-m border-b border-border-line">
            <button
              onClick={() => setActiveTab('text')}
              className={`pb-s px-m text-body ${
                activeTab === 'text'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-text-hint'
              }`}
            >
              打字
            </button>
            <button
              onClick={() => setActiveTab('voice')}
              className={`pb-s px-m text-body ${
                activeTab === 'voice'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-text-hint'
              }`}
            >
              语音
            </button>
          </div>
                  
          {activeTab === 'text' ? (
            <textarea
              value={quickNote}
              onChange={(e) => setQuickNote(e.target.value)}
              placeholder="一句话：最喜欢/最担心的合1点"
              className="w-full min-h-[100px] bg-gray-50 rounded-lg p-m text-body outline-none focus:ring-2 focus:ring-primary"
            />
          ) : (
            <VoiceRecorderComponent
              memos={voiceMemos}
              onMemosChange={setVoiceMemos}
            />
          )}
        </section>

        {/* 重点项评分（精简组）*/}
        <section>
          <h2 className="text-section-title mb-m">重点项</h2>
          <div className="space-y-l">
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
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="flex-1">
                    <p className="text-sm text-gray-700 mb-2">
                      还有 <span className="font-semibold text-blue-600">{dimensions.length - visibleDimensions.length}</span> 个维度未启用
                    </p>
                    <p className="text-xs text-gray-500 mb-3">
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
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3 flex gap-3">
        <button
          onClick={() => navigate('/')}
          className="flex-1 h-11 rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 active:scale-98 transition-all"
        >
          返回
        </button>
        <button
          onClick={handleSave}
          className="flex-1 h-11 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 active:scale-98 transition-all shadow-sm"
        >
          完成
        </button>
      </div>
    </div>
  );
}
