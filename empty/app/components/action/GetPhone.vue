<script setup lang="ts">
import type { StepperItem } from '@nuxt/ui'
import type { IUser } from '~/types/user'

const store = useStore()
const drawerContent = useDrawer()

const states = reactive({
    loading: false,
    errorText: null as null | string,
    userData: {
        phone: null,
    } as IUser,
})

onMounted(() => {
     states.userData.phone = '+7 ('
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

        // Преобразуем номер в формат для сервера (только цифры)
        const cleanPhone = states.userData.phone?.replace(/\D/g, '') || '';

        store.value.phone = cleanPhone;

        const response = await $fetch.raw(`${useApi()}/register-user`, {
            method: 'POST',
            body: {
                email: store.value.email,
                phone: states.userData.phone
            }
        });
    
        if (response.status === 200) {
            useToast().add({
                title: '✅ Номер телефона успешно сохранен!',
                close: false,
            });

            store.value.phone = cleanPhone;
            drawerContent.value.state = 'final-page';
        } else {
            throw new Error('Ошибка сервера');
        }
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

function validateData(): boolean {
    if (!states.userData.phone || states.userData.phone.length < 18) {
        states.errorText = 'Введите полный номер телефона';
        return false;
    }

    const cleanPhone = states.userData.phone.replace(/\D/g, '');
    if (cleanPhone.length !== 11) {
        states.errorText = 'Номер телефона должен содержать 11 цифр';
        return false;
    }

    if (cleanPhone.charAt(0) !== '7' && cleanPhone.charAt(0) !== '8') {
        states.errorText = 'Номер должен начинаться с 7 или 8';
        return false;
    }

    if (cleanPhone.charAt(1) !== '9') {
        states.errorText = 'Вторая цифра номера должна быть 9';
        return false;
    }

    return true;
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

                <!-- <ProximaPhone
                    class="l-label flex custom-phone-input"
                    label="Введите ваш номер телефона"
                    v-model="states.userData.phone"
                /> -->

                <input type="text" v-mask="'+7-####-##'" v-model="states.userData.phone">

                <label class="l-label flex">
                    <UButton class="justify-center" size="lg" @click="saveUserData" :loading="states.loading"
                        :disabled="states.loading">
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

.custom-phone-input input {
    background-color: red;
}
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