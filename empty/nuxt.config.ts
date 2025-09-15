import Tailwind from '@tailwindcss/vite';
// import ru from 'proxima-vue/locale/ru';

export default defineNuxtConfig({
	// span mode start
	ssr: false,
	hooks: {
		'prerender:routes'({ routes }) {
			routes.clear(); // Не создает никаких маршрутов (кроме значений по умолчанию)
		},
	},
	spaLoadingTemplate: 'spa-loading-template.html',

	// app configs
	devtools: { enabled: true },
	debug: true,
	compatibilityDate: '2024-11-01',
	future: {
		compatibilityVersion: 4,
	},
	runtimeConfig: {
		public: {
			twaToken: process.env.TELEGRAM_BOT_TOKEN,
			apiUrl: process.env.BACKEND_API_URL,
		},
	},
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
		// 'proxima-vue/nuxt',
	],
	// proxima: {
	// 	injectStyles: false,
	// 	injectComponents: true,
	// 	injectComposables: true,
	// 	lang: 'ru',
    // 	locales: { ru },
	// 	// other options
	// },
	css: ['~/assets/css/main.css'],
	vite: {
		plugins: [Tailwind()],
	},

	ui: {
		theme: {
			colors: ['primary', 'secondary', 'tertiary', 'info', 'success', 'warning', 'error'],
		},
	},
});
