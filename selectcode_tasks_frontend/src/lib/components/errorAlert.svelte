<script lang="ts">
	import { fade } from 'svelte/transition';

	interface Props {
		errorTitle?: string;
		errorMessage?: string;
	}

	let { errorTitle = 'Error', errorMessage = 'An error occurred!' }: Props = $props();
</script>

<!-- error message container -->
<div
	transition:fade={{ duration: 500 }}
	class="absolute left-0 top-0 w-screen h-screen flex items-center justify-center bg-white z-50"
>
	<div class="w-3/4 sm:w-1/2 h-3/4 xsm:h-1/2 rounded-xl grid grid-cols-1 grid-rows-4 gap-7">
		<!-- error header -->
		<div
			class="row-span-1 flex items-center justify-center bg-black rounded-xl transition-all duration-500 hover:bg-slate-800"
		>
			<p
				class="text-white text-5xl font-sans font-semibold transition-all duration-500 hover:scale-105 hover:text-red-400"
			>
				Error
			</p>
		</div>
		<!-- error information container -->
		<div
			class="row-span-3 bg-black rounded-xl grid grid-cols-1 grid-rows-3 transition-all duration-500 hover:bg-slate-800"
		>
			<!-- error title -->
			<div class="row-span-1 flex items-center justify-center">
				<p
					class="text-white font-sans font-semibold text-3xl transition-all duration-500 hover:scale-105"
				>
					{errorTitle}
				</p>
			</div>
			<!-- error message -->
			<div class="row-span-2 flex items-center justify-center">
				<p
					class="text-center text-white text-xl font-medium w-3/5 hyphens-auto transition-all duration-500 hover:text-2xl"
				>
					{errorMessage}
				</p>
			</div>
		</div>
	</div>
</div>

<style lang="postcss"></style>
