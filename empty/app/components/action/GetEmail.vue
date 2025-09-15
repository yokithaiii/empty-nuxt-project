<script setup lang="ts">
import type { StepperItem } from '@nuxt/ui'
import type { IListMarathon } from '~/types/common'
import type { IUser } from '~/types/user'

const store = useStore()
const drawerContent = useDrawer()

const states = reactive({
    loading: false,
    errorText: null as null | string,
    userData: {
        email: null,
    } as IUser,
})

onMounted(() => {
    //
})

const handleRefreshPage = () => {
    states.errorText = null;
}

const saveUserData = async () => {
    try {
        states.loading = true;
        states.errorText = null;

        if (!validateData()) {
            return;
        }

        store.value.email = states.userData.email;
        
        getData();

    } catch (err) {
        console.error('Ошибка сохранения:', err);
        states.errorText = 'Ошибка при сохранении данных';
        useToast().add({
            title: '❌ Ошибка при сохранении данных',
            close: false,
        });
    } finally {
        states.loading = false;
    }
}

const getData = async () => {
	states.loading = true;
	try {
		const res = await $fetch.raw<IListMarathon>(useApi() + `/check-user?email=` + store.value.email);

		if (res.status === 200 && res._data) {
            store.value.firstname = res._data.user.firstname;
            store.value.lastname = res._data.user.lastname;
            store.value.avatar = res._data.user.avatar_url;
            store.value.phone = res._data.user.phone;
            
            store.value.buy_link = res._data.buy_link;
            store.value.is_new_user = res._data.is_new_user;
            store.value.have_workout = res._data.have_workout;

            if (store.value.have_workout === true) {
                drawerContent.value.state = 'final-page';
                useToast().add({
                    title: '✅ У вас уже есть этот марафон!',
                    close: false,
                });
            } else {
                drawerContent.value.state = 'payment-page';
                useToast().add({
                    title: '✅ Данные успешно сохранены!',
                    close: false,
                });
            }
		}

	} catch (err: any) {
		console.error('Ошибка сохранения:', err);
        states.errorText = 'Ошибка при сохранении данных';
        useToast().add({
            title: '❌ Ошибка при сохранении данных',
            close: false,
        });
	} finally {
		states.loading = false;
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
        icon: 'ant-design:credit-card-filled'
    },
    {
        title: 'Ваши данные',
        description: 'Доступ к закрытому каналу',
        icon: 'material-symbols:person'
    }
])

const active = ref(0)

function validateData(): boolean {
    if (states.userData.email && !isValidEmail(states.userData.email)) {
        states.errorText = 'Введите корректный email';
        return false;
    }

    return true;
}

function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function clearError() {
    states.errorText = null;
}
</script>

<template>
    <div class="px-2">

        <UStepper v-model="active" :items="items" size="sm" class="w-full" disabled />

        <USeparator class="mt-4" />

        <base-page class="mt-4" :loading="states.loading" :error-text="states.errorText" :show-error-btn="true"
            @refresh="handleRefreshPage">

            <section class="l-buttons gap-1 mt-4">

                <label for="email-input" class="l-label flex">
                    <span>Ваш Email</span>
                    <input type="email" id="email-input" placeholder="ivan@bodyline.com" v-model="states.userData.email"
                        @input="clearError">
                </label>

                <label class="l-label flex">
                    <UButton class="justify-center" size="lg" @click="saveUserData" :loading="states.loading" :disabled="states.loading">
                        <span class="text-[16px] line-clamp-1">
                            {{ states.loading ? 'Сохранение...' : 'Сохранить данные' }}
                        </span>
                    </UButton>
                </label>

            </section>

        </base-page>
    </div>
</template>

<style scoped>
.l-label {
	display: flex;
	gap: 10px;
	flex-direction: column;
	margin-bottom: 20px;
}

.l-label input {
	border: 1px solid gray;
	border-radius: 10px;
	padding: 10px;
	font-size: 16px;
}

.l-label input:focus {
	outline: none;
	border-color: #de9f51;
	box-shadow: 0 0 0 1px rgb(163, 104, 15)
}
</style>