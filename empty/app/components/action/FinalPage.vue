<script setup lang="ts">
import type { StepperItem } from '@nuxt/ui'
import type { IListMarathon } from '~/types/common'

const drawerContent = useDrawer()
const store = useStore()

interface IPassword {
	password: null | string
}

const states = reactive({
	text: '',
	loading: false,
	errorText: null as null | string,
	data: null as null | IListMarathon,
	password: null as null | string,
})

const getData = async () => {
	states.loading = true;
	try {
		const res = await $fetch.raw<IListMarathon>(`${useApi()}/check-user?email=${store.value.email}`);

		if (res.status === 200 && res._data) {
			states.data = res._data;
			states.data.user.email = store.value.email;
			states.data.user.phone = store.value.phone;
		}

		if (!store.value.password) {
			const res2 = await $fetch.raw<IPassword>(`${useApi()}/get-password?email=${store.value.email}&is_new_user=${store.value.is_new_user ? 'Y' : 'N'}`);
			if (res2.status === 200 && res2._data) {
				if (states.data) {
					states.password = res2._data.password;
					store.value.password = states.password;
				}
			}
		}

		if (!states.data?.user.phone) {
			drawerContent.value.state = 'get-phone-page';
		}

	} catch (err: any) {
		states.errorText = null;
		console.error(err);
		states.errorText = err.data.error || 'Что - то пошло не так, попробуйте еще';
	} finally {
		states.loading = false;
	}
}

onMounted(() => {
	getData();
})

const handleRefreshPage = () => {
	states.errorText = null;
	getData();
}

const openApp = () => {
	window.location.href = 'bodyline://';

	setTimeout(() => {
		window.open('https://onelink.to/fj8nnp', '_blank');
	}, 500);
}

const openCloseChat = () => {
	window.open('https://t.me/+LMcFQuT-iVBhMzBi', '_blank');
}

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    useToast().add({
      title: '✅ Скопировано в буфер обмена',
      close: false,
    });
  } catch (err) {
    console.error('Ошибка копирования:', err);
    useToast().add({
      title: '❌ Не удалось скопировать',
      close: false,
    });
  }
}

const items = ref<StepperItem[]>([
	{
		title: 'Авторизация',
		description: 'Отправьте нам ваш Email',
		icon: 'ant-design:mail-outlined'
	},
	{
		title: 'Оплата',
		description: 'Доступ к тренировкам',
		icon: 'ant-design:credit-card-outlined'
	},
	{
		title: 'Ваши данные',
		description: 'Доступ к закрытому каналу',
		icon: 'material-symbols:person-outline'
	}
])

const active = ref(2)
</script>

<template>
	<div class="px-2">

		<UStepper v-model="active" :items="items" size="sm" class="w-full" disabled />

		<USeparator class="mt-4" />

		<base-page class="mt-4" :loading="states.loading" :error-text="states.errorText" :show-error-btn="true"
			@refresh="handleRefreshPage">

			<div v-if="states.data">
				<UCard variant="subtle" class="mt-[20px] text-white bg-zinc-800 dark:bg-zinc-950">
					<template #header>
						<h2 v-if="states.data.have_workout">
							Вы успешно купили марафон 💪🏽
						</h2>
						<h2 v-else>
							Мы не смогли найти вашу покупку
						</h2>
					</template>

					<div class="flex items-center gap-[10px]">
						<UChip position="bottom-right" color="success" inset>
							<UAvatar v-if="states.data.user.avatar_url" :src="states.data.user.avatar_url" size="xl" />
							<UAvatar v-else alt="B L" size="xl" />
						</UChip>
						<span>{{ states.data.user?.firstname ?? 'Имя' }} {{ states.data.user?.lastname ?? 'Фамилия' }}🏆</span>
					</div>

					<USeparator v-if="store.password && store.is_new_user" class="mt-4" />

					<div v-if="store.password && store.is_new_user"  class="mt-[10px]">
						<span>Ваши данные для входа в приложение:</span>
						<br>
						<span class="cursor-pointer text-xs" @click="copyToClipboard(states.data.user?.email ?? '')">
							Ваш логин: <code class="text-secondary text-xs">{{ states.data.user?.email ?? '' }}</code>
						</span>
						<br>
						<span class="cursor-pointer text-xs" @click="copyToClipboard(store.password ?? '')">
							Ваш новый пароль: <code class="text-secondary text-xs">{{ store.password ?? '' }}</code>
						</span>
					</div>

					<template #footer>
						<div class="l-grid">
							<UButton @click="openCloseChat()" class="justify-center bg-stone-400 dark:bg-stone-300">
								<span class="text-[14px] line-clamp-1">Открыть закрытый чат</span>
							</UButton>
							<UButton @click="openApp()" class="justify-center">
								<span class="text-[14px] line-clamp-1">Запустить приложение</span>
							</UButton>
						</div>
					</template>
				</UCard>
			</div>

			<div v-else>
				Данные не найдены
			</div>

		</base-page>
	</div>
</template>

<style scoped>
.l-grid {
	display: flex;
	flex-direction: column;
	gap: 10px;
}
</style>