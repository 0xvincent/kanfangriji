/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 基于视觉设计规范的色彩系统
        primary: '#2F80ED',
        'text-main': '#222222',
        'text-secondary': '#666666',
        'text-hint': '#999999',
        'border-line': '#EAEAEA',
        'tag-positive-bg': '#EAF6EF',
        'tag-positive-text': '#2E7D32',
        'tag-risk-bg': '#FDECEA',
        'tag-risk-text': '#C62828',
      },
      fontSize: {
        'page-title': ['20px', { lineHeight: '1.4', fontWeight: '600' }],
        'section-title': ['16px', { lineHeight: '1.4', fontWeight: '600' }],
        'body': ['14px', { lineHeight: '1.5', fontWeight: '400' }],
        'secondary': ['12px', { lineHeight: '1.5', fontWeight: '400' }],
        'score-large': ['22px', { lineHeight: '1.2', fontWeight: '600' }],
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
