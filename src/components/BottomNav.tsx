// 底部导航组件 - 所有页面通用
import { useNavigate, useLocation } from 'react-router-dom';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-line z-10">
      {/* 图标区（固定52px） */}
      <div className="h-13 flex items-center justify-around px-6">
        <button
          onClick={() => navigate('/')}
          className={`p-2.5 rounded-xl ${isActive('/') ? '' : 'hover:bg-hover transition-colors'}`}
        >
          <svg
            className={`w-6 h-6 ${isActive('/') ? 'text-main' : 'text-hint'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
        </button>
        <button
          onClick={() => navigate('/compare')}
          className={`p-2.5 rounded-xl ${isActive('/compare') ? '' : 'hover:bg-hover transition-colors'}`}
        >
          <svg
            className={`w-6 h-6 ${isActive('/compare') ? 'text-main' : 'text-hint'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </button>
        <button
          onClick={() => navigate('/weights')}
          className={`p-2.5 rounded-xl ${isActive('/weights') ? '' : 'hover:bg-hover transition-colors'}`}
        >
          <svg
            className={`w-6 h-6 ${isActive('/weights') ? 'text-main' : 'text-hint'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
            />
          </svg>
        </button>
        <button
          onClick={() => navigate('/install')}
          className={`p-2.5 rounded-xl ${isActive('/install') ? '' : 'hover:bg-hover transition-colors'}`}
        >
          <svg
            className={`w-6 h-6 ${isActive('/install') ? 'text-main' : 'text-hint'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
        </button>
      </div>
      {/* 安全区占位 */}
      <div className="safe-bottom-spacer" />
    </nav>
  );
}
