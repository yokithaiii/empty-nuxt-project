<script setup lang="ts">
import type { StepperItem } from '@nuxt/ui';

interface IBuyedMarathon {
	buyed: boolean
}

const drawerContent = useDrawer();
const store = useStore();

const states = reactive({
	loading: false,
	errorText: null as null | string,
	buyed: false,
	paymentSuccess: false,
	checkingPayment: false,
});

let checkInterval: NodeJS.Timeout | null = null;

const handleRefreshPage = () => {
	states.errorText = null;
	states.loading = true;
};

const handleWebViewLoad = () => {
	states.loading = false;
};

const handleWebViewError = () => {
	states.loading = false;
	states.errorText = 'Не удалось загрузить платежную страницу';
};

const startPaymentChecking = () => {
  if (checkInterval) clearInterval(checkInterval);
  
  checkInterval = setInterval(async () => {
    if (states.paymentSuccess) {
      clearInterval(checkInterval!);
      return;
    }
    
    await checkPaymentStatus();
  }, 3000);
};

async function checkPaymentStatus() {
  if (states.checkingPayment) return;
  
  states.checkingPayment = true;
  try {
    const res = await $fetch.raw<IBuyedMarathon>(
      useApi() + `/check-buy?email=` + store.value.email
    );

    if (res.status === 200 && res._data?.buyed) {
      states.buyed = true;
      states.paymentSuccess = true;
      if (checkInterval) clearInterval(checkInterval);
    }
  } catch (error) {
    console.error('Ошибка проверки статуса оплаты:', error);
  } finally {
    states.checkingPayment = false;
  }
}

const handleMessage = (event: MessageEvent) => {
	try {
		const data = JSON.parse(event.data);

		if (data.type === 'payment_success') {
			console.log('Платеж успешен:', data);
		} else if (data.type === 'payment_failed') {
			console.log('Платеж не удался:', data);
		}
	} catch (error) {
		console.error('Ошибка обработки сообщения:', error);
	}
};

onMounted(() => {
	window.addEventListener('message', handleMessage);
	checkBuy()
	startPaymentChecking()
});

onUnmounted(() => {
	window.removeEventListener('message', handleMessage);
});

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
		icon: 'material-symbols:person'
	}
])

const active = ref(1)

async function checkBuy() {
	const res = await $fetch.raw<IBuyedMarathon>(useApi() + `/check-buy?email=` + store.value.email);

	if (res.status === 200 && res._data) {

		states.buyed = res._data.buyed;

		if (states.buyed === true) {
			goNext()
		}
	}
}

async function goNext() {
	drawerContent.value.state = 'final-page';
}

async function goPrev() {
	drawerContent.value.state = 'get-email-page';
}
</script>

<template>
	<div style="height: 100%;" class="px-2">

		<UStepper v-model="active" :items="items" size="sm" class="w-full" disabled />

		<USeparator class="mt-4" />

		<base-page class="mt-2 height-calc" :loading="states.loading" :error-text="states.errorText" :show-error-btn="true"
			@refresh="handleRefreshPage">

			<div class="h-[100%] flex flex-col">

				<!-- Сообщение об успешной оплате -->
				<div v-if="states.paymentSuccess" class="success-message text-center py-8">
					<UIcon name="material-symbols:check-circle" class="text-green-500 text-6xl mb-4" />
					<h2 class="text-2xl font-bold text-green-600 mb-2">Оплата успешно завершена!</h2>
					<p class="text-gray-600">Доступ к тренировкам активирован</p>
				</div>
				
				<div v-else class="flex-1">
					<iframe v-if="store.buy_link" :src="store.buy_link" class="payment-webview" @load="handleWebViewLoad"
						@error="handleWebViewError" frameborder="0" allow="payment *" allowfullscreen scrolling="no" style="overflow: hidden;">
					</iframe>
				</div>

				<section class="l-buttons gap-1 mt-4 l-fixed">
					<UButton class="justify-center" size="lg" @click="goNext" :loading="states.loading"
						:disabled="!states.paymentSuccess">
						<span class="text-[16px] line-clamp-1">
							{{ states.loading ? 'Сохранение...' : 'Дальше' }}
						</span>
					</UButton>
					<UButton class="justify-center bg-black" size="lg" @click="goPrev" :loading="states.loading">
						<span class="text-[16px] line-clamp-1 text-white">
							Назад
						</span>
					</UButton>
				</section>
		
			</div>

		</base-page>
	</div>
</template>

<style scoped>
.payment-container {
	display: flex;
	flex-direction: column;
	gap: 20px;
	padding: 20px;
}

.payment-title {
	text-align: center;
	color: #333;
	font-size: 24px;
	font-weight: bold;
}

.webview-wrapper {
	width: 100%;
	height: 600px;
	border: 1px solid #e0e0e0;
	border-radius: 12px;
	overflow: hidden;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.payment-webview {
	width: 100%;
	height: 100%;
	border: none;
}

.payment-info {
	text-align: center;
	color: #666;
	font-size: 14px;
	line-height: 1.5;
}

.l-buttons {
	display: grid;
	grid-template-columns: 1fr;
}
.l-fixed {
	position: fixed;
    bottom: 50px;
    left: 0;
	width: 100%;
    padding: 0 30px;
	gap: 10px;
}

iframe {
	overflow: scroll;
}

.height-calc {
	height: calc(100% - 120px);
	border-radius: 8px;
    overflow: hidden;
}

.bg-black-custom {
	background: black;
    color: #de9f51;
    border: 1px solid #de9f51;
}

/* Адаптивность для мобильных устройств */
@media (max-width: 768px) {
	.webview-wrapper {
		height: 500px;
	}

	.payment-container {
		padding: 10px;
	}
}

@media (max-width: 480px) {
	.webview-wrapper {
		height: 400px;
	}

	.payment-title {
		font-size: 20px;
	}
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
	box-shadow: 0 0 0 1px rgb(163, 104, 15);
}
</style>