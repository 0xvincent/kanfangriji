// 房源列表页 - Notion 风格

import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppStore } from '../stores/appStore';
import { getPhotoBlob } from '../db/operations';
import { createPhotoURL } from '../utils/imageProcessor';
import { sortVisits, generateTags } from '../utils/scoring';
import type { SortOption } from '../types';

export default function VisitListPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { visits, loadVisits } = useAppStore();
  const [thumbnails, setThumbnails] = useState<Record<string, string>>({});
  const [sortBy, setSortBy] = useState<SortOption>('totalScore');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showSortMenu, setShowSortMenu] = useState(false);

  // 排序后的房源列表
  const sortedVisits = sortVisits(visits, sortBy, sortOrder);

  // 每次进入页面时重新加载数据
  useEffect(() => {
    console.log('VisitListPage mounted or location changed');
    loadVisits();
  }, [location.pathname, loadVisits]);

  // 加载缩略图（依赖 visits 而不是 sortedVisits）
  useEffect(() => {
    const loadThumbnails = async () => {
      const urls: Record<string, string> = {};
      
      for (const visit of visits) {
        if (visit.photos.length > 0) {
          const firstPhoto = visit.photos[0];
          const blob = await getPhotoBlob(firstPhoto.thumbBlobPath);
          if (blob) {
            urls[visit.id] = createPhotoURL(blob);
          }
        }
      }
      
      setThumbnails(urls);
    };
    
    if (visits.length > 0) {
      loadThumbnails();
    }
  }, [visits]);

  const sortOptions = [
    { value: 'totalScore', label: '总分' },
    { value: 'createdAt', label: '时间' },
    { value: 'rent', label: '租金' },
    { value: 'commute', label: '通勤' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Notion风格顶部导航 - 极简 */}
      <header className="h-14 px-4 flex items-center justify-between border-b border-gray-100">
        <h1 className="text-lg font-medium text-gray-900">看房笔记</h1>
        <div className="flex items-center gap-3">
          {/* 排序按钮 */}
          <button
            onClick={() => setShowSortMenu(!showSortMenu)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
            </svg>
          </button>
          {/* 更多按钮 */}
          <button
            onClick={() => navigate('/settings')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </header>

      {/* 排序下拉菜单 */}
      {showSortMenu && (
        <div className="absolute right-4 top-14 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50 min-w-32">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                setSortBy(option.value as SortOption);
                setShowSortMenu(false);
              }}
              className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center justify-between ${
                sortBy === option.value ? 'text-gray-900' : 'text-gray-500'
              }`}
            >
              {option.label}
              {sortBy === option.value && (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}
          <div className="border-t border-gray-100 my-1" />
          <button
            onClick={() => {
              setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
              setShowSortMenu(false);
            }}
            className="w-full px-4 py-2 text-left text-sm text-gray-500 hover:bg-gray-50"
          >
            {sortOrder === 'desc' ? '↓ 降序' : '↑ 升序'}
          </button>
        </div>
      )}

      {/* 主内容区 */}
      <main className="px-4 pb-32">
        {sortedVisits.length === 0 ? (
          /* Notion风格空状态 */
          <div className="flex flex-col items-center justify-center pt-32">
            <svg className="w-12 h-12 text-blue-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-gray-400 text-center">还没有房源记录</p>
            <p className="text-gray-300 text-sm text-center mt-1">点击右下角按钮开始记录</p>
          </div>
        ) : (
          /* 房源列表 - 大卡片设计（类似贝壳/自如）*/
          <div className="space-y-4 pt-3">
            {sortedVisits.map((visit) => (
              <div
                key={visit.id}
                onClick={() => navigate(`/detail/${visit.id}`)}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm active:scale-[0.98] transition-transform cursor-pointer"
              >
                {/* 照片横向滚动区（显示最多5张照片）*/}
                {visit.photos.length > 0 ? (
                  <div className="relative">
                    {/* 横向滚动照片 - 每张32%宽度，一屏显示3张+ */}
                    <div className="flex gap-2 overflow-x-auto scrollbar-hide snap-x snap-mandatory px-1">
                      {visit.photos.slice(0, 5).map((photo, index) => (
                        <div key={photo.id} className="flex-shrink-0 w-[32%] h-44 snap-start">
                          {thumbnails[visit.id] && index === 0 ? (
                            <img
                              src={thumbnails[visit.id]}
                              alt={`${visit.title} - ${index + 1}`}
                              className="w-full h-full object-cover rounded-xl"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-50 rounded-xl flex items-center justify-center">
                              <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    {/* 照片数量标签 */}
                    <div className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                      <svg className="w-3 h-3 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                      </svg>
                      {visit.photos.length}
                    </div>
                    
                    {/* 总分角标 */}
                    {visit.computed.totalScore !== undefined && (
                      <div className="absolute top-3 left-3 bg-blue-500 text-white px-3 py-1.5 rounded-full font-semibold text-sm shadow-lg">
                        {visit.computed.totalScore}分
                      </div>
                    )}
                  </div>
                ) : (
                  /* 无照片时的占位 */
                  <div className="relative h-44 bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center rounded-t-2xl">
                    <svg className="w-16 h-16 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    {visit.computed.totalScore !== undefined && (
                      <div className="absolute top-3 left-3 bg-blue-500 text-white px-3 py-1.5 rounded-full font-semibold text-sm shadow-lg">
                        {visit.computed.totalScore}分
                      </div>
                    )}
                  </div>
                )}

                {/* 信息区域 */}
                <div className="p-4">
                  {/* 标题和小区 */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
                    {visit.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-3 line-clamp-1">
                    {visit.community}
                  </p>

                  {/* 关键信息 - 大字体显示 */}
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    {visit.rent && (
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">租金</div>
                          <div className="text-base font-semibold text-gray-900">¥{visit.rent}</div>
                        </div>
                      </div>
                    )}
                    {visit.values?.commute_min && (
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">通勤</div>
                          <div className="text-base font-semibold text-gray-900">{visit.values.commute_min}分</div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 标签 */}
                  {visit.computed.breakdown && (() => {
                    const tags = generateTags(visit.computed.breakdown);
                    return tags.positive.length > 0 || tags.risk.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {tags.positive.slice(0, 3).map((tag, i) => (
                          <span
                            key={`pos-${i}`}
                            className="px-2.5 py-1 bg-emerald-50 text-emerald-600 text-xs font-medium rounded-lg"
                          >
                            ✓ {tag}
                          </span>
                        ))}
                        {tags.risk.slice(0, 2).map((tag, i) => (
                          <span
                            key={`risk-${i}`}
                            className="px-2.5 py-1 bg-red-50 text-red-500 text-xs font-medium rounded-lg"
                          >
                            ! {tag}
                          </span>
                        ))}
                      </div>
                    ) : null;
                  })()}

                  {/* 时间 */}
                  <div className="flex items-center gap-1 text-xs text-gray-400 mt-3 pt-3 border-t border-gray-100">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {new Date(visit.createdAt).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Notion风格浮动按钮 - 右下角 */}
      <button
        onClick={() => navigate('/edit')}
        className="fixed right-5 bottom-24 w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow border border-gray-100"
      >
        <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      </button>

      {/* Notion风格底部导航 - 只有图标 */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 pb-safe">
        <div className="h-16 flex items-center justify-around px-6">
        <button className="p-3 rounded-xl">
          <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </button>
        <button
          onClick={() => navigate('/compare')}
          className="p-3 rounded-xl hover:bg-gray-100 transition-colors"
        >
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        </div>
      </nav>
    </div>
  );
}
