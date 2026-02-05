// 设置页
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import BottomNav from '../components/BottomNav';

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
      <header className="sticky top-0 z-10 bg-white border-b border-border-line">
        {/* 安全区占位 */}
        <div className="safe-top-spacer" />
        {/* 内容区（固定44px） */}
        <div className="h-11 px-l flex items-center justify-between">
          <button onClick={() => navigate('/')} className="text-primary font-medium">← 返回</button>
          <h1 className="text-section-title">设置</h1>
          <div className="w-12" />
        </div>
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
        
        {/* 安装教程 */}
        <section>
          <h2 className="text-section-title mb-m">安装教程</h2>
          <button
            onClick={() => navigate('/install')}
            className="w-full flex items-center justify-between py-4 border-b border-border-line text-body hover:bg-hover transition-colors rounded-lg px-4"
          >
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <div className="text-left">
                <div className="font-medium">如何添加到桌面</div>
                <div className="text-xs text-hint">iOS 和 Android 安装指南</div>
              </div>
            </div>
            <svg className="w-5 h-5 text-hint" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </section>
        
        {/* 评分设置 */}
        <section>
          <h2 className="text-section-title mb-m">评分设置</h2>
          <div className="space-y-2">
            <button
              onClick={() => navigate('/dimensions')}
              className="w-full flex items-center justify-between py-4 border-b border-border-line text-body hover:bg-hover transition-colors rounded-lg px-4"
            >
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                <div className="text-left">
                  <div className="font-medium">维度管理</div>
                  <div className="text-xs text-hint">管理评分项目和启用状态</div>
                </div>
              </div>
              <svg className="w-5 h-5 text-hint" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            
            <button
              onClick={() => navigate('/weights')}
              className="w-full flex items-center justify-between py-4 border-b border-border-line text-body hover:bg-hover transition-colors rounded-lg px-4"
            >
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
                <div className="text-left">
                  <div className="font-medium">权重设置</div>
                  <div className="text-xs text-hint">调整各项目的重要程度</div>
                </div>
              </div>
              <svg className="w-5 h-5 text-hint" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </section>
        
        {/* 数据管理 */}
        <section>
          <h2 className="text-section-title mb-m">数据管理</h2>
          <button
            onClick={() => navigate('/export')}
            className="w-full flex items-center justify-between py-4 border-b border-border-line text-body hover:bg-hover transition-colors rounded-lg px-4"
          >
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              <div className="text-left">
                <div className="font-medium">导出/备份</div>
                <div className="text-xs text-hint">导出所有房源数据</div>
              </div>
            </div>
            <svg className="w-5 h-5 text-hint" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </section>
      </main>

      {/* 底部导航 */}
      <BottomNav />
    </div>
  );
}
