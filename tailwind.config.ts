import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ["class", "class"],
  theme: {
  	extend: {
  		colors: {
  			canvas: 'var(--canvas)',
  			surface: {
  				DEFAULT: 'var(--surface)',
  				elevated: 'var(--surface-elevated)',
  				overlay: 'var(--surface-overlay)'
  			},
  			border: 'hsl(var(--border))',
  			fg: {
  				DEFAULT: 'var(--fg)',
  				muted: 'var(--fg-muted)',
  				subtle: 'var(--fg-subtle)'
  			},
  			teal: {
  				DEFAULT: 'var(--teal)',
  				dim: 'var(--teal-dim)',
  				bright: 'var(--teal-bright)'
  			},
  			accent: {
  				green: 'var(--accent-green)',
  				red: 'var(--accent-red)',
  				blue: 'var(--teal)',
  				amber: 'var(--accent-amber)',
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			'nav-active': 'var(--nav-active-bg)',
  			'pill-active': 'var(--pill-active-bg)',
  			'pill-inactive': 'var(--pill-inactive-bg)',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		fontFamily: {
  			sans: [
  				'var(--font-geist-sans)',
  				'system-ui',
  				'sans-serif'
  			],
  			mono: [
  				'var(--font-geist-mono)',
  				'monospace'
  			]
  		},
  		fontSize: {
  			'value': [
  				'1.125rem',
  				{
  					lineHeight: '1.3',
  					fontWeight: '600'
  				}
  			],
'value-lg': [
				'1.25rem',
				{
					lineHeight: '1.3',
					fontWeight: '600'
				}
			],
			'value-hero': [
				'1.5rem',
				{
					lineHeight: '1.25',
					fontWeight: '700'
				}
			]
		},
  		boxShadow: {
  			card: '0 1px 0 0 rgba(255,255,255,0.03)',
  			'card-hover': '0 4px 24px -4px rgba(0,0,0,0.24)'
  		},
  		borderRadius: {
  			card: '16px',
  			pill: '10px',
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
