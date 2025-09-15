<script setup lang="ts">

const emit = defineEmits<{
  close: []
}>();

const store = useStore();
const drawerContent = useDrawer();

const props = withDefaults(defineProps<{ title: string; descr?: string; state?: string }>(), {
	descr: 'Напишите ваш email:',
	state: 'base',
});

const states = reactive({
	email: '',
	loading: false,
	errorText: null as null | string,
});

const isNotValidEmail = computed(() => {
	const email = states.email.trim();
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

	return !emailRegex.test(email);
});

async function setEmailUser(val: string) {
	store.value.email = val;

	store.value.phone = null;
	store.value.firstname = null;
	store.value.lastname = null;
	store.value.password = null;
	store.value.avatar = null;
	store.value.buy_link = null;
	store.value.is_new_user = false;
	store.value.have_workout = false;
}

const handleEmail = async () => {
	if (isNotValidEmail.value) {
		return;
	}

	setEmailUser(states.email.trim());
	emit('close');

	setTimeout(() => {
		drawerContent.value.isOpen = true;
	}, 500);
};

const handleAcceptChange = () => {
	setEmailUser(states.email.trim());
	emit('close');
};
</script>

<template>
	<UModal :title="props.title" :close="{
		color: 'neutral',
		variant: 'solid',
	}">
		<template #body>
			<article>
				<header>
					<span>{{ props.descr }} </span>
				</header>

				<main class="py-2">
					<template v-if="states.loading">
						<div class="w-full flex justify-center">
							<div class="spinner" />
						</div>
					</template>

					<template v-else-if="states.errorText !== null">
						<span class="text-red-400">{{ states.errorText }}</span>
						<UButton class="mt-2 block" @click="states.errorText = null">Попробовать еще</UButton>
					</template>
					<template v-else>
						<UInput v-model="states.email" placeholder="Введите ваш email" class="w-full flex" />
						<span v-if="isNotValidEmail && states.email.trim() !== ''" class="text-red-400 text-[12px]">
							Некорректный email
						</span>

						<UButton v-if="props.state === 'email'" class="mt-4 block" :disabled="isNotValidEmail"
							@click="handleAcceptChange">
							Принять
						</UButton>
						<UButton v-else class="mt-4 block" :disabled="isNotValidEmail" @click="handleEmail">Поиск
						</UButton>
					</template>
				</main>
			</article>
		</template>
	</UModal>
</template>
