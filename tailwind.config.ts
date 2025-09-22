import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      'xxl': '1536px',
    },
    extend: {
      fontFamily: {
        'nunito': ['var(--font-nunito)', 'sans-serif'],
      },
      colors: {
        primary: '#ffffff',
        accent: '#ff6b00', // Orange accent color
        text: '#000000',
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '20px',
      },
      boxShadow: {
        'glass': '0 4px 30px rgba(0, 0, 0, 0.1)',
        'card': '0 8px 32px rgba(0, 0, 0, 0.08)',
        'input': '0 8px 32px rgba(255, 107, 0, 0.1), 0 0 0 1px rgba(255, 107, 0, 0.1)',
        'navbar': '4px 4px 0px 0px rgba(0, 0, 0, 0.15)',
      },
      backdropBlur: {
        'glass': '8px',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'input-glow': 'inputGlow 2s ease-in-out infinite',
      },
      utilities: {
        '.no-scrollbar': {
          /* Hide scrollbar for Chrome, Safari and Opera */
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          /* Hide scrollbar for IE, Edge and Firefox */
          '-ms-overflow-style': 'none',  /* IE and Edge */
          'scrollbar-width': 'none',  /* Firefox */
        },
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        inputGlow: {
          '0%, 100%': { boxShadow: '0 0 0 1px rgba(255, 107, 0, 0.2), 0 8px 32px rgba(255, 107, 0, 0.15), 0 0 15px rgba(255, 107, 0, 0.1)' },
          '50%': { boxShadow: '0 0 0 1px rgba(255, 107, 0, 0.3), 0 8px 32px rgba(255, 107, 0, 0.25), 0 0 15px rgba(255, 107, 0, 0.2)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;