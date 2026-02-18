import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';
import animate from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
export default {
	darkMode: ['class'],
	content: [
		'./vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
		'./storage/framework/views/*.php',
		'./resources/views/**/*.blade.php',
		'./resources/js/**/*.tsx',
		// Force scan of new Tenant/Gastronomy components
	],

	theme: {
		extend: {
			fontFamily: {
				sans: [
					'Figtree',
					...defaultTheme.fontFamily.sans
				]
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				gradient: {
					to: { backgroundPosition: 'var(--bg-size, 300%) 0' },
				},
				ripple: {
					'0%, 100%': { transform: 'translate(-50%, -50%) scale(1)' },
					'50%': { transform: 'translate(-50%, -50%) scale(0.9)' },
				},
				'shiny-text': {
					'0%, 90%, 100%': { backgroundPosition: 'calc(-100% - var(--shiny-width)) 0' },
					'30%, 60%': { backgroundPosition: 'calc(100% + var(--shiny-width)) 0' },
				},
				marquee: {
					from: { transform: 'translateX(0)' },
					to: { transform: 'translateX(calc(-100% - var(--gap, 1rem)))' },
				},
				'marquee-vertical': {
					from: { transform: 'translateY(0)' },
					to: { transform: 'translateY(calc(-100% - var(--gap, 1rem)))' },
				},
			},
			animation: {
				gradient: 'gradient 8s linear infinite',
				ripple: 'ripple var(--duration, 2s) ease calc(var(--i, 0) * 0.2s) infinite',
				'shiny-text': 'shiny-text 8s infinite',
				marquee: 'marquee var(--duration, 40s) linear infinite',
				'marquee-vertical': 'marquee-vertical var(--duration, 40s) linear infinite',
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			}
		}
	},

	plugins: [forms, animate],
};
