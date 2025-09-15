<script setup lang="ts">
const drawerContent = useDrawer();
const store = useStore();

const props = defineProps<{
	loading: boolean;
	disabled: boolean;
}>();

const openCardDetail = (state: string) => {
	if (store.value.email) {
		if (store.value.have_workout) {
			drawerContent.value.state = 'final-page';
		} else {
			drawerContent.value.state = 'payment-page';
		}
	} else {
		drawerContent.value.state = state;
	}
	drawerContent.value.isOpen = true;
};

const actionButtons = [
	{
		id: 1,
		title: 'Купить марафон 🏆',
		state: 'get-email-page',
	}
];
</script>

<template>
	<section class="l-buttons gap-1 mt-4 l-fixed">
		<UButton class="justify-center  b-0 l-0 bg-emerald-400" v-for="item in actionButtons" :key="item.id" size="lg"
			@click="openCardDetail(item.state)" :disabled="disabled">
			<UIcon v-if="props.loading" name="svg-spinners:ring-resize" class="size-5" />
			<span v-else class="text-[18px] line-clamp-1"> {{ item.title }} </span>
		</UButton>
	</section>
</template>

<style scoped>
.l-buttons {
	display: grid;
	grid-template-columns: 1fr;
}
.l-fixed {
	position: fixed;
    bottom: 50px;
    left: 0;
	width: 100%;
    padding: 0 10px;
}
</style>
