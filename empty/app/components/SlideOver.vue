<script setup lang="ts">
const socials = [
	{
		id: 1,
		name: 'telegram',
		icon: 'i-ic:baseline-telegram',
		link: 'https://t.me/+K_LPTotS-3dhYzYy',
	},
	{
		id: 2,
		name: 'instagram',
		icon: 'i-mdi:instagram',
		link: 'https://www.instagram.com/invites/contact/?igsh=368l1cqqg1yv&utm_content=1cjl5ty',
	},
];
</script>

<template>
	<USlideover class="max-w-[320px]" title="Полезные ссылки" close-icon="i-akar-icons:cross">
		<template #body>
			<div class="flex flex-col h-full">
				<ul class="grid grid-cols-5 gap-2">
					<li v-for="item in socials" :key="item.id">
						<nuxt-link :to="item.link" target="_blank" external>
							<UIcon :name="item.icon" class="size-10" />
						</nuxt-link>
					</li>
				</ul>
				<div class="mt-auto">
					<nuxt-link to="https://t.me/beachislove" target="_blank" external title="Тыкни" class="text-[12px] text-emerald-400">
						Разработано с любовью ❤️ - <span class="text-black dark:text-white">@beachislove</span> 
					</nuxt-link>
				</div>
			</div>
		</template>
	</USlideover>
</template>