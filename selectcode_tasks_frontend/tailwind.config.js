import flowbitePlugin from 'flowbite/plugin';

/** @type {import('tailwindcss').Config} */
export default {
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		'./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'
	],
	theme: {
		extend: {
			screens: {
				xsm: '370px',
				cbp: '400px',
				ssm: '500px',
				hxs: { raw: '(min-height: 250px)' },
				hsm: { raw: '(min-height: 330px)' },
				hmd: { raw: '(min-height: 440px)' },
				hlg: { raw: '(min-height: 700px)' },
				hxl: { raw: '(min-height: 800px)' },
				till_hxl: { raw: '(max-height: 800px)' },
				h2xl: { raw: '(min-height: 900px)' },
				till_h2xl: { raw: '(max-height: 900px)' },
				till_xl: { raw: '(max-width: 1280px)' },
				till_sm: { raw: '(max-width: 640px)' },
				till_md: { raw: '(max-width: 768px)' },
				till_lg: { raw: '(max-width: 1024px)' },
				till_cbp: { raw: '(max-width: 400px)' },
				till_ssm: { raw: '(max-width: 500px)' }
			},
			colors: {
				// flowbite-svelte
				primary: {
					50: '#FFF5F2',
					100: '#FFF1EE',
					200: '#FFE4DE',
					300: '#FFD5CC',
					400: '#FFBCAD',
					500: '#FE795D',
					600: '#EF562F',
					700: '#EB4F27',
					800: '#CC4522',
					900: '#A5371B'
				}
			}
		}
	},
	plugins: [flowbitePlugin]
};
