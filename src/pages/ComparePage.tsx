// 对比页 - Notion风格
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../stores/appStore';
import { sortVisits } from '../utils/scoring';
import type { Visit } from '../types';

export default function ComparePage() {
  const navigate = useNavigate();
  const { visits, updateVisit } = useAppStore();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showAll, setShowAll] = useState(false);

  // 候选房源（status === 'candidate'）或全部
  const candidateVisits = showAll 
    ? visits 
    : visits.filter(v => v.status === 'candidate');
  
  // 按总分排序
  const sortedVisits = sortVisits(candidateVisits, 'totalScore', 'desc');

  // 获取要显示的维度（前5个有分数的）
  const getTopDimensions = (visit: Visit) => {
    if (!visit.computed.breakdown?.contributions) return [];
    return visit.computed.breakdown.contributions.slice(0, 5);
  };

  // 切换选中状态
  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else if (newSet.size < 6) {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  // 切换候选状态
  const toggleCandidate = async (visit: Visit) => {
    const newStatus: Visit['status'] = visit.status === 'candidate' ? 'none' : 'candidate';
    await updateVisit(visit.id, { status: newStatus });
  };

  // 获取分数颜色
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 60) return 'bg-blue-500';
    if (score >= 40) return 'bg-yellow-500';
    return 'bg-red-400';
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Notion风格顶部 */}
      <header className="h-14 px-4 flex items-center justify-between sticky top-0 bg-white z-10">
        <h1 className="text-lg font-medium text-gray-900">对比</h1>
        <div className="flex items-center gap-3">
          {/* 切换显示范围 */}
          <button
            onClick={() => setShowAll(!showAll)}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              showAll 
                ? 'bg-gray-100 text-gray-600' 
                : 'bg-blue-50 text-blue-600'
            }`}
          >
            {showAll ? '全部' : '仅候选'}
          </button>
        </div>
      </header>

      <main className="px-4">
        {sortedVisits.length === 0 ? (
          /* 空状态 */
          <div className="flex flex-col items-center justify-center pt-24">
            <svg className="w-12 h-12 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-gray-400 text-center">
              {showAll ? '还没有房源记录' : '还没有候选房源'}
            </p>
            <p className="text-gray-300 text-sm text-center mt-1">
              {showAll ? '去首页添加房源' : '在房源详情页标记为候选'}
            </p>
            {!showAll && (
              <button
                onClick={() => setShowAll(true)}
                className="mt-4 text-blue-500 text-sm"
              >
                查看全部房源
              </button>
            )}
          </div>
        ) : (
          /* 对比表格 */
          <div className="space-y-4 pt-2">
            {/* 提示信息 */}
            <div className="text-xs text-gray-400 flex items-center gap-2">
              <span>共 {sortedVisits.length} 套</span>
              {selectedIds.size > 0 && (
                <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                  已选 {selectedIds.size}/6
                </span>
              )}
            </div>

            {/* 房源卡片列表 */}
            {sortedVisits.map((visit, index) => (
              <div
                key={visit.id}
                className={`rounded-xl border transition-all ${
                  selectedIds.has(visit.id)
                    ? 'border-blue-300 bg-blue-50/30'
                    : 'border-gray-100 hover:border-gray-200'
                }`}
              >
                {/* 卡片头部 */}
                <div 
                  className="p-4 cursor-pointer"
                  onClick={() => navigate(`/detail/${visit.id}`)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {/* 排名 */}
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium ${
                        index === 0 ? 'bg-yellow-100 text-yellow-700' :
                        index === 1 ? 'bg-gray-100 text-gray-600' :
                        index === 2 ? 'bg-orange-100 text-orange-700' :
                        'bg-gray-50 text-gray-400'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">{visit.title}</h3>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {visit.community}
                          {visit.rent && ` · ¥${visit.rent}`}
                        </p>
                      </div>
                    </div>
                    
                    {/* 总分 */}
                    <div className="text-right">
                      <span className="text-2xl font-semibold text-gray-900">
                        {visit.computed.totalScore || '--'}
                      </span>
                      <span className="text-xs text-gray-400 ml-0.5">分</span>
                    </div>
                  </div>

                  {/* 维度分数条 */}
                  {visit.computed.breakdown && (
                    <div className="space-y-2">
                      {getTopDimensions(visit).map((item) => (
                        <div key={item.dimensionId} className="flex items-center gap-2">
                          <span className="text-xs text-gray-500 w-16 truncate">
                            {item.dimensionName}
                          </span>
                          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${getScoreColor(item.score)}`}
                              style={{ width: `${item.score}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-400 w-8 text-right">
                            {item.score.toFixed(0)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 卡片底部操作 */}
                <div className="px-4 py-3 border-t border-gray-50 flex items-center justify-between">
                  {/* 选择按钮 */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSelect(visit.id);
                    }}
                    className={`flex items-center gap-1.5 text-sm ${
                      selectedIds.has(visit.id) ? 'text-blue-600' : 'text-gray-400'
                    }`}
                  >
                    <svg className="w-4 h-4" fill={selectedIds.has(visit.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    选中
                  </button>

                  {/* 候选按钮 */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleCandidate(visit);
                    }}
                    className={`flex items-center gap-1.5 text-sm ${
                      visit.status === 'candidate' ? 'text-yellow-600' : 'text-gray-400'
                    }`}
                  >
                    <svg className="w-4 h-4" fill={visit.status === 'candidate' ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                    候选
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Notion风格底部导航 */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white flex items-center justify-around px-6 border-t border-gray-50">
        <button
          onClick={() => navigate('/')}
          className="p-3 rounded-xl hover:bg-gray-100 transition-colors"
        >
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </button>
        <button className="p-3 rounded-xl">
          <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </button>
        <button
          onClick={() => navigate('/weights')}
          className="p-3 rounded-xl hover:bg-gray-100 transition-colors"
        >
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
          </svg>
        </button>
        <button
          onClick={() => navigate('/dimensions')}
          className="p-3 rounded-xl hover:bg-gray-100 transition-colors"
        >
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
        </button>
      </nav>
    </div>
  );
}
