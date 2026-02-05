// 导出页
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../stores/appStore';
import { db } from '../db';

export default function ExportPage() {
  const navigate = useNavigate();
  const { visits, dimensions, currentProfile } = useAppStore();
  const [isExporting, setIsExporting] = useState(false);
  const [storageSize, setStorageSize] = useState<number>(0);

  // 计算存储占用
  useState(() => {
    const calculateStorage = async () => {
      try {
        if ('storage' in navigator && 'estimate' in navigator.storage) {
          const estimate = await navigator.storage.estimate();
          const used = estimate.usage || 0;
          setStorageSize(used);
        }
      } catch (error) {
        console.error('计算存储失败:', error);
      }
    };
    calculateStorage();
  });

  // 导出JSON
  const handleExportJSON = async () => {
    setIsExporting(true);
    try {
      const exportData = {
        version: '1.0',
        exportedAt: Date.now(),
        data: {
          visits,
          dimensions,
          profile: currentProfile
        },
        meta: {
          totalVisits: visits.length,
          totalPhotos: visits.reduce((sum, v) => sum + v.photos.length, 0),
          totalMemos: visits.reduce((sum, v) => sum + v.voiceMemos.length, 0)
        }
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `看房笔记_备份_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);

      alert('导出成功！');
    } catch (error) {
      console.error('导出失败:', error);
      alert('导出失败，请重试');
    } finally {
      setIsExporting(false);
    }
  };

  // 导出CSV（关键字段）
  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      const headers = [
        '编号',
        '标题',
        '小区',
        '租金',
        '通勤(分钟)',
        '面积',
        '总分',
        '状态',
        '创建日期'
      ];

      const rows = visits.map(v => [
        v.indexNo,
        v.title,
        v.community,
        v.rent || '',
        v.values.commute_min || '',
        v.area || '',
        v.computed.totalScore || '',
        v.status === 'candidate' ? '候选' : v.status === 'rejected' ? '淘汰' : '未标记',
        new Date(v.createdAt).toLocaleDateString()
      ]);

      const csv = [
        headers.join(','),
        ...rows.map(row => row.join(','))
      ].join('\n');

      const blob = new Blob([`\ufeff${csv}`], { // 添加BOM解决中文乱码
        type: 'text/csv;charset=utf-8;'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `看房笔记_列表_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);

      alert('CSV导出成功！');
    } catch (error) {
      console.error('CSV导出失败:', error);
      alert('CSV导出失败，请重试');
    } finally {
      setIsExporting(false);
    }
  };

  // 格式化存储大小
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };
  
  return (
    <div className="min-h-screen bg-white">
      <header className="h-12 px-l flex items-center border-b border-border-line">
        <button onClick={() => navigate('/settings')} className="text-primary">返回</button>
        <h1 className="text-section-title ml-m">导出/备份</h1>
      </header>

      <main className="px-l py-xl space-y-xl">
        {/* 数据统计 */}
        <section>
          <h2 className="text-section-title mb-m">数据统计</h2>
          <div className="space-y-s">
            <div className="flex justify-between py-s border-b border-border-line">
              <span className="text-text-secondary">房源数量</span>
              <span className="text-body font-semibold">{visits.length} 套</span>
            </div>
            <div className="flex justify-between py-s border-b border-border-line">
              <span className="text-text-secondary">照片数量</span>
              <span className="text-body font-semibold">
                {visits.reduce((sum, v) => sum + v.photos.length, 0)} 张
              </span>
            </div>
            <div className="flex justify-between py-s border-b border-border-line">
              <span className="text-text-secondary">语音备忘录</span>
              <span className="text-body font-semibold">
                {visits.reduce((sum, v) => sum + v.voiceMemos.length, 0)} 条
              </span>
            </div>
            <div className="flex justify-between py-s border-b border-border-line">
              <span className="text-text-secondary">存储占用</span>
              <span className="text-body font-semibold">{formatBytes(storageSize)}</span>
            </div>
          </div>
        </section>

        {/* 导出选项 */}
        <section>
          <h2 className="text-section-title mb-m">导出选项</h2>
          
          {/* 导出JSON */}
          <div className="border border-border-line rounded-lg p-m mb-m">
            <h3 className="text-body font-semibold mb-xs">完整备份 (JSON)</h3>
            <p className="text-secondary text-xs mb-m">
              导出所有数据，包括房源、维度、权重方案（不包含照片/音频文件）
            </p>
            <button
              onClick={handleExportJSON}
              disabled={isExporting}
              className={`w-full py-m rounded-button text-body font-semibold ${
                isExporting
                  ? 'bg-gray-300 text-text-hint'
                  : 'bg-primary text-white'
              }`}
            >
              {isExporting ? '导出中...' : '导出 JSON'}
            </button>
          </div>

          {/* 导出CSV */}
          <div className="border border-border-line rounded-lg p-m">
            <h3 className="text-body font-semibold mb-xs">关键信息 (CSV)</h3>
            <p className="text-secondary text-xs mb-m">
              导出房源列表，包含编号、小区、租金、总分等关键字段
            </p>
            <button
              onClick={handleExportCSV}
              disabled={isExporting}
              className={`w-full py-m rounded-button text-body border ${
                isExporting
                  ? 'border-gray-300 text-text-hint bg-gray-100'
                  : 'border-border-line text-text-main bg-white'
              }`}
            >
              {isExporting ? '导出中...' : '导出 CSV'}
            </button>
          </div>
        </section>

        {/* 注意事项 */}
        <section className="bg-yellow-50 border-l-4 border-yellow-500 px-m py-m">
          <h3 className="text-body font-semibold mb-s">⚠️ 注意事项</h3>
          <ul className="text-xs text-text-secondary space-y-xs list-disc list-inside">
            <li>导出的JSON文件不包含照片和音频文件</li>
            <li>建议定期备份数据，以防意外丢失</li>
            <li>导入功能正在开发中...</li>
          </ul>
        </section>
      </main>
    </div>
  );
}
