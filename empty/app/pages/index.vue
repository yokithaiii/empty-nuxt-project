<script setup lang="ts">
import type { IMarathon } from '~/types/marathon';

const states = reactive({
	text: '',
	loading: false,
	errorText: null as null | string,
	data: null as null | IMarathon,
	disabled: false
});

const store = useStore();
const drawerContent = useDrawer();
const colorMode = useColorMode();

const openModalEmail = () => {
	store.value.phone = null;
	store.value.firstname = null;
	store.value.lastname = null;
	store.value.password = null;
	store.value.avatar = null;
	store.value.buy_link = null;
	store.value.is_new_user = false;
	store.value.have_workout = false;
	drawerContent.value.isOpen = true;
	drawerContent.value.state = 'get-email-page';
};

const getMarathon = async () => {
	states.loading = true;
	try {
		const res = await $fetch.raw<IMarathon>(useApi() + `/get-marathon`);

		if (res.status === 200 && res._data) {
			states.data = res._data;
		} else {
			states.disabled = true;
		}

	} catch (err: any) {
		states.errorText = null;
		states.disabled = true;
		console.error(err);
		states.errorText = err.data.error || 'Что - то пошло не так, попробуйте еще';
	} finally {
		states.loading = false;
	}
};

onMounted(() => {
	getMarathon();
	colorMode.preference = 'dark';
});

</script>

<template>
	<section class="l-index">
		<div class="bg-zinc-950 dark:bg-zinc-950 rounded-[8px] mt-1">
			<div class="l-wrapper">
				<div class="py-4">
					<template v-if="states.loading">
						<USkeleton class="mt-2 h-[250px] w-[250px]" />
					</template>
					<template v-else>
						<img :src="states.data?.image" class="l-image" alt="">
					</template>
				</div>
			</div>
		</div>
		<div class="bg-zinc-950 dark:bg-zinc-950 rounded-[8px] mt-1">
			<div class="l-wrapper">
				<div class="py-4">
					<h1 class="text-xl text-white">
						Привет<span class="text-emerald-400 ml-[2px]">!</span>
					</h1>

					<template v-if="states.loading">
						<USkeleton class="mt-2 h-5 w-[300px] mb-1" />
						<USkeleton class="mt-2 h-5 w-[250px]" />
					</template>
					<template v-else>
						<h2 class="text-lg text-white mt-2">
							Вы на странице покупки марафона -
							<br>
							<span class="text-emerald-400">{{ states.data?.title ?? 'Не удалось загрузить марафон'
								}}</span>
						</h2>
					</template>

					<div v-if="store.email" class="mt-2 text-white">
						<span class="text-[14px]">
							Указанная почта:
							<span class="text-emerald-400 decoration-underline" @click="openModalEmail">
								{{ store.email }}
							</span>
							- нажмите чтобы изменить
						</span>
					</div>

					<main-buttons :loading="states.loading" :disabled="states.disabled" />

				</div>
			</div>
		</div>

		<UDrawer v-model:open="drawerContent.isOpen">
			<template #content>
				<article class="my-4 px-2 h-screen overflow-y-auto">

					<template v-if="drawerContent.state === 'get-email-page'">
						<action-get-email />
					</template>

					<template v-if="drawerContent.state === 'payment-page'">
						<action-payment-page />
					</template>

					<template v-if="drawerContent.state === 'final-page'">
						<action-final-page />
					</template>

					<template v-if="drawerContent.state === 'get-phone-page'">
						<action-get-phone />
					</template>

				</article>
			</template>
		</UDrawer>
	</section>
</template>

<style scoped>
.l-index {
	padding-bottom: 100px;
}
.decoration-underline {
    background: #252525;
    padding: 5px;
    border: 1px solid;
    border-radius: 6px;
    width: 100%;
    display: block;
    margin: 5px 0;
}
.l-image {
	border-radius: 4px;
}
</style>