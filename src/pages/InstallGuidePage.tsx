// 安装引导页 - 教用户如何添加到主屏幕
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import BottomNav from '../components/BottomNav';

export default function InstallGuidePage() {
  const navigate = useNavigate();
  const [platform, setPlatform] = useState<'ios' | 'android' | 'unknown'>('unknown');

  // 检测设备平台
  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(ua)) {
      setPlatform('ios');
    } else if (/android/.test(ua)) {
      setPlatform('android');
    } else {
      setPlatform('ios'); // 默认显示 iOS
    }
  }, []);

  // 检查是否已经在 PWA 模式下运行
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

  return (
    <div className="min-h-screen bg-bg-page pb-20">
      {/* 顶部栏 */}
      <header className="sticky top-0 z-10 bg-white border-b border-line">
        <div className="safe-top-spacer" />
        <div className="h-11 px-4 flex items-center justify-between">
          <button onClick={() => navigate('/settings')} className="text-primary font-medium">
            ← 返回
          </button>
          <h1 className="text-lg font-medium text-main">安装指南</h1>
          <div className="w-12" />
        </div>
      </header>

      <main className="px-4 py-6">
        {/* 已安装提示 */}
        {isStandalone && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
            <div className="flex items-start">
              <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-medium text-green-800">✅ 已成功安装！</p>
                <p className="text-sm text-green-700 mt-1">你正在使用 PWA 应用模式，体验最佳！</p>
              </div>
            </div>
          </div>
        )}

        {/* 标题和说明 */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-main mb-2">添加到主屏幕</h2>
          <p className="text-secondary">
            将「看房笔记」添加到桌面，像原生 App 一样使用，无需浏览器，数据永久保存！
          </p>
        </div>

        {/* 优势说明 */}
        <div className="mb-8 bg-hover p-4 rounded-xl">
          <h3 className="font-semibold text-main mb-3 flex items-center">
            <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            为什么要添加到桌面？
          </h3>
          <ul className="space-y-2 text-sm text-secondary">
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <span>全屏体验，无浏览器地址栏干扰</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <span>数据永久保存在本地，不会丢失</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <span>打开速度更快，离线也能使用</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <span>桌面图标，像真正的 App 一样方便</span>
            </li>
          </ul>
        </div>

        {/* 平台切换 */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setPlatform('ios')}
            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-colors ${
              platform === 'ios'
                ? 'bg-primary text-white'
                : 'bg-hover text-secondary hover:bg-gray-200'
            }`}
          >
            <div className="flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
              </svg>
              iPhone / iPad
            </div>
          </button>
          <button
            onClick={() => setPlatform('android')}
            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-colors ${
              platform === 'android'
                ? 'bg-primary text-white'
                : 'bg-hover text-secondary hover:bg-gray-200'
            }`}
          >
            <div className="flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.6 9.48l1.84-3.18c.16-.31.04-.69-.26-.85-.29-.15-.65-.06-.83.22l-1.88 3.24c-2.86-1.21-6.08-1.21-8.94 0L5.65 5.67c-.19-.28-.55-.37-.83-.22-.3.16-.42.54-.26.85l1.84 3.18C4.8 10.85 3.5 12.62 3.5 14.5h17c0-1.88-1.3-3.65-2.9-5.02zM7 12.75c-.41 0-.75-.34-.75-.75s.34-.75.75-.75.75.34.75.75-.34.75-.75.75zm10 0c-.41 0-.75-.34-.75-.75s.34-.75.75-.75.75.34.75.75-.34.75-.75.75z" />
              </svg>
              Android
            </div>
          </button>
        </div>

        {/* iOS 安装步骤 */}
        {platform === 'ios' && (
          <div className="space-y-4">
            <div className="bg-white border border-line rounded-xl p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold mr-3">
                  1
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-main mb-2">点击底部「分享」按钮</h4>
                  <p className="text-sm text-secondary mb-3">
                    在 Safari 浏览器底部找到「分享」图标（方框带向上箭头）
                  </p>
                  <div className="bg-hover p-3 rounded-lg flex items-center justify-center">
                    <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-line rounded-xl p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold mr-3">
                  2
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-main mb-2">选择「添加到主屏幕」</h4>
                  <p className="text-sm text-secondary mb-3">
                    在弹出的菜单中，向下滚动找到「添加到主屏幕」选项
                  </p>
                  <div className="bg-hover p-3 rounded-lg">
                    <div className="flex items-center text-primary">
                      <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      <span className="font-medium">添加到主屏幕</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-line rounded-xl p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold mr-3">
                  3
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-main mb-2">点击右上角「添加」</h4>
                  <p className="text-sm text-secondary mb-3">
                    确认应用名称，点击右上角蓝色的「添加」按钮
                  </p>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-sm text-green-700 font-medium">✅ 完成！桌面上会出现「看房笔记」图标</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Android 安装步骤 */}
        {platform === 'android' && (
          <div className="space-y-4">
            <div className="bg-white border border-line rounded-xl p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold mr-3">
                  1
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-main mb-2">点击右上角「菜单」按钮</h4>
                  <p className="text-sm text-secondary mb-3">
                    在 Chrome 浏览器右上角找到「三个点」菜单图标
                  </p>
                  <div className="bg-hover p-3 rounded-lg flex items-center justify-center">
                    <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-line rounded-xl p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold mr-3">
                  2
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-main mb-2">选择「安装应用」或「添加到主屏幕」</h4>
                  <p className="text-sm text-secondary mb-3">
                    在菜单中找到「安装应用」（或「添加到主屏幕」）选项
                  </p>
                  <div className="bg-hover p-3 rounded-lg">
                    <div className="flex items-center text-primary">
                      <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      <span className="font-medium">安装应用</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-line rounded-xl p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold mr-3">
                  3
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-main mb-2">点击「安装」按钮</h4>
                  <p className="text-sm text-secondary mb-3">
                    在弹出的对话框中，点击「安装」或「添加」按钮
                  </p>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-sm text-green-700 font-medium">✅ 完成！桌面上会出现「看房笔记」图标</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 重要提示 */}
        <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg">
          <div className="flex items-start">
            <svg className="w-6 h-6 text-yellow-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p className="font-medium text-yellow-800 mb-2">⚠️ 重要提示</p>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• <strong>不要重复添加</strong>：每次添加会创建新实例，数据不互通</li>
                <li>• <strong>使用桌面图标打开</strong>：直接点击图标，不要通过浏览器</li>
                <li>• <strong>定期备份</strong>：在设置页面使用导出功能备份数据</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 遇到问题？ */}
        <div className="mt-6 text-center">
          <p className="text-sm text-secondary mb-2">遇到问题？</p>
          <button
            onClick={() => navigate('/settings')}
            className="text-primary font-medium hover:underline"
          >
            查看设置页面的数据安全说明 →
          </button>
        </div>
      </main>

      {/* 底部导航 */}
      <BottomNav />
    </div>
  );
}
