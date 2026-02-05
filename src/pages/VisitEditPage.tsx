// 房源编辑页（新建/编辑）

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppStore } from '../stores/appStore';
import type { Photo, VoiceMemo, DimensionValue } from '../types';
import { PHOTO_CATEGORIES } from '../types/dimensions';
import PhotoSection from '../components/PhotoSection';
import VoiceRecorderComponent from '../components/VoiceRecorder';
import DimensionInput from '../components/DimensionInput';
import { debounce } from '../utils/helpers';

export default function VisitEditPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getVisit, addVisit, updateVisit, dimensions } = useAppStore();
  
  const [community, setCommunity] = useState('');
  const [rent, setRent] = useState('');
  const [quickNote, setQuickNote] = useState('');
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [voiceMemos, setVoiceMemos] = useState<VoiceMemo[]>([]);
  const [activeTab, setActiveTab] = useState<'text' | 'voice'>('text');
  const [values, setValues] = useState<Record<string, DimensionValue>>({});

  // 获取默认精简组维度
  const visibleDimensions = dimensions.filter(d => d.defaultVisible);

  useEffect(() => {
    if (id) {
      const visit = getVisit(id);
      if (visit) {
        setCommunity(visit.community);
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
    
    const autoSave = debounce(() => {
      updateVisit(id, {
        community,
        rent: rent ? parseFloat(rent) : undefined,
        quickNoteText: quickNote,
        photos,
        voiceMemos,
        values
      });
    }, 300);
    
    autoSave();
  }, [community, rent, quickNote, photos, voiceMemos, values]);

  const handleSave = async () => {
    try {
      if (id) {
        await updateVisit(id, {
          community,
          rent: rent ? parseFloat(rent) : undefined,
          quickNoteText: quickNote,
          photos,
          voiceMemos,
          values
        });
      } else {
        await addVisit({
          community,
          rent: rent ? parseFloat(rent) : undefined,
          quickNoteText: quickNote,
          photos,
          voiceMemos,
          values
        });
      }
      navigate('/');
    } catch (error) {
      console.error('保存失败:', error);
    }
  };

  const handleDimensionChange = (dimensionId: string, value: DimensionValue) => {
    setValues(prev => ({
      ...prev,
      [dimensionId]: value
    }));
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* 顶部导航 */}
      <header className="h-12 px-l flex items-center justify-between border-b border-border-line">
        <button onClick={() => navigate('/')} className="text-primary">
          返回
        </button>
        <h1 className="text-section-title">{id ? '编辑房源' : '新建房源'}</h1>
        <button onClick={handleSave} className="text-primary font-semibold">
          完成
        </button>
      </header>

      <main className="px-l py-xl space-y-xl">
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

            <button className="text-primary text-body">
              展开全部维度 →
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
