// 工具函数

// 生成唯一ID
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// 防抖函数（用于自动保存）
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function(...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// 格式化日期
export function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// 格式化时间
export function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

// 格式化日期时间
export function formatDateTime(timestamp: number): string {
  return `${formatDate(timestamp)} ${formatTime(timestamp)}`;
}

// 裁剪数值到范围内
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
