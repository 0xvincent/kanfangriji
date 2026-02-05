// 设置页
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function SettingsPage() {
  const navigate = useNavigate();
  const [isPersisted, setIsPersisted] = useState<boolean | null>(null);
  
  useEffect(() => {
    // 检查持久化存储状态
    if (navigator.storage && navigator.storage.persisted) {
      navigator.storage.persisted().then(setIsPersisted);
    }
  }, []);
  
  return (
    <div className="min-h-screen bg-white pb-20">
      <header className="sticky top-0 z-10 pt-safe h-12 px-l flex items-center justify-between border-b border-border-line bg-white">
        <button onClick={() => navigate('/')} className="text-primary font-medium">← 返回</button>
        <h1 className="text-section-title">设置</h1>
        <div className="w-12" />
      </header>
      
      <main className="px-l py-xl space-y-xl">
        {/* 数据安全说明 */}
        <section>
          <h2 className="text-section-title mb-m">数据安全</h2>
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg space-y-3">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div className="text-sm text-blue-900 space-y-2">
                <p className="font-semibold">数据存储在本地，不会上传服务器</p>
                <p>持久化存储状态：{isPersisted === null ? '检查中...' : isPersisted ? '✅ 已启用' : '⚠️ 未启用'}</p>
                <div className="text-xs space-y-1 mt-2 bg-white/50 p-2 rounded">
                  <p className="font-medium">⚠️ 重要提示：</p>
                  <p>1. <strong>不要重复添加到主屏幕</strong>，会创建新实例</p>
                  <p>2. 如果不小心删除了，可以通过浏览器访问相同网址找回数据</p>
                  <p>3. 定期使用「导出/备份」功能保存数据</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* 功能入口 */}
        <section>
          <h2 className="text-section-title mb-m">数据管理</h2>
          <button
            onClick={() => navigate('/export')}
            className="w-full flex items-center justify-between py-4 border-b border-border-line text-body hover:bg-gray-50 transition-colors rounded-lg px-4"
          >
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              <span>导出/备份</span>
            </div>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </section>
      </main>
    </div>
  );
}
