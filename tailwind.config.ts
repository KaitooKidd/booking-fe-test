import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      spacing: {
        header: `var(--header-height)`,
        // 'exclude-header': `calc(100vh-68px)`, // not working?
        'exclude-header': `var(--exclude-header)`,
      },
      fontFamily: {
        inter: ['var(--font-inter)'],
        roboto: ['var(--font-roboto-mono)'],
        cormorant: ['var(--font-cormorant-garamond)'],
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },

        // custom keyframes
        jump: {
          '15%': { 'border-bottom-right-radius': '3px' },
          '25%': { transform: 'translateY(9px) rotate(22.5deg)' },
          '50%': {
            transform: 'translateY(18px) scale(1, 0.9) rotate(45deg)',
            'border-bottom-right-radius': '40px',
          },
          '75%': { transform: 'translateY(9px) rotate(67.5deg)' },
          '100%': { transform: 'translateY(0) rotate(90deg)' },
        },
        shadow: {
          '0%, 100%': { transform: 'scale(1, 1)' },
          '50%': { transform: 'scale(1.2, 1)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',

        // custom animation
        jump: 'jump 0.5s linear infinite',
        shadow: 'shadow 0.5s linear infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
export default config;
