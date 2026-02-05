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
  const [coverUrl, setCoverUrl] = useState<string>('');
  const [showBreakdown, setShowBreakdown] = useState(false);

  // 加载封面图
  useEffect(() => {
    const loadCover = async () => {
      if (visit && visit.photos.length > 0) {
        const blob = await getPhotoBlob(visit.photos[0].blobPath);
        if (blob) {
          setCoverUrl(createPhotoURL(blob));
        }
      }
    };
    loadCover();
  }, [visit]);

  if (!visit) {
    return <div>房源不存在</div>;
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* 顶部导航 */}
      <header className="h-12 px-l flex items-center justify-between border-b border-border-line">
        <button onClick={() => navigate('/')} className="text-primary">返回</button>
        <h1 className="text-section-title">房源详情</h1>
        <button onClick={() => navigate(`/edit/${id}`)} className="text-primary">编辑</button>
      </header>

      {/* 封面图 */}
      {coverUrl && (
        <div className="w-full h-64 bg-gray-200">
          <img src={coverUrl} alt={visit.community} className="w-full h-full object-cover" />
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
                    className="flex items-center justify-between p-m bg-gray-50 rounded-lg"
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
              <div className="bg-gray-50 rounded-lg p-m text-body mb-m">
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

        {/* 照片 */}
        {visit.photos.length > 0 && (
          <section>
            <h3 className="text-section-title mb-m">照片 ({visit.photos.length})</h3>
            <div className="text-secondary">
              点击编辑查看所有照片
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
