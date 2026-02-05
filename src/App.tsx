import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useAppStore } from './stores/appStore';

function App() {
  const { initialize, isLoading, error } = useAppStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="text-page-title text-text-secondary mb-m">看房笔记</div>
          <div className="text-body text-text-hint">加载中...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="text-body text-red-500 mb-m">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="text-primary text-body"
          >
            重新加载
          </button>
        </div>
      </div>
    );
  }

  return <Outlet />;
}

export default App;
