import Tailwind from '@tailwindcss/vite';
import ru from 'proxima-vue/locale/ru';

export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  app: {
		rootTag: 'main',
		head: {
			title: 'Bodyline - marathons app',
			script: [
				{
					src: 'https://telegram.org/js/telegram-web-app.js',
				},
			],
		},
		rootAttrs: {
			class: 'bg-[var(--ui-bg)]',
		},
	},
 modules: [
		'@nuxt/ui', 
		'@nuxt/eslint', 
		'@nuxt/image',
    'proxima-vue/nuxt',
	],
  proxima: {
		injectStyles: false,
		injectComponents: true,
		injectComposables: true,
		lang: 'ru',
    	locales: { ru },
		// other options
	},
  css: ['~/assets/css/main.css'],
  vite: {
		plugins: [Tailwind()],
	},
  ui: {
		theme: {
			colors: ['primary', 'secondary', 'tertiary', 'info', 'success', 'warning', 'error'],
		},
	},
})
