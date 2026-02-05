// 对比页
import { useNavigate } from 'react-router-dom';

export default function ComparePage() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-white">
      <header className="h-12 px-l flex items-center border-b border-border-line">
        <button onClick={() => navigate('/')} className="text-primary">返回</button>
        <h1 className="text-section-title ml-m">对比</h1>
      </header>
      <main className="px-l py-xl">
        <p className="text-text-hint text-center">对比功能开发中...</p>
      </main>
    </div>
  );
}
