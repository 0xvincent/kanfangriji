// 设置页
import { useNavigate } from 'react-router-dom';

export default function SettingsPage() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-white">
      <header className="h-12 px-l flex items-center border-b border-border-line">
        <button onClick={() => navigate('/')} className="text-primary">返回</button>
        <h1 className="text-section-title ml-m">设置</h1>
      </header>
      <main className="px-l py-xl space-y-m">
        <button
          onClick={() => navigate('/export')}
          className="w-full text-left py-m border-b border-border-line text-body"
        >
          导出/备份
        </button>
      </main>
    </div>
  );
}
