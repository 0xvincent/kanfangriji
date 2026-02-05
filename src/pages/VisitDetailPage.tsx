// 房源详情页
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppStore } from '../stores/appStore';
import { getPhotoBlob } from '../db/operations';
import { createPhotoURL } from '../utils/imageProcessor';
import { generateTags } from '../utils/scoring';
import { formatDate } from '../utils/helpers';

export default function VisitDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getVisit } = useAppStore();
  const visit = id ? getVisit(id) : null;
  const [photoUrls, setPhotoUrls] = useState<Record<string, string>>({});
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // 加载所有照片
  useEffect(() => {
    const loadPhotos = async () => {
      if (!visit) return;
      const urls: Record<string, string> = {};
      
      for (const photo of visit.photos) {
        const blob = await getPhotoBlob(photo.blobPath);
        if (blob) {
          urls[photo.id] = createPhotoURL(blob);
        }
      }
      
      setPhotoUrls(urls);
    };
    loadPhotos();
  }, [visit]);

  if (!visit) {
    return <div>房源不存在</div>;
  }

  // 关闭灯箱
  const closeLightbox = () => {
    setLightboxIndex(null);
    setCurrentImageIndex(0);
  };

  // 下一张
  const nextPhoto = () => {
    if (currentImageIndex < visit.photos.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  // 上一张
  const prevPhoto = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* 顶部导航 - 只保留返回，固定在顶部 */}
      <header className="sticky top-0 z-10 bg-white border-b border-border-line">
        {/* 安全区占位 */}
        <div className="safe-top-spacer" />
        {/* 内容区（固定44px） */}
        <div className="h-11 px-l flex items-center justify-between">
          <button onClick={() => navigate('/')} className="text-primary font-medium">← 返回</button>
          <h1 className="text-section-title">房源详情</h1>
          <div className="w-12" /> {/* 占位符，保持居中 */}
        </div>
      </header>

      {/* 照片轮播 */}
      {visit.photos.length > 0 && (
        <div className="relative">
          {/* 主图 */}
          <div className="w-full h-64 bg-gray-100 relative">
            {photoUrls[visit.photos[currentImageIndex]?.id] ? (
              <img
                src={photoUrls[visit.photos[currentImageIndex].id]}
                alt="房源照片"
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => setLightboxIndex(currentImageIndex)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
            
            {/* 左右切换按钮 */}
            {visit.photos.length > 1 && (
              <>
                {currentImageIndex > 0 && (
                  <button
                    onClick={prevPhoto}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                )}
                {currentImageIndex < visit.photos.length - 1 && (
                  <button
                    onClick={nextPhoto}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}
              </>
            )}
            
            {/* 照片计数 */}
            <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
              {currentImageIndex + 1} / {visit.photos.length}
            </div>
          </div>
          
          {/* 缩略图列表 */}
          {visit.photos.length > 1 && (
            <div className="flex gap-2 p-2 overflow-x-auto bg-hover">
              {visit.photos.map((photo, index) => (
                <button
                  key={photo.id}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`flex-shrink-0 w-16 h-16 rounded overflow-hidden border-2 ${
                    index === currentImageIndex ? 'border-blue-500' : 'border-transparent'
                  }`}
                >
                  {photoUrls[photo.id] ? (
                    <img
                      src={photoUrls[photo.id]}
                      alt={`缩略图 ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 全屏灯箱 */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
          {/* 关闭按钮 */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white z-10"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          {/* 当前照片 */}
          <div className="w-full h-full flex items-center justify-center p-4">
            {photoUrls[visit.photos[currentImageIndex]?.id] && (
              <img
                src={photoUrls[visit.photos[currentImageIndex].id]}
                alt="全屏查看"
                className="max-w-full max-h-full object-contain"
              />
            )}
          </div>
          
          {/* 左右切换 */}
          {currentImageIndex > 0 && (
            <button
              onClick={prevPhoto}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          {currentImageIndex < visit.photos.length - 1 && (
            <button
              onClick={nextPhoto}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
          
          {/* 页码 */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full">
            {currentImageIndex + 1} / {visit.photos.length}
          </div>
        </div>
      )}

      <main className="px-l py-xl space-y-xl">
        {/* 基本信息 */}
        <section>
          <div className="flex justify-between items-start mb-m">
            <div>
              <h2 className="text-page-title mb-xs">{visit.title}</h2>
              <p className="text-secondary">{visit.community}</p>
            </div>
            {visit.computed.totalScore && (
              <div className="text-center">
                <div className="text-score-large text-primary">
                  {visit.computed.totalScore}
                </div>
                <div className="text-secondary text-xs">总分</div>
              </div>
            )}
          </div>

          {/* 标签 */}
          {visit.computed.breakdown && (() => {
            const tags = generateTags(visit.computed.breakdown);
            return (
              <div className="flex flex-wrap gap-xs mb-m">
                {tags.positive.map((tag, i) => (
                  <span
                    key={`pos-${i}`}
                    className="px-s py-xs bg-tag-positive-bg text-tag-positive-text text-xs rounded-tag"
                  >
                    {tag}
                  </span>
                ))}
                {tags.risk.map((tag, i) => (
                  <span
                    key={`risk-${i}`}
                    className="px-s py-xs bg-tag-risk-bg text-tag-risk-text text-xs rounded-tag"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            );
          })()}

          {/* 详细信息 */}
          <div className="space-y-s text-body">
            {visit.sourceUrl && (
              <div className="flex justify-between items-center">
                <span className="text-text-secondary">房源链接</span>
                <a
                  href={visit.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-600 flex items-center gap-1 text-sm"
                >
                  查看原链接
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            )}
            {visit.rent && (
              <div className="flex justify-between">
                <span className="text-text-secondary">租金</span>
                <span>¥{visit.rent}/月</span>
              </div>
            )}
            {visit.values.commute_min && (
              <div className="flex justify-between">
                <span className="text-text-secondary">通勤时间</span>
                <span>{visit.values.commute_min}分钟</span>
              </div>
            )}
            {visit.area && (
              <div className="flex justify-between">
                <span className="text-text-secondary">面积</span>
                <span>{visit.area}㎡</span>
              </div>
            )}
            {visit.floor && (
              <div className="flex justify-between">
                <span className="text-text-secondary">楼层</span>
                <span>{visit.floor}/{visit.totalFloor}层</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-text-secondary">创建时间</span>
              <span className="text-secondary">{formatDate(visit.createdAt)}</span>
            </div>
          </div>
        </section>

        {/* 分数贡献 */}
        {visit.computed.breakdown && (
          <section>
            <button
              onClick={() => setShowBreakdown(!showBreakdown)}
              className="w-full flex justify-between items-center py-m border-t border-b border-border-line"
            >
              <h3 className="text-section-title">分数贡献 Top5</h3>
              <span className="text-primary">{showBreakdown ? '▲' : '▼'}</span>
            </button>
            
            {showBreakdown && (
              <div className="mt-m space-y-s">
                {visit.computed.breakdown.contributions.slice(0, 5).map((item, index) => (
                  <div
                    key={item.dimensionId}
                    className="flex items-center justify-between p-m bg-hover rounded-lg"
                  >
                    <div className="flex items-center gap-m">
                      <span className="w-6 h-6 flex items-center justify-center bg-primary text-white rounded-full text-xs">
                        {index + 1}
                      </span>
                      <div>
                        <div className="text-body font-semibold">{item.dimensionName}</div>
                        <div className="text-secondary text-xs">
                          分数: {item.score.toFixed(0)} | 权重: {item.weight}
                        </div>
                      </div>
                    </div>
                    <div className="text-primary font-semibold">
                      +{item.contribution.toFixed(1)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* 速记 */}
        {(visit.quickNoteText || visit.voiceMemos.length > 0) && (
          <section>
            <h3 className="text-section-title mb-m">速记</h3>
            {visit.quickNoteText && (
              <div className="bg-hover rounded-lg p-m text-body mb-m">
                {visit.quickNoteText}
              </div>
            )}
            {visit.voiceMemos.length > 0 && (
              <div className="text-secondary">
                {visit.voiceMemos.length} 条语音备忘录
              </div>
            )}
          </section>
        )}
      </main>
      
      {/* 底部固定按钮栏 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-line px-4 py-3 safe-area-bottom">
        <button
          onClick={() => navigate(`/edit/${id}`)}
          className="w-full h-11 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 active:scale-98 transition-all shadow-sm"
        >
          编辑房源
        </button>
      </div>
    </div>
  );
}
