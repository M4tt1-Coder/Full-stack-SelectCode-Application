<script lang="ts">
	import { userLogin } from '$lib/stores/signedInUserId';
	import { goto } from '$app/navigation';
	import { UserOutline, ClipboardCheckOutline, BookOpenOutline } from 'flowbite-svelte-icons';
	import { fade } from 'svelte/transition';

	/**
	 * Representive type for the all pages.
	 */
	type pages = 'User' | 'Task' | 'Project';

	/**
	 * Prop to define on which page we are on.
	 */
	export let page: pages = 'User';
</script>

<header transition:fade={{ duration: 700 }} class="w-screen p-5 h-fit bg-black">
	<div class="w-full h-full flex items-center justify-around">
		<!-- headline -->
		<div class="w-full h-full flex items-center justify-center">
			<p
				class="text-5xl text-white font-semibold transition-all duration-700 hover:scale-110 hover:text-slate-300"
			>
				{page}
			</p>
		</div>
		<!-- nav buttons -->
		<div class="w-full h-full grid grid-cols-2 grid-rows-1">
			{#if page !== 'User'}
				<!-- user button -->
				<div class="col-span-1 h-full w-full flex items-center justify-center">
					<button
						type="button"
						class="aspect-square h-fit w-fit"
						on:click={() => goto('/workspace/user')}
					>
						<UserOutline
							class="size-10 text-white transition-all duration-500 hover:bg-white hover:text-black rounded-full p-1"
						/>
					</button>
				</div>
			{/if}

			{#if page !== 'Task'}
				<!-- task button -->
				<div class="col-span-1 h-full w-full flex items-center justify-center">
					<button
						type="button"
						class="aspect-square h-fit w-fit"
						on:click={() => goto('/workspace/task')}
					>
						<ClipboardCheckOutline
							class="size-10 text-white transition-all duration-700 ease-in-out hover:bg-white hover:text-black rounded-full p-1"
						/>
					</button>
				</div>
			{/if}

			{#if page !== 'Project'}
				<!-- project button -->
				<div class="col-span-1 h-full w-full flex items-center justify-center">
					<button
						type="button"
						class="aspect-square h-fit w-fit"
						on:click={() => goto('/workspace/project')}
					>
						<BookOpenOutline
							class="size-10 text-white transition-all duration-700 ease-in-out hover:bg-white hover:text-black rounded-full p-1"
						/>
					</button>
				</div>
			{/if}
		</div>
		<!-- logout -->
		<div class="w-full h-full flex items-center justify-center">
			<button
				type="button"
				class="text-2xl text-white font-medium transition-all duration-700 ease-in-out hover:bg-white hover:text-black rounded-lg p-2"
				on:click={() => {
					// clears session storage
					userLogin.logout();
					goto('/');
				}}>Log Out</button
			>
		</div>
	</div>
</header>
