<script setup lang="ts">
import { SlideOver } from '#components';

const overlay = useOverlay();
const slideover = overlay.create(SlideOver);

const openSlideover = () => {
	slideover.open();
}
</script>

<template>
	<header class="relative rounded-[8px] z-10 bg-zinc-950 dark:bg-zinc-950">
		<div class="l-wrapper">
			<div class="flex items-center justify-between gap-4 py-4">
				<nuxt-link to="/" class="flex items-center gap-[10px] font-semibold">
					<div class="w-[30px] h-[30px]">
						<img src="../assets/img/logo.png" alt="">
					</div>
					<span class="text-xl mt-[5px] text-emerald-400">BODYLINE MARATHONS</span>
				</nuxt-link>

				<div class="flex items-center gap-1">
					<button class="flex" @click="openSlideover">
						<UIcon name="i-prime:align-justify" class="size-7 bg-emerald-400" />
					</button>
				</div>
			</div>
		</div>
	</header>
</template>
