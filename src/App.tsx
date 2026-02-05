import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useAppStore } from './stores/appStore';

function App() {
  const { initialize, isLoading, error, clearError } = useAppStore();
  const initialized = useRef(false);
  const location = useLocation();

  useEffect(() => {
    // 只初始化一次
    if (!initialized.current) {
      initialized.current = true;
      initialize();
    }
  }, [initialize]);

  // 路由变化时滚动到顶部（防止跳动）
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // 首次加载时显示 loading
  if (isLoading && !initialized.current) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="text-xl font-semibold text-gray-600 mb-3">看房笔记</div>
          <div className="text-sm text-gray-400">加载中...</div>
        </div>
      </div>
    );
  }

  // 错误页面，提供清除错误的选项
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="text-sm text-red-500 mb-3">{error}</div>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => clearError()}
              className="text-blue-500 text-sm"
            >
              继续使用
            </button>
            <button
              onClick={() => window.location.reload()}
              className="text-blue-500 text-sm"
            >
              重新加载
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <Outlet />;
}

export default App;
