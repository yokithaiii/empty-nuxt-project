<script setup lang="ts">

const states = reactive({
	text: '',
	loading: false,
	errorText: null as null | string,
	disabled: false,
    phone: null as null | string,
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
							
						</h2>
					</template>

                    <ProximaPhone
                        class="l-label flex custom-phone-input"
                        label="Введите ваш номер телефона"
                        v-model="states.phone"
                    />

				</div>
			</div>
		</div>

		
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