<script setup lang="ts">
import { useWebAppViewport } from 'vue-tg'

const states = reactive({
	errorText: null as null | string,
});

onBeforeMount(() => {
	try {
		useWebAppViewport().expand()
	} catch(err: any) {
		states.errorText = err
		alert(err)
	}
})
</script>

<template>
	<div v-if="states.errorText" style="color: red; padding: 20px;">
		Error: {{ states.errorText }}
	</div>
	<UApp v-else>
		<div class="bg-[var(--ui-bg)]">
			<NuxtLayout>
				<NuxtPage />
			</NuxtLayout>
		</div>
	</UApp>
</template>
