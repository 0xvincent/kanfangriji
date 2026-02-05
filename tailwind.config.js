/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Notion 风格配色系统
        primary: '#2383E2',  // Notion 蓝色
        'text-main': '#37352F',  // Notion 深灰（主文字）
        'text-secondary': '#787774',  // Notion 中灰（次要文字）
        'text-hint': '#9B9A97',  // Notion 浅灰（提示文字）
        'border-line': '#E9E9E7',  // Notion 边框
        'bg-hover': '#F7F6F3',  // Notion 悬停背景
        'bg-page': '#FFFFFF',  // 页面背景
        'tag-positive-bg': '#DDEDEA',  // Notion 绿色标签背景
        'tag-positive-text': '#0F7B6C',  // Notion 绿色标签文字
        'tag-risk-bg': '#FFE2DD',  // Notion 红色标签背景
        'tag-risk-text': '#D44C47',  // Notion 红色标签文字
      },
      fontSize: {
        'page-title': ['22px', { lineHeight: '1.4', fontWeight: '600' }],
        'section-title': ['18px', { lineHeight: '1.4', fontWeight: '600' }],
        'body': ['16px', { lineHeight: '1.5', fontWeight: '400' }],
        'secondary': ['14px', { lineHeight: '1.5', fontWeight: '400' }],
        'score-large': ['24px', { lineHeight: '1.2', fontWeight: '600' }],
      },
      spacing: {
        'xs': '4px',
        's': '8px',
        'm': '12px',
        'l': '16px',
        'xl': '24px',
        'xxl': '32px',
      },
      borderRadius: {
        'card': '12px',
        'button': '10px',
        'tag': '999px',
      },
    },
  },
  plugins: [],
}
